import { OpenAPIRoute } from 'chanfana'
import { BskyAgent } from '@atproto/api'
import { checkAuth, generateOAuthHeader } from 'misc/utils'

type twtRes = { data: { id:string, txt:string } }

export class PostSubway extends OpenAPIRoute {
  schema = {
    tags: ['Social'],
    summary: 'Posts to Twitter and Bluesky whenever i buy a subway',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              amount: { type: 'string' },
              date: { type: 'string' },
              name: { type: 'string' },
              merchant: { type: 'string' },
              cardOrPass: { type: 'string' },
            },
            required: ['amount', 'date', 'name', 'merchant', 'cardOrPass'],
            example: {
              amount: '£3.73',
              date: '21 Jul 2025 at 16:47',
              name: 'name',
              merchant: 'subway',
              cardOrPass: 'card'
            }
          }
        }
      }
    },
    responses: {
      '201': {
        description: '',
        content: {
          'application/json': {
            schema: {
              properties: {
                success: { type: 'boolean', example: true },
                msg: { type: 'string', example: 'posts successfully made' },
                links: {
                  type: 'array',
                  example: [
                    'https://bsky.app/profile/invisyarcticfox.uk/post/',
                    'https://twitter.com/invisyarcticfox/status/'
                  ]
                }
              }
            }
          }
        }
      },
      '401': {
        description: 'unauthorised',
        content: {
          'application/json': {
            schema: {
              properties: {
                success: { type: 'boolean', example: false },
                msg: { type: 'string', example: 'unauthorised' }
              }
            }
          }
        }
      },
    }
  }

  async handle(c) {
    try {
      if (!checkAuth(c)) { return c.json({ success: false, msg: 'unauthorised' }, 401) }
      
      const req = await c.req.json()
      const postTxt = `i just bought a subway for ${req.amount} on ${req.date} :3`
      console.log(postTxt)
      
      
      async function postToBluesky(text:string):Promise<string> {
        const bskyAgent = new BskyAgent({ service: 'https://bsky.social' })
        await bskyAgent.login({ identifier: 'invisyarcticfox.uk', password: c.env.BSKY_APP_PASS })
        const bskyPost = await bskyAgent.post({ text: text, createdAt: new Date().toISOString() })
        const postId = bskyPost.uri.split('app.bsky.feed.post/')[1]

        console.log(postId)
        return postId
      }
      async function postToTwitter(text:string):Promise<string> {
        const twtAuthHeader = generateOAuthHeader({
          apiKey: c.env.TWT_API_KEY,
          apiSecret: c.env.TWT_API_SECRET,
          accessToken: c.env.TWT_ACCESS_TOKEN,
          accessSecret: c.env.TWT_ACCESS_SECRET
        })

        const res = await fetch('https://api.x.com/2/tweets', {
          method: 'POST',
          headers: { Authorization: twtAuthHeader, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'text': text })
        })
        const d:twtRes = await res.json()
        const postId = d.data.id

        console.log(postId)
        return postId
      }

      const [ bskyPostId, twtPostId ] = await Promise.all([
        postToBluesky(postTxt),
        postToTwitter(postTxt)
      ])

      
      return c.json({
        success: true,
        msg: 'posts successfuly made',
        links: [
          `https://bsky.app/profile/invisyarcticfox.uk/post/${bskyPostId}`,
          `https://twitter.com/invisyarcticfox/status/${twtPostId}`
        ]
      })
    } catch (error) {
      console.error(error)
      return c.json({ success: false, msg: 'Internal server error' }, 500 )
    }
  }
}
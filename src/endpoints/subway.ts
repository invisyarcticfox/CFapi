import { Bool, contentJson, OpenAPIRoute, Str } from 'chanfana'
import { AppContext } from '../types'
import { checkAuth } from '../utils'
import { BskyAgent } from '@atproto/api'


export class postSubway extends OpenAPIRoute {
  public schema = {
    tags: ['Social'],
    summary: 'Posts about when i get a subway',
    responses: {
      '201': {
        description: 'Success',
        ...contentJson({ success: Bool, msg: Str({example:'Success'}) })
      },
      '401': {
        description: 'Unauthorised',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'Unauthorised'}) })
      },
      '500': {
        description: 'Internal Server Error',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'Internal Server Error'}) })
      }
    }
  }
  
  public async handle(c:AppContext) {
    try {
      if (!checkAuth(c)) { return c.json({ success: false, error: 'Unauthorised' }, 401 ) }

      async function editBskyBio() {
        const bskyAgent = new BskyAgent({ service: 'https://bsky.social' })
        await bskyAgent.login({ identifier: 'invisyarcticfox.uk', password: c.env.BSKY_APP_PASS })
        const profile = await bskyAgent.getProfile({ actor: bskyAgent.session?.did! })
        let currentBio = profile.data.description ?? ''

        const now = new Date()
        const nowDate = now.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: 'Europe/London'
        })
        const nowTime = now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Europe/London'
        })
        const bioTxt = `last bought a subway on ${nowDate} at ${nowTime}`

        const regex = /\n?last bought a .* on .*$/i

        let updatedBio
        if (regex.test(currentBio)) {
          updatedBio = currentBio.replace(regex, `\n${bioTxt}`)
        } else {
          updatedBio = currentBio.trimEnd() + `\n\n${bioTxt}`
        }

        await bskyAgent.upsertProfile((existing) => ({
          ...existing,
          description: updatedBio
        }))
      }
      await editBskyBio()

      return c.json({ success: true, msg: 'Bluesky bio successfully updated' }, 201 )
    } catch (error) {
      console.error(error)
      return c.json({ success: false, error: 'Internal Server Error' }, 500 )
    }
  }
}
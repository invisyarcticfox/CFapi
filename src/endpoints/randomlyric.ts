import { OpenAPIRoute, Obj } from 'chanfana'
import { RandomLyricSchema } from 'misc/types'
import { checkAuth } from 'misc/utils'


export class GetRandomLyric extends OpenAPIRoute {
  schema = {
    tags: ['Songs'],
    summary: '',
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: RandomLyricSchema
          },
        },
      },
    },
  }

  async handle(c) {
    try {
      const res = await c.env.API.get('lyrics.json')
      const d = await res.json()
      
      const randomIndex = Math.floor(Math.random() * d.length)
      const randomLyric = d[randomIndex]
      
      return c.json({ lyric: randomLyric }, 200)
    } catch (error) {
      console.error(error);
      return c.json({ success: false, error: 'Failed to get lyrics' }, 500)
    }
  }
}

export class AddLyric extends OpenAPIRoute {
  schema = {
    tags: ['Songs'],
    summary: '',
    requestBody: {
      content: {
        'text/plain': {
          schema: {
            type: 'string',
            example: 'this is a new lyric'
          }
        }
      },
    },
    responses: {
      '201': {
        content: {
          'application/json': {
            schema: Obj({
              success: true,
              msg: 'reminders successfully added'
            }),
          }
        }
      },
      '401': {
        content: {
          'application/json': {
            schema: Obj({
              success: false,
              error: 'unautorised'
            }),
          }
        }
      }
    }
  }

  async handle(c) {
    try {
      if (!checkAuth(c)) return c.json({ error: 'unautorised' }, 401 )

      const newLyric = c.req.text()

      if (!newLyric || newLyric.trim() === '') return c.json({ error: 'lyric cannot be empty' }, 400)

      const res = await c.env.API.get('lyrics.json')
      const d = await res.json()

      d.push(newLyric.trim())

      await c.env.API.put('lyrics.json', JSON.stringify(d), {
        httpMetadata: { contentType: 'application/json' }
      })
      
      return c.json({ success: true, msg: 'lyric successfully added' }, 201)
    } catch (error) {
      console.error(error)
      return c.json({ success: false, error: 'Failed to update lyrics' }, 500)
    }
  }
}
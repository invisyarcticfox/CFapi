import { OpenAPIRoute } from 'chanfana'
import { LyricSchema } from 'misc/types'
import { checkAuth } from 'misc/utils'


export class GetRandomLyric extends OpenAPIRoute {
  schema = {
    tags: ['Songs'],
    summary: 'Get a random lyric from a database',
    responses: {
      '200': {
        description: 'A random lyric',
        content: {
          'application/json': {
            schema: LyricSchema
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
      return c.json({ success: false, msg: 'Failed to get lyrics' }, 500)
    }
  }
}

export class AddLyric extends OpenAPIRoute {
  schema = {
    tags: ['Songs'],
    summary: 'Add a lyric from a database',
    requestBody: {
      required: true,
      content: {
        'text/plain': {
          schema: {
            type: 'string',
            example: '\'this is a new lyric\''
          }
        }
      },
    },
    responses: {
      '201': {
        description: 'successfully added a lyric',
        content: {
          'application/json': {
            schema: {
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                msg: {
                  type: 'string',
                  example: 'lyric added successfully'
                }
              }
            }
          }
        },
      },
      '415': {
        description: 'invalid Content-Type',
        content: {
          'application/json': {
            schema: {
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                msg: {
                  type: 'string',
                  example: 'invalid Content-Type'
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
                success: {
                  type: 'boolean',
                  example: false
                },
                msg: {
                  type: 'string',
                  example: 'unauthorised'
                }
              }
            }
          }
        }
      },
      '400': {
        description: 'bad request',
        content: {
          'application/json': {
            schema: {
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                msg: {
                  type: 'string',
                  example: 'lyric cannot be empty'
                }
              }
            }
          }
        }
      },
    },
  }

  async handle(c) {
    try {
      if (!checkAuth(c)) {
        return c.json({
          success: false,
          msg: 'unauthorised'
        }, 401 )
      }
      
      if (!c.req.header('Content-Type').startsWith('text/plain')) {
        return c.json({
          success: false,
          msg: 'invalid Content-Type'
        }, 415)
      }

      const newLyric = await c.req.text()

      if (!newLyric || newLyric.trim() === '') {
        return c.json({
          success: false,
          msg: 'lyric cannot be empty'
        }, 400)
      }

      const res = await c.env.API.get('lyrics.json')
      const d = await res.json()

      d.push(newLyric.trim())

      await c.env.API.put('lyrics.json', JSON.stringify(d), {
        httpMetadata: { contentType: 'application/json' }
      })
      
      return c.json({ success: true, msg: 'lyric successfully added' }, 201)
    } catch (error) {
      console.error(error)
      return c.json({ success: false, msg: 'Failed to update lyrics' }, 500)
    }
  }
}
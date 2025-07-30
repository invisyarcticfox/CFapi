import { OpenAPIRoute, Obj, Str } from 'chanfana'
import { RemindersSchema } from 'misc/types'
import { checkAuth, generateId } from 'misc/utils'


export class GetReminders extends OpenAPIRoute {
  schema = {
    tags: ['Reminders'],
    summary: 'Get reminders',
    responses: {
      '200': {
        description: 'Either a list of reminders or just an empty array',
        content: { 'application/json': { schema: RemindersSchema } }
      }
    }
  }

  async handle(c) {
    try {
      const res = await c.env.API.get('reminders.json')
      const d = await res.json()
      return c.json(d)
    } catch (error) {
      console.error(error)
      return c.json({ success: false, msg: 'Failed to get reminders' }, 500)
    }
  }
}

export class AddReminders extends OpenAPIRoute {
  schema = {
    tags: ['Reminders'],
    summary: 'Add a reminder',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              details: { type: 'array', items: { type: 'string' } }
            },
            required: ['title'],
            example: {
              title: 'do this thing',
              details: [ 'some info', 'some more info' ]
            }
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'successfully added a reminder',
        content: {
          'application/json': {
            schema: {
              properties: {
                success: { type: 'boolean', example: true },
                msg: { type: 'string', example: 'reminder added successfully' }
              }
            }
          }
        },
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
      '400': {
        description: 'bad request',
        content: {
          'application/json': {
            schema: {
              properties: {
                success: { type: 'boolean', example: false },
                msg: { type: 'string', example: 'expected an array' }
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

      const data = await c.req.json()
  
      if (!Array.isArray(data)) { return c.json({ success: false, msg: 'Expected an array in the request body' }, 400) }
  
      const result = data.map(item => ({
        ...item,
        id: generateId()
      }))
      
      await c.env.API.put('reminders.json', JSON.stringify(result), {
        httpMetadata: { contentType: 'application/json' }
      })

      if (data.length === 1 ) {
        return c.json({ success: true, msg: 'reminder successfully added' }, 201)
      } else {
        return c.json({ success: true, msg: 'reminders successfully added' }, 201)
      }
      
    } catch (error) {
      console.error(error)
      return c.json({ success: false, msg: 'Failed to update reminders' }, 500)
    }
  }
}

export class DeleteReminders extends OpenAPIRoute {
  schema = {
    tags: ['Reminders'],
    summary: 'Delete a reminder',
    request: {
      query: Obj({
        id: Str({ description: 'reminder id', example: 'a6HL27' })
      })
    },
    responses: {
      '200': {
        description: 'successfully deleted a reminder',
        content: {
          'application/json': {
            schema: {
              properties: {
                success: { type: 'boolean', example: true },
                msg: { type: 'string', example: 'reminder deleted successfully' }
              }
            }
          }
        },
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
      '400': {
        description: 'bad request',
        content: {
          'application/json': {
            schema: {
              properties: {
                success: { type: 'boolean', example: false },
                msg: { type: 'string', example: 'missing or empty \'id\' parameter' }
              }
            }
          }
        }
      },
      '404': {
        description: 'not found',
        content: {
          'application/json': {
            schema: {
              properties: {
                success: { type: 'boolean', example: false },
                msg: { type: 'string', example: 'no matching reminders found for deletion' }
              }
            }
          }
        }
      },
    }
  }

  async handle(c) {
    try {
      if (!checkAuth(c)) { return c.json({ success: false, msg: 'unautorised' }, 401) }

      const query = await c.req.query()

      if (!query.id || query.id.trim() === '') { return c.json({ success: false, msg: 'Missing or empty \'ID\' parameter' }, 400) }
      
      const idsToDelete = query.id.split(',').map(id => id.trim())

      const res = await c.env.API.get('reminders.json')
      let data = await res.json()
      
      if (!Array.isArray(data)) data = []
      
      const initialLength = data.length
      data = data.filter((item: { id: string }) => !idsToDelete.includes(item.id))
      const deletedCount = initialLength - data.length

      if (deletedCount === 0) { return c.json({ success: false, msg: 'No matching reminders found for deletion' }, 404) }

      await c.env.API.put('reminders.json', JSON.stringify(data), { httpMetadata: { contentType: 'application/json' } })

      if (deletedCount === 1 ) {
        return c.json({ success: true, msg: `reminder '${query.id}' successfully deleted` }, 200)
      } else {
        return c.json({ success: true, msg: `reminders '${query.id}' successfully deleted` }, 200)
      }
    } catch (error) {
      console.error(error)
      return c.json({ success: false, msg: 'Failed to delete reminders' }, 500)
    }
  }
}
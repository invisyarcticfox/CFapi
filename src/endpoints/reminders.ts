import { OpenAPIRoute, Str, Obj } from 'chanfana'
import { GetRemindersSchema } from 'misc/types'
import { checkAuth, generateId } from 'misc/utils'


export class GetReminders extends OpenAPIRoute {
  schema = {
    tags: ['Reminders'],
    summary: 'Display a list of reminders',
    responses: {
      '200': {
        description: '',
        content: {
          'application/json': {
            schema: GetRemindersSchema
          }
        }
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
      return c.json({ success: false, error: 'Failed to get reminders' }, 500)
    }
  }
}

export class AddReminder extends OpenAPIRoute {
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
              details: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['title'],
            example: {
              title: 'do this thing',
              details: [
                'some info',
                'some more info'
              ]
            }
          }
        }
      }
    },
    responses: {
      '201': {
        content: {
          'application/json': {
            schema: Obj({
              success: true,
              msg: 'reminder saved successfully with id: \'ID\''
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

      const data = await c.req.json()
  
      if (!Array.isArray(data)) return c.json({ error: 'Expected an array in the request body' }, 400 )
  
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
      return c.json({ success: false, error: 'Failed to update reminders' }, 500)
    }
  }
}

export class DeleteReminder extends OpenAPIRoute {
  schema = {
    tags: ['Reminders'],
    summary: 'Delete a reminder by id',
    request: {
      query: Obj({
        id: Str({ description: 'reminder id', example: 'a6HL27' })
      })
    },
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: Obj({
              success: true,
              msg: 'reminder \'ID\' successfully deleted'
            }),
          }
        }
      },
      '400': {
        content: {
          'application/json': {
            schema: Obj({
              success: false,
              error: 'missing id parameter'
            })
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

      const query = await c.req.query()
      if (!query.id || query.id.trim() === '') return c.json({ error: 'Missing or empty \'ID\' parameter' }, 400 )
      
      const idsToDelete = query.id.split(',').map(id => id.trim())

      const res = await c.env.API.get('reminders.json')
      let data = await res.json()
      
      if (!Array.isArray(data)) data = []
      
      const initialLength = data.length
      data = data.filter(item => !idsToDelete.includes(item.id))
      const deletedCount = initialLength - data.length

      if (deletedCount === 0) return c.json({ success: false, msg: 'No matching reminders found for deletion' }, 404 )

      await c.env.API.put('reminders.json', JSON.stringify(data), {
        httpMetadata: { contentType: 'application/json' }
      })

      const msg =
        deletedCount === 1
          ? `reminder '${query.id}' successfully deleted`
          : `reminders '${query.id}' successfully deleted`

      return c.json({ success: true, msg: msg }, 200)
    } catch (error) {
      console.error(error)
      return c.json({ success: false, error: 'Failed to delete reminders' }, 500)
    }
  }
}
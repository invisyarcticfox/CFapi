import { OpenAPIRoute, Str, Arr, Obj } from 'chanfana';
import { GetRemindersSchema } from 'misc/types';
import { checkAuth, generateId } from 'misc/utils';


export class GetRemindersRoute extends OpenAPIRoute {
  schema = {
    tags: ['Reminders'],
    summary: 'Display a list of reminders',
    responses: {
      '200': {
        description: '',
        content: {
          'application/json': {
            schema: Arr(GetRemindersSchema).nullable(),
          },
        },
      },
    },
  };

  async handle(c) {
    const res = await c.env.CDN.get('reminders.json')
    const data = await res.json()
    return c.json(data)
  }
}

export class AddReminderRoute extends OpenAPIRoute {
  schema = {
    tags: ['Reminders'],
    summary: 'Add a reminder',
    requestBody: {
      description: '',
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
                'some more info',
              ]
            }
          }
        }
      }
    },
    responses: {
      '201': {
        description: '',
        content: {
          'text/plain': {
            schema: Str({ example: 'reminder saved successfully with id: "ID"' }),
          },
        },
      },
      '401': {
        description: '',
        content: {
          'text/plain': {
            schema: Str({ example: 'unauthorized' }),
          },
        },
      },
    },
  };

  async handle(c) {
    try {
      if (!checkAuth(c)) {
        return c.json({ error: 'unauthorized' }, 401)
      }

      const data = await c.req.json()
  
      if (!Array.isArray(data)) {
        return c.json({ error: 'Expected an array in the request body' }, 400)
      }
  
      const result = data.map(item => ({
        ...item,
        id: generateId()
      }))
      
      await c.env.CDN.put('reminders.json', JSON.stringify(result), {
        httpMetadata: {
          contentType: 'application/json'
        }
      })
      
      return c.json({ success: true, msg: 'reminders successfully added!' }, 201)
    } catch (error) {
      return c.json({ success: false, error: 'Failed to update reminders.json' }, 500)
    }
  }
}

export class DeleteReminderRoute extends OpenAPIRoute {
  schema = {
    tags: ['Reminders'],
    summary: 'Delete a reminder by id',
    request: {
      query: Obj({
        id: Str({ description: 'reminder id', example: 'a6HL27' })
      }),
    },
    responses: {
      '200': {
        description: '',
        content: {
          'text/plain': {
            schema: Str({ example: 'reminder "ID" successfully deleted'}),
          },
        },
      },
      '400': {
        description: '',
        content: {
          'text/plain': {
            schema: Str({ example: 'missing id parameter'}),
          },
        },
      },
      '401': {
        description: '',
        content: {
          'text/plain': {
            schema: Str({ example: 'unauthorized' }),
          },
        },
      },
    },
  };

  async handle(c) {
    try {
      if (!checkAuth(c)) {
        return c.json({ error: 'unauthorized' }, 401)
      }

      const query = await c.req.query()

      if (!query.id || query.id.trim() === '') {
        return c.json({ error: 'Missing or empty \'ID\' parameter' }, 400);
      }

      const res = await c.env.CDN.get('reminders.json')
      let data = await res.json()

      data = data.filter((item) => item.id !== query.id)

      await c.env.CDN.put('reminders.json', JSON.stringify(data), {
        httpMetadata: {
          contentType: 'application/json'
        }
      })
      
      return c.json({ success: true, msg: `reminder '${query.id}' successfully deleted!` }, 200)
    } catch (error) {
      return c.json({ success: false, error: 'Failed to update reminders.json' }, 500)
    }
  }
}
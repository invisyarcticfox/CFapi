import { OpenAPIRoute, Str, Arr, Obj } from 'chanfana';
import { GetRemindersSchema } from 'types';


function generateId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

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
    const obj = await c.env.CDN.get('reminders.json')
    const objRes = await obj.json()
    return c.json(objRes)
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
    const data = await c.req.json()

    try {
      return c.json({ data, id: generateId() })
    } catch (error) {
      console.log(error)
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
    const query = await c.req.query()

    try {
      if (!query.id || query.id.trim() === '') {
        return c.json({ error: 'Missing or empty \'ID\' parameter' }, 400);
      }

      console.log(query.id)
    } catch (error) {
      console.log(error)
    }
  }
}
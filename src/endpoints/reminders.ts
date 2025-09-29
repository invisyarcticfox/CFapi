import { contentJson, OpenAPIRoute, Str, Obj, Arr, Bool } from 'chanfana'
import type { AppContext, Reminders } from '../types'
import { checkAuth, generateId } from '../utils'


export class getReminders extends OpenAPIRoute {
  public schema = {
    tags: ['Reminders'],
    summary: 'Gets reminders, if any',
    responses: {
      '200': {
        description: 'Valid JSON file with reminders',
        ...contentJson([{
          txt: Str,
          details: Arr(Str).optional,
          id: Str,
        }])
      },
      '204': {
        description: 'Valid JSON file but is empty',
        ...contentJson([Str])
      },
      '404': {
        description: 'File Not Found',
        ...contentJson({ success: Bool, error: Str })
      },
      '500': {
        description: 'Internal Server Error',
        ...contentJson({ success: Bool, error: Str })
      }
    }
  }
  
  public async handle(c:AppContext) {
    try {
      const res = await c.env.API.get('reminders.json')
      if (!res) { return c.json({ success: false, error: 'File Not Found' }, 404 ) }
      const d:Reminders[] = await res.json()
      if (Array.isArray(d) && d.length === 0) { return c.json([], 200) }
      return c.json(d, 200)
    } catch (error) {
      console.error(error)
      return c.json({ success: false, error: 'Internal Server Error' }, 500 )
    }
  }
}

export class addReminders extends OpenAPIRoute {
  public schema = {
    tags: ['Reminders'],
    summary: 'Add reminders',
    request: {
      body: contentJson([{
        txt: Str,
        details: Arr(Str).optional
      }])
    },
    responses: {
      '201': {
        description: 'Success',
        ...contentJson({ success: Bool, msg: Str })
      },
      '400': {
        description: 'Malformed BODY request',
        ...contentJson({ success: Bool, error: Str })
      },
      '401': {
        description: 'Unauthorised',
        ...contentJson({ success: Bool, error: Str })
      },
      '404': {
        description: 'File Not Found',
        ...contentJson({ success: Bool, error: Str })
      },
      '500': {
        description: 'Internal Server Error',
        ...contentJson({ success: Bool, error: Str })
      }
    }
  }
  
  public async handle(c:AppContext) {
    try {
      if (!checkAuth(c)) { return c.json({ success: false, error: 'Unauthorised' }, 401 ) }

      const req = await c.req.json()

      if (!Array.isArray(req)) { return c.json({ success: false, error: 'Array expected' }, 400 ) }

      const result = req.map(item => ({
        ...item,
        id: generateId()
      }))

      await c.env.API.put('reminders.json', JSON.stringify(result), { httpMetadata: { contentType: 'application/json' } })

      if (req.length === 1 ) {
        return c.json({ success: true, msg: 'Reminder successfully added' }, 201)
      } else {
        return c.json({ success: true, msg: 'Reminders successfully added' }, 201)
      }
    } catch (error) {
      console.error(error)
      return c.json({ success: false, error: 'Internal Server Error' }, 500 )
    }
  }
}

export class deleteReminders extends OpenAPIRoute {
  public schema = {
    tags: ['Reminders'],
    summary: 'Delete reminders, if any',
    responses: {
      '200': {
        description: 'Successfully deleted',
        ...contentJson({ success: Bool, msg: Str })
      },
      '400': {
        description: 'Incorrect query parameter',
        ...contentJson({ success: Bool, error: Str })
      },
      '401': {
        description: 'Unauthorised',
        ...contentJson({ success: Bool, error: Str })
      },
      '404': {
        description: 'File Not Found',
        ...contentJson({ success: Bool, error: Str })
      },
      '500': {
        description: 'Internal Server Error',
        ...contentJson({ success: Bool, error: Str })
      }
    }
  }
  
  public async handle(c:AppContext) {
    try {
      if (!checkAuth(c)) { return c.json({ success: false, error: 'Unauthorised' }, 401 ) }
      // maybe fix this one day, perpetual 404
    } catch (error) {
      console.error(error)
      return c.json({ success: false, error: 'Internal Server Error' }, 500 )
    }
  }
}
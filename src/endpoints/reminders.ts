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
          details: Arr(Str,{required:false}),
          id: Str,
        }])
      },
      '204': {
        description: 'Valid JSON file but is empty',
        ...contentJson([0])
      },
      '404': {
        description: 'File Not Found',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'File Not Found'}) })
      },
      '500': {
        description: 'Internal Server Error',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'Internal Server Error'}) })
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
        details: Arr(Str,{required:false})
      }])
    },
    responses: {
      '201': {
        description: 'Success',
        ...contentJson({ success: Bool, msg: Str({example:'Success'}) })
      },
      '400': {
        description: 'Malformed BODY',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'Malformed BODY'}) })
      },
      '401': {
        description: 'Unauthorised',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'Unauthorised'}) })
      },
      '404': {
        description: 'File Not Found',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'File Not Found'}) })
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

      const req = await c.req.json()

      if (!Array.isArray(req)) { return c.json({ success: false, error: 'Array expected' }, 400 ) }

      const result = req.map(res => ({
        ...res,
        id: generateId()
      }))

      await c.env.API.put('reminders.json', JSON.stringify(result), { httpMetadata: { contentType: 'application/json' } } )

      if (req.length === 1 ) {
        return c.json({ success: true, msg: 'Reminder successfully added' }, 201 )
      } else {
        return c.json({ success: true, msg: 'Reminders successfully added' }, 201 )
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
    request: {
      query: Obj({ id: Str({example:'sjas9a6v'}) }),
      headers: Obj({ Authorization: Str({example:'Bearer something'}) })
    },
    responses: {
      '200': {
        description: 'Successfully deleted',
        ...contentJson({ success: Bool, msg: Str({example:'Successfully deleted'}) })
      },
      '400': {
        description: 'Incorrect query parameter',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'Incorrect query parameter'}) })
      },
      '401': {
        description: 'Unauthorised',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'Unauthorised'}) })
      },
      '404': {
        description: 'File Not Found',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'File Not Found'}) })
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
      
      const query = c.req.query()
      if (!query.id || !query.id.trim() ) { return c.json({ success: false, error: 'Incorrect \'ID\' parameter.' }, 400 ) }
      
      const deleteIds = query.id.split(',').map(id => id.trim())

      const res = await c.env.API.get('reminders.json')
      if (!res) { return c.json({ success: false, error: 'File Not Found' }, 404 ) }
      let data:Reminders[] = await res.json()

      if (!Array.isArray(data)) { data = [] }

      const initLength = data.length
      data = data.filter(item => !deleteIds.includes(item.id))
      const deleteCount = initLength - data.length

      await c.env.API.put('reminders.json', JSON.stringify(data), { httpMetadata: { contentType: 'application/json' } } )

      if (deleteCount === 0) { return c.json({ success: false, msg: 'No matching reminders found for deletion' }, 404) }
      
      const plural = deleteCount > 1 ? 'reminders' : 'reminder'
      return c.json({ success: true, msg: `${plural} '${query.id}' successfully deleted` }, 200)
    } catch (error) {
      console.error(error)
      return c.json({ success: false, error: 'Internal Server Error' }, 500 )
    }
  }
}
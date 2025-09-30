import { contentJson, OpenAPIRoute, Obj, Str, Bool, Num } from 'chanfana'
import type { AppContext, Jetspotter } from '../types'


export class getPlanes extends OpenAPIRoute {
  public schema = {
    tags: ['Planes'],
    summary: 'Get history of plane notifications',
    responses: {
      '200': {
        description: 'Valid JSON file',
        ...contentJson({
          reg: Obj({
            type: Str,
            operator: Str,
            seenCount: Num,
            lastSeen: Str
          })
        })
      },
      '404': {
        description: 'File Not Found',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'File Not Found'}) })
      },
      '500': {
        description: 'Internal Server Error',
        ...contentJson({ success: Bool({example:'false'}), error: Str({example:'Internal Server Error'}) })
      }
    },
  }
  
  public async handle(c:AppContext) {
    try {
      const res = await c.env.API.get('planes.json')
      if (!res) { return c.json({ success: false, error: 'File Not Found' }, 404 ) }
      const d:Jetspotter = await res.json()

      const sortedEntries = Object.entries(d).sort((a, b) => b[1].seenCount - a[1].seenCount)
      const sortedJson = Object.fromEntries(sortedEntries)
      return sortedJson
    } catch (error) {
      console.error(error)
      return c.json({ success: false, error: 'Internal Server Error' }, 500 )
    }
  }
}
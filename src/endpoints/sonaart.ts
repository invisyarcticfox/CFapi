import { contentJson, OpenAPIRoute, Str, Bool } from 'chanfana'
import type { AppContext, SonaArt } from '../types'


export class getSonaArt extends OpenAPIRoute {
  public schema = {
    tags: ['Art'],
    summary: 'Gets sona art information in JSON',
    responses: {
      '200': {
        description: 'Valid JSON file',
        ...contentJson([{
          artist: Str,
          artisturl: Str,
          file: Str,
          date: Str,
          freaky: Bool({required:false})
        }])
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
      const res = await c.env.API.get('sonaart.json')
      if (!res) { return c.json({ success: false, error: 'File Not Found' }, 404 ) }
      const d:SonaArt[] = await res.json()
      return c.json(d, 200)
    } catch (error) {
      console.error(error)
      return c.json({ success: false, error: 'Internal Server Error' }, 500 )
    }
  }
}
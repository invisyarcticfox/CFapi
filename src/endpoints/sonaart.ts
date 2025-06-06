import { OpenAPIRoute } from 'chanfana'
import { SonaArtSchema } from 'misc/types'


export class GetSonaArt extends OpenAPIRoute {
  schema = {
    tags: ['Art'],
    summary: 'Get sona art information',
    responses: {
      '200': {
        description: 'A list of all my sona\'s art, along with artist information and dates',
        content: {
          'application/json': {
            schema: SonaArtSchema
          },
        },
      },
    },
  }

  async handle(c) {
    try {
      const res = await c.env.API.get('sonaart.json')
      const d = await res.json()
      return c.json(d)
    } catch (error) {
      console.error(error)
      return c.json({ success: false, msg: 'Internal server error' }, 500 )
    }
  }
}
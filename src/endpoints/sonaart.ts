import { OpenAPIRoute } from 'chanfana'
import { SonaArtSchema } from 'misc/types'


export class SonaArt extends OpenAPIRoute {
  schema = {
    tags: ['Art'],
    summary: 'Display information about my sona\'s art',
    responses: {
      '200': {
        description: '',
        content: {
          'application/json': {
            schema: SonaArtSchema,
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
      return c.json({ success: false, error: 'Internal server error' }, 500 )
    }
  }
}
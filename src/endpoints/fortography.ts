import { OpenAPIRoute } from 'chanfana'
import { FortographySchema } from 'misc/types'


export class Fortography extends OpenAPIRoute {
  schema = {
    tags: ['Art'],
    summary: 'Display a list of filenames for fortography',
    responses: {
      '200': {
        description: '',
        content: {
          'application/json': {
            schema: FortographySchema,
          },
        },
      },
    },
  }

  async handle(c) {
    try {
      const res = await c.env.API.get('fortography.json')
      const d = await res.json()
      return c.json(d)
    } catch (error) {
      console.error(error)
      return c.json({ success: false, error: 'Failed to get fortography' }, 500)
    }
  }
}
import { OpenAPIRoute } from 'chanfana'
import { FortographySchema } from 'misc/types'


export class GetFortography extends OpenAPIRoute {
  schema = {
    tags: ['Art'],
    summary: 'Get fortography screenshots',
    responses: {
      '200': {
        description: 'A list of file names for fortography screenshots',
        content: {
          'application/json': {
            schema: FortographySchema
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
      return c.json({ success: false, msg: 'Failed to get fortography' }, 500)
    }
  }
}
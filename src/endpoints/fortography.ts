import { OpenAPIRoute, Arr } from 'chanfana';
import { FortographySchema } from 'misc/types';


export class FortographyRoute extends OpenAPIRoute {
  schema = {
    tags: ["Art"],
    summary: 'Display a list of filenames for fortography',
    responses: {
      '200': {
        description: '',
        content: {
          'application/json': {
            schema: Arr(FortographySchema),
          },
        },
      },
    },
  };

  async handle(c) {
    try {
      const res = await c.env.API.get('fortography.json')
      const d = await res.json()
      return d
    } catch (error) {
      return error
    }
  }
}
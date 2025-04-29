import { OpenAPIRoute, Arr } from 'chanfana';
import { SonaArtSchema } from 'misc/types';


export class SonaArtRoute extends OpenAPIRoute {
  schema = {
    tags: ["Art"],
    summary: 'Display information about my sona\'s art',
    responses: {
      '200': {
        description: '',
        content: {
          'application/json': {
            schema: Arr(SonaArtSchema),
          },
        },
      },
    },
  };

  async handle(c) {
    try {
      const res = await c.env.API.get('sonaart.json')
      const d = await res.json()
      return d
    } catch (error) {
      return error
    }
  }
}
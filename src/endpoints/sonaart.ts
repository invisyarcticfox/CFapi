import { OpenAPIRoute, Arr } from 'chanfana';
import { SonaArtSchema } from 'misc/types';
import data from './json/sonaart.json';


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

  async handle(c) { return data }
}
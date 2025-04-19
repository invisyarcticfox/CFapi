import { OpenAPIRoute, Arr } from 'chanfana';
import { FortographySchema } from 'misc/types';
import data from './json/fortography.json';


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

  async handle(c) { return data }
}
import { OpenAPIRoute, Str, Num } from 'chanfana';
import { z } from 'zod';
import { SonaArtSchema } from 'types';
import data from './json/sonaart.json';

export class SonaArtRoute extends OpenAPIRoute {
  schema = {
    summary: 'Display information about sona art',
    responses: {
      '200': {
        description: '',
        content: {
          'application/json': {
            schema: z.array(SonaArtSchema),
          },
        },
      },
    },
  };

  async handle(c) {
    return data
  }
}
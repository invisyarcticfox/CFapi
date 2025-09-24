import { OpenAPIRoute, Obj, Str } from 'chanfana'
import { LetterboxdSchema } from 'misc/types'
import Parser from 'rss-parser'
const parser = new Parser()


export class GetLetterboxd extends OpenAPIRoute {
  schema = {
    tags: ['Social'],
    summary: 'Get Letterboxd RSS feed as json',
    request: { query: Obj({ username: Str({ description: 'username', example: 'invisyarcticfox' }).optional() }) },
    responses: {
      '200': {
        description: '',
        content: { 'application/json': { schema: LetterboxdSchema } },
      },
    },
  }

  async handle(c) {
    try {
      const query = await c.req.query()
      const username = query.username || 'invisyarcticfox'
      const res = await fetch(`https://letterboxd.com/${username}/rss`)
      const d = await res.text()
      const xml = await parser.parseString(d)
      return c.json(xml)
    } catch (error) {
      console.error(error)
    }
  }
}
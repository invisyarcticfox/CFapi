import { contentJson, OpenAPIRoute, Str, Arr, Bool } from 'chanfana'
import { AppContext } from '../types'
import Parser from 'rss-parser'
const parser = new Parser()


export class getLetterboxd extends OpenAPIRoute {
  public schema = {
    tags: ['Social'],
    summary: 'Get Letterboxd RSS feed in JSON',
    responses: {
      '200': {
        description: 'Valid Letterboxd user',
        ...contentJson({
          items: Arr({
            creator: Str,
            title: Str,
            link: Str,
            pubDate: Str,
            'dc:creator': Str,
            content: Str,
            contentSnippet: Str,
            quid: Str,
            isoDate: Str
          }),
          feedUrl: Str,
          paginationLinks: { self: Str },
          title: Str,
          description: Str,
          link: Str
        })
      },
      '500': {
        description: 'Internal Server Error',
        ...contentJson({ success: Bool, error: Str })
      }
    }
  }
  
  public async handle(c:AppContext) {
    try {
      const res = await fetch(`https://letterboxd.com/invisyarcticfox/rss`)
      const d = await res.text()
      const xml = await parser.parseString(d)
      return c.json(xml)
    } catch (error) {
      console.error(error)
    }
  }
}
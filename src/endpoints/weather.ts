import { OpenAPIRoute, Str, Obj } from 'chanfana'
import { WeatherSchema } from 'misc/types'

type weatherData = {
  coord: { lat: number, lon: number }
  id: number
  name: string
}

export class GetWeather extends OpenAPIRoute {
  schema = {
    tags: ['Info'],
    summary: 'Get local weather information',
    request: { query: Obj({ location: Str({ description: 'City Name', example: 'London,GB' }).optional() }) },
    responses: {
      '200': {
        description: 'successful weather request',
        content: { 'application/json': { schema: WeatherSchema } }
      },
      '404': {
        description: 'invalid weather request',
        content: { 'application/json': { schema: Obj({ cod: 404, message: 'city not found' }) }
        }
      }
    }
  }

  async handle(c) {
    try {
      const query = await c.req.query()
      const loc = query.location || c.env.OWM_LOCATION

      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${c.env.OWM_API_KEY}`)
      const d:weatherData = await res.json()
  
      if (!res.ok) {
        console.error(`OpenWeatherMap API error: ${res.status} ${res.statusText}`)
        return c.json({ success: false, msg: 'Failed to fetch weather data' }, 500 )
      }

      if (!query.loc) {
        delete d.coord
        delete d.id
        delete d.name
      }
  
      return c.json(d)
    } catch (error) {
      console.error(error)
      return c.json({ success: false, msg: 'Internal server error' }, 500 )
    }
  }  
}
import { OpenAPIRoute, Str, Num, Obj } from 'chanfana';
import { WeatherSchema } from 'types';


export class WeatherRoute extends OpenAPIRoute {
  schema = {
    tags: ["Info"],
    summary: 'Get local weather information',
    request: {
      query: Obj({
        location: Str({ description: 'City Name', example: 'London,GB' }).optional()
      })
    },
    responses: {
      '200': {
        description: '',
        content: {
          'application/json': {
            schema: WeatherSchema
          }
        }
      },
      '401': {
        description: '',
        content: {
          'application/json': {
            schema: Obj({
              cod: Num({ example: 401 }),
              message: Str({ example: 'invalid api key'})
            })
          }
        }
      },
      '404': {
        description: '',
        content: {
          'application/json': {
            schema: Obj({
              cod: Num({ example: 404 }),
              message: Str({ example: 'city not found'})
            })
          }
        }
      },
    }
  }

  async handle(c) {
    try {
      const data = await this.getValidatedData<typeof this.schema>();
      const { location } = data.query;
  
      const usedCity = location || c.env.OWM_LOCATION;
  
      const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${usedCity}&appid=${c.env.OWM_API_KEY}`;
      const res = await fetch(apiurl);
      const wData = await res.json();
  
      if (!res.ok) {
        console.error(
          `OpenWeatherMap API error: ${res.status} ${res.statusText}`,
        );
        return c.json(
          { success: false, error: 'Failed to fetch weather data' },
          500,
        );
      }

      if (!location) {
        delete wData.coord
        delete wData.name
        delete wData.id
      }
  
      return c.json(wData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      return c.json(
        { success: false, error: 'Internal server error' },
        500,
      );
    }
  }  
}
import { fromHono } from 'chanfana'
import { Hono } from 'hono'
import { GetSonaArt } from 'endpoints/sonaart'
import { GetWeather } from 'endpoints/weather'
import { GetFortography } from 'endpoints/fortography'
import { GetReminders, AddReminders, DeleteReminders } from 'endpoints/reminders'

const app = new Hono()

const api = fromHono(app, { docs_url: '/', })

api.get('/sonaart', GetSonaArt)
api.get('/fortography', GetFortography)
api.get('/weather', GetWeather)

api.get('/reminders', GetReminders)
api.post('/reminders', AddReminders)
api.delete('/reminders', DeleteReminders)

export default app
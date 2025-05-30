import { fromHono } from 'chanfana'
import { Hono } from 'hono'
import { SonaArt } from 'endpoints/sonaart'
import { Weather } from 'endpoints/weather'
import { Fortography } from 'endpoints/fortography'
import { GetReminders, DeleteReminder, AddReminder } from 'endpoints/reminders'

const app = new Hono()

const api = fromHono(app, {
	docs_url: '/',
})

api.get('/sonaart', SonaArt)
api.get('/fortography', Fortography)
api.get('/weather', Weather)

api.get('/reminders', GetReminders)
api.post('/reminders', AddReminder)
api.delete('/reminders', DeleteReminder)

export default app
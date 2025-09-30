import { ApiException, fromHono } from 'chanfana'
import { Hono } from 'hono'
import { ContentfulStatusCode } from 'hono/utils/http-status'

import { getSonaArt } from './endpoints/sonaart'
import { addReminders, deleteReminders, getReminders } from './endpoints/reminders'
import { getLetterboxd } from './endpoints/letterboxd'
import { getPlanes } from './endpoints/jetspotter'


const app = new Hono<{ Bindings: Env }>()

app.onError((err, c) => {
  if (err instanceof ApiException) {
    return c.json({ success: false, error: err.buildResponse() }, err.status as ContentfulStatusCode )
  }

  console.error('Global error handler caught:', err)

  return c.json({ success: false, error: 'Internal Server Error' }, 500 )
})

const openapi = fromHono(app, {
  docs_url: '/',
  schema: {
    info: { title: 'InvisyArcticFox API', version: '2.0.0' }
  }
})


openapi.get('/sonaart', getSonaArt)

openapi.get('/reminders', getReminders)
openapi.put('/reminders', addReminders)
openapi.delete('/reminders', deleteReminders)

openapi.get('/letterboxd', getLetterboxd)

openapi.get('/jetspotter', getPlanes)


export default app
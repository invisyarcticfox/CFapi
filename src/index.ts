import { ApiException, fromHono } from 'chanfana'
import { Hono } from 'hono'
import { ContentfulStatusCode } from 'hono/utils/http-status'


const app = new Hono<{ Bindings: Env }>()

app.onError((err, c) => {
  if (err instanceof ApiException) {
    return c.json({ success: false, errors: err.buildResponse() }, err.status as ContentfulStatusCode )
  }

  console.error('Global error handler caught:', err)

  return c.json({ success: false, error: { code: 500, message: 'Internal Server Error' } }, 500 )
})

const openapi = fromHono(app, {
  docs_url: '/',
  schema: {
    info: { title: 'InvisyArcticFox API', version: '2.0.0' }
  }
})


export default app
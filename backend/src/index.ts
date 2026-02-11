import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import generateRouter from './routes/generate.route.ts'

const app = new Hono()

// Enable CORS for frontend
app.use('/*', cors({
  origin: 'http://localhost:3001', // Next.js default port
  credentials: true,
}))

// Health check
app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'XCortz API is running' })
})

// Mount generate routes
app.route('/api', generateRouter)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

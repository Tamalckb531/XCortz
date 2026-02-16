import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import generateRouter from './routes/generate.route.ts'
import uploadRouter from './routes/upload.route.ts'
import dashboardRouter from './routes/dashboard.route.ts'
import { initializeSessionsDirectory } from './lib/sessionManager.ts'

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
app.route('/api', uploadRouter)
app.route('/api', dashboardRouter)

const PORT = 3000

initializeSessionsDirectory()
  .then(() => {
    serve({
      fetch: app.fetch,
      port: PORT
    }, (info) => {
      console.log(`🚀 Server is running on http://localhost:${info.port}`)
      console.log(`📁 Sessions directory initialized`)
    })
  })
  .catch((error) => {
    console.error('Failed to initialize server:', error)
    process.exit(1)
  })

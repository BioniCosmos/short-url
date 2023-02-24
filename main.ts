import { serve } from 'https://deno.land/std@0.178.0/http/server.ts'
import { serveStatic } from 'https://deno.land/x/hono@v3.0.1/adapter/deno/index.ts'
import { HTTPException } from 'https://deno.land/x/hono@v3.0.1/http-exception.ts'
import { Hono } from 'https://deno.land/x/hono@v3.0.1/mod.ts'
import { MongoClient } from 'https://deno.land/x/mongo@v0.31.1/mod.ts'
import ShortUrl from './entity.ts'
import ShortUrlBloomFilter from './filter.ts'
import ShortUrlService from './service.ts'

export const client = new MongoClient()
await client.connect(
  'mongodb+srv://xxx/?authMechanism=SCRAM-SHA-1',
)
const db = client.database('short-url')
export const urls = db.collection<ShortUrl>('urls')
await ShortUrlBloomFilter.init()

const app = new Hono()

app.get('/', serveStatic({ path: './index.html' }))
app.post('/', async (c) => {
  const longUrlR = new RegExp('http(s*)://\S*')
  const { longUrl } = await c.req.json()
  if (!longUrlR.test(longUrl)) {
    throw new HTTPException(400)
  }
  const url = new URL(c.req.url)
  const protocol = c.req.header('X-Forwarded-Scheme') || url.protocol
  const host = c.req.header('X-Forwarded-Host') || c.req.header('Host')
  const hostname = host?.split(':')[0]
  const port = host?.split(':')[1] || ''
  let urlStart = `${protocol}//${hostname}`
  if (
    !(protocol === 'http:' && port === '80') &&
    !(protocol === 'https:' && port === '443')
  ) {
    urlStart += `:${port}`
  }
  const surl = await ShortUrlService.genShortUrl(longUrl, urlStart)
  return c.json(surl)
})
app.get('/s/:shorts', async (c) => {
  const shorts = c.req.param('shorts')
  const shortUrl = await ShortUrlService.genLongUrl(shorts)
  if (shortUrl !== null) {
    return c.redirect(shortUrl.longUrl)
  }
  throw new HTTPException(404, { message: '不存在的短链接' })
})

serve(app.fetch)

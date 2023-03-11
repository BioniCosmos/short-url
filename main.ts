import { serve } from 'https://deno.land/std@0.178.0/http/server.ts'
import { zValidator } from 'npm:@hono/zod-validator'
import { Hono } from 'npm:hono'
import { serveStatic } from 'npm:hono/deno'
import { z } from 'npm:zod'
import { initFilter } from './filter.ts'
import { ShortUrl } from './models.ts'
import { generateShortId, getRealBaseUrl } from './utils.ts'

await initFilter()

const app = new Hono()

app.get('/', serveStatic({ path: './index.html' }))
app.post(
  '/',
  zValidator(
    'json',
    z.object({
      raw: z.string().url(),
    }),
  ),
  async (c) => {
    const { raw } = c.req.valid('json')
    const realBaseUrl = getRealBaseUrl(c.req.headers, c.req.url)
    const shortId = generateShortId()
    await (new ShortUrl(shortId, raw)).insertOne()
    return c.text(`${realBaseUrl}${shortId}`)
  },
)
app.get('/:shortId', async (c) => {
  const shortId = c.req.param('shortId')
  const shortUrl = await ShortUrl.findOneById(shortId)
  return shortUrl === null
    ? c.text('不存在的短链接', 404)
    : c.redirect(shortUrl.raw)
})

serve(app.fetch)

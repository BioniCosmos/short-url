import { filter } from './filter.ts'

export function generateShortId(): string {
  const chars = Array.from({ length: 10 }, (_, i) => i.toString())
    .concat(
      Array.from(
        { length: 26 },
        (_, i) => String.fromCodePoint('A'.codePointAt(0)! + i),
      ),
    )
    .concat(
      Array.from(
        { length: 26 },
        (_, i) => String.fromCodePoint('a'.codePointAt(0)! + i),
      ),
    )
  const shortId = Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('')
  return filter.has(shortId) ? generateShortId() : shortId
}

export function getRealBaseUrl(headers: Headers, rawUrl: string) {
  const url = new URL(rawUrl)
  url.protocol = headers.get('X-Forwarded-Proto') ?? url.protocol
  const splitHost = headers.get('Host')?.split(':')
  url.hostname = splitHost?.[0] ?? url.hostname
  url.port = splitHost?.[1] ?? url.port
  return url.toString()
}

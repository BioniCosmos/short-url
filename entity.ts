export default class ShortUrl {
  id = 0
  shorts = ''
  longUrl = ''
  shortUrl = ''
  createTime = new Date()

  constructor(shorts: string, longUrl?: string, shortUrl?: string) {
    this.shorts = shorts
    this.longUrl = longUrl ?? ''
    this.shortUrl = shortUrl ?? ''
  }
}

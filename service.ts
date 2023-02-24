import ShortUrl from './entity.ts'
import ShortUrlBloomFilter from './filter.ts'
import { urls } from './main.ts'
import URLUtil from './utils.ts'

export default class ShortUrlService {
  static async genShortUrl(longUrl: string, baseUrl: string) {
    const shortURL = URLUtil.getShortURL()
    const shortUrlEntity = new ShortUrl(
      shortURL,
      longUrl,
      `${baseUrl}/s/${shortURL}`,
    )
    await urls.insertOne(shortUrlEntity)
    ShortUrlBloomFilter.put(shortUrlEntity.shorts)
    return shortUrlEntity
  }

  static async genLongUrl(shorts: string) {
    if (ShortUrlBloomFilter.mightContain(shorts)) {
      const one = await urls.findOne({ shorts })
      if (one) {
        return one
      }
    }
    return null
  }

  static getAllShort() {
    return urls.find().map((shortUrl) => shortUrl.shorts)
  }
}

import { MongoClient } from 'https://deno.land/x/mongo@v0.31.1/mod.ts'
import { filter } from './filter.ts'

const client = new MongoClient()
await client.connect('mongodb+srv://xxx/?authMechanism=SCRAM-SHA-1')
const db = client.database('shortUrl')
const shortUrls = db.collection<ShortUrl>('shortUrls')

export class ShortUrl {
  id: string
  raw: string

  constructor(id: string, raw: string) {
    this.id = id
    this.raw = raw
  }

  async insertOne() {
    await shortUrls.insertOne(this)
    filter.add(this.id)
  }

  static async findOneById(shortId: string) {
    if (!filter.has(shortId)) {
      return null
    }
    const shortUrl = await shortUrls.findOne({ id: shortId })
    return shortUrl === undefined ? null : shortUrl
  }

  static findAll() {
    return shortUrls.find().toArray()
  }
}

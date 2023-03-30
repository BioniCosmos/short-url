import { BloomFilter } from 'https://esm.sh/bloom-filters@3.0.0'
import { ShortUrl } from './models.ts'

export const filter = BloomFilter.create(1000000, 0.03)

export async function initFilter() {
  const shortUrls = await ShortUrl.findAll()
  shortUrls.forEach(({ id }) => {
    filter.add(id)
  })
}

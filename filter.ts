import BF from 'npm:bloom-filters@3'
import { ShortUrl } from './models.ts'

const { BloomFilter } = BF
export const filter = BloomFilter.create(1000000, 0.03)

export async function initFilter() {
  const shortUrls = await ShortUrl.findAll()
  shortUrls.forEach(({ id }) => {
    filter.add(id)
  })
}

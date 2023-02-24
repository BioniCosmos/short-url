import BF from 'npm:bloom-filters@3'
import ShortUrlService from './service.ts'

const { BloomFilter } = BF
const bloomFilter = BloomFilter.create(1000000, 0.03)

export default class ShortUrlBloomFilter {
  static mightContain(shorts: string) {
    return bloomFilter.has(shorts)
  }

  static put(shorts: string) {
    bloomFilter.add(shorts)
  }

  static async init() {
    console.info('===============初始化BloomFilter......==============')
    const startTime = Date.now()
    let count = 0
    // 从数据加载数据到 BloomFilter
    const allShorts = await ShortUrlService.getAllShort()
    allShorts.forEach((hash) => {
      bloomFilter.add(hash)
    })
    count = allShorts.length
    const costTime = Date.now() - startTime
    console.info(
      `===============初始化BloomFilter完成,costTime:[${costTime}],Count:[${count}]==============`,
    )
  }
}

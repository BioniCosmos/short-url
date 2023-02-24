import ShortUrlBloomFilter from './filter.ts'

export default class URLUtil {
  static getShortURL() {
    const chars = Array.of(
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    )
    const ln = chars.length
    const key = Array.of()
    for (let i = 0; i < 6; i++) {
      key.push(chars[Math.floor(Math.random() * ln)])
    }
    let s = key.join('')
    //从 BloomFilter 查看是否存在
    const mightContain = ShortUrlBloomFilter.mightContain(s)
    if (mightContain) {
      const newS = URLUtil.getShortURL()
      s = newS
      console.debug(`${s}已存在shorts,重新生成${newS}`)
    }
    return s
  }
}

import { VideoType } from '../../src/enum/VideoType'
import { mapPlatformProduct } from '../../src/mapper/PlatformProductMapper'

test('It should return product transform after mapping', () => {
  const result = mapPlatformProduct('Test 34()!!!', VideoType.MOVIE, 2000, 2)
  expect(result.flattenedTitle).toEqual('test 34')
  expect(result.title).toEqual('Test 34()!!!')
  expect(result.type).toEqual('movie')
  expect(result.year).toEqual(2000)
  expect(result.nbrSeasons).toEqual(2)
})

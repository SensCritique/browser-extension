import { VideoType } from '../../src/enum/VideoType'
import { mapPlatformProduct } from '../../src/mapper/PlatformProductMapper'
import { Provider } from '../../src/enum/Provider'

test('It should return mapped product', () => {
  const result = mapPlatformProduct(
    'Test 34()!!!',
    VideoType.MOVIE,
    2000,
    2,
    Provider.NETFLIX
  )
  expect(result.flattenedTitle).toEqual('test 34')
  expect(result.title).toEqual('Test 34()!!!')
  expect(result.type).toEqual('movie')
  expect(result.year).toEqual(2000)
  expect(result.nbrSeasons).toEqual(2)
  expect(result.providers).toEqual([Provider.NETFLIX])
})

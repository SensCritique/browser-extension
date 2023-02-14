import { test, expect } from '@jest/globals'
import {
  findVideoTypeFromUniverse,
  mapSensCritiqueProduct,
} from '../../src/mapper/SensCritiqueProductMapper'

const sensCritiqueProduct = {
  id: 1,
  product: {
    originalTitle: '',
    rating: 7.5,
    title: 'Brooklyn Nine-Nine',
    universe: 1,
    seasons: [{ seasonNumber: 1 }],
    year_of_production: 2013,
    url: '/serie/brooklyn_nine_nine/8855898',
    providers: [{ name: 'netflix' }],
  },
}

describe('findVideoTypeFromUniverse tests', () => {
  test('It should return movie', () => {
    expect(findVideoTypeFromUniverse(1)).toBe('movie')
  })

  test('It should return movie', () => {
    expect(findVideoTypeFromUniverse(4)).toBe('series')
  })

  test('It should return movie', () => {
    expect(findVideoTypeFromUniverse(2)).toBeNull()
  })
})

describe('mapSensCritiqueProduct tests', () => {
  test('It should return SensCritique mapped product', () => {
    const result = mapSensCritiqueProduct(sensCritiqueProduct)
    expect(result.flattenedTitle).toEqual('brooklyn ninenine')
    expect(result.title).toEqual('Brooklyn Nine-Nine')
    expect(result.type).toEqual('movie')
    expect(result.year).toEqual(2013)
    expect(result.nbrSeasons).toEqual(1)
    expect(result.url).toEqual('/serie/brooklyn_nine_nine/8855898')
    expect(result.rating).toEqual(7.5)
  })
})

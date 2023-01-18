import { VideoType } from './../../src/enum/VideoType'
import { test, expect } from '@jest/globals'
import SensCritique from '../../src/http/SensCritique'

const sensCritiqueProduct = {
  flattenedOriginalTitle: null,
  flattenedTitle: 'brooklyn ninenine',
  nbrSeasons: 8,
  originalTitle: null,
  rating: 7.5,
  title: 'Brooklyn Nine-Nine',
  type: VideoType.TVSHOW,
  url: '/serie/brooklyn_nine_nine/8855898',
  year: 2013
}

const platformProduct = {
  flattenedTitle: 'brooklyn ninenine',
  nbrSeasons: 8,
  title: 'Brooklyn Nine-Nine',
  type: VideoType.TVSHOW,
  year: 2021
}

describe('compare strings tests', () => {
  const sensCritique = new SensCritique()
  test('It should return video infos if title and year match', async () => {
    expect(await sensCritique.compare(sensCritiqueProduct, platformProduct)).toBeDefined()
  })

  test('It should return video infos if senscritique original title match with the platform title and type, year match', async () => {
    expect(await sensCritique.compare({
      ...sensCritiqueProduct,
      title: null,
      flattenedTitle: null,
      originalTitle: 'Brooklyn Nine-Nine',
      flattenedOriginalTitle: 'brooklyn ninenine'
    }, platformProduct)).toBeDefined()
  })

  test("It should return video infos if title is not match but number of seasons, type, year match and it's a tvshow", async () => {
    expect(await sensCritique.compare({
      ...sensCritiqueProduct,
      title: 'Andor',
      flattenedTitle: 'andor'
    }, platformProduct)).toBeDefined()
  })

  test("It should return video infos if title and year not match but number of seasons, type match and it's a tvshow", async () => {
    expect(await sensCritique.compare({
      ...sensCritiqueProduct,
      title: 'Andor',
      flattenedTitle: 'andor',
      year: 2000
    }, platformProduct)).toBeDefined()
  })

  test("It should return video infos if title match and it's a tvshow", async () => {
    expect(await sensCritique.compare({
      ...sensCritiqueProduct,
      title: 'Brooklyn Nine-Nine',
      flattenedTitle: 'brooklyn ninenine',
      year: 2000,
      nbrSeasons: 6
    }, platformProduct)).toBeDefined()
  })

  test("It should return null if number of seasons and title not match but type match and it's a tvshow", async () => {
    expect(await sensCritique.compare({
      ...sensCritiqueProduct,
      title: 'Andor',
      flattenedTitle: 'andor',
      nbrSeasons: 6
    }, platformProduct)).toBeNull()
  })

  test('It should return null if type is not the same', async () => {
    expect(await sensCritique.compare({ ...sensCritiqueProduct, type: VideoType.MOVIE }, platformProduct)).toBeNull()
  })
})

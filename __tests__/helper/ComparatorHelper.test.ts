import { test, expect } from '@jest/globals'
import browser from '../global/browser'
Object.assign(global, browser)
import { compare } from '../../src/helper/ComparatorHelper'
import {
  matchByTitleAndYearDataset,
  matchByMovieAndYearDataset,
  matchYearAndSeasonIfTvShowDataset,
  matchByTitleAndSeasonIfTvShowDataset,
  notMatchByTypeOrProviderDataset,
  notMatchByTitleAndYearIfMovieDataset,
  notMatchByTitleYearAndSeasonsIfTvShowDataset,
} from '../../src/dataset/CamparatorHelper'
jest.mock('../../src/background')

describe('Test products matching with compare()', () => {
  test.each(matchByTitleAndYearDataset)(
    'It should return video infos if title and year match',
    async (senscritiqueProduct, platformProduct, expectedVideoInfo) => {
      const videoInfo = await compare(senscritiqueProduct, platformProduct)
      expect(videoInfo).toEqual(expectedVideoInfo)
    }
  )

  test.each(matchByMovieAndYearDataset)(
    'It should return video infos if the product is a movie and year match',
    async (senscritiqueProduct, platformProduct, expectedVideoInfo) => {
      const videoInfo = await compare(senscritiqueProduct, platformProduct)
      expect(videoInfo).toEqual(expectedVideoInfo)
    }
  )

  test.each(matchYearAndSeasonIfTvShowDataset)(
    'It should return video infos if the product is a tvShow and year, season match',
    async (senscritiqueProduct, platformProduct, expectedVideoInfo) => {
      const videoInfo = await compare(senscritiqueProduct, platformProduct)
      expect(videoInfo).toEqual(expectedVideoInfo)
    }
  )

  test.each(matchByTitleAndSeasonIfTvShowDataset)(
    'It should return video infos if the product is a tvShow and title, season match',
    async (senscritiqueProduct, platformProduct, expectedVideoInfo) => {
      const videoInfo = await compare(senscritiqueProduct, platformProduct)
      expect(videoInfo).toEqual(expectedVideoInfo)
    }
  )
})

describe('Test products does not match with compare()', () => {
  test.each(notMatchByTypeOrProviderDataset)(
    'It should return null if type or provider not match',
    async (senscritiqueProduct, platformProduct) => {
      const videoInfo = await compare(senscritiqueProduct, platformProduct)
      expect(videoInfo).toBeNull()
    }
  )

  test.each(notMatchByTitleAndYearIfMovieDataset)(
    'It should return null if the product is a movie but the title and year not match',
    async (senscritiqueProduct, platformProduct) => {
      const videoInfo = await compare(senscritiqueProduct, platformProduct)
      expect(videoInfo).toBeNull()
    }
  )

  test.each(notMatchByTitleYearAndSeasonsIfTvShowDataset)(
    'It should return null if the product is a tvShow but title, year and season not match',
    async (senscritiqueProduct, platformProduct) => {
      const videoInfo = await compare(senscritiqueProduct, platformProduct)
      expect(videoInfo).toBeNull()
    }
  )
})

import { VideoType } from './../../src/enum/VideoType'
import { test, expect } from '@jest/globals'
import { compare } from '../../src/helper/ComparatorHelper'
import { Logger } from '../../src/background'

jest.mock('../../src/background', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        info: null,
        error: null,
        log: null,
        warning: null,
        debug: null
      }
    })
  }
})

const matchByTitleDataset = [
  [{
    flattenedOriginalTitle: null,
    flattenedTitle: 'brooklyn ninenine',
    nbrSeasons: 8,
    originalTitle: null,
    rating: 7.5,
    title: 'Brooklyn Nine-Nine',
    type: VideoType.TVSHOW,
    url: '/serie/brooklyn_nine_nine/8855898',
    year: 2021,
    providers: ['Disney+']
  }, {
    flattenedTitle: 'brooklyn ninenine',
    nbrSeasons: 8,
    title: 'Brooklyn Nine-Nine',
    type: VideoType.TVSHOW,
    year: 2021,
    providers: ['disney']
  }, {
    name: 'Brooklyn Nine-Nine',
    redirect: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
    id: VideoType.TVSHOW,
    url: 'https://www.senscritique.com/serie/brooklyn_nine_nine/8855898',
    type: VideoType.TVSHOW,
    rating: '7.5'
  }]
]

describe('Test products matching with compare()', () => {
  test.each(matchByTitleDataset)('It should return video infos if title and year match', async (senscritiqueProduct, platformProduct, expectedVideoInfo) => {
    const videoInfo = await compare(senscritiqueProduct, platformProduct)
    expect(videoInfo).toEqual(expectedVideoInfo)
  })
})

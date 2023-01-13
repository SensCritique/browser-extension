import { VideoType } from './VideoType'
import * as Levenshtein from 'fast-levenshtein'
import { Client, VideoInfo } from './Client'
import { UniverseTypeId } from './UniverseTypeId'

const app = require('../../package.json')

const searchQuery = [
  {
    operationName: 'Results',
    variables: {
      query: '%query%',
      filters: [],
      page: {
        size: 16,
        from: 0
      }
    },
    query: 'query Results($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {  results(query: $query, filters: $filters) {    hits(page: $page, sortBy: $sortBy) {      items {        ... on ResultHit {          id          product {            id            title        originalTitle           url            rating            universe     dateRelease    }        }      }    }  }}'
  }
]

export interface ProductResult {
  product: {
    title: string,
    url: string,
    universe: number,
    rating: number
  }
}

export const SensCritique = class SensCritique implements Client {
  private baseUrl: string = 'https://www.senscritique.com'
  private searchUrl: string;
  private errorSearchUrl: string;

  constructor () {
    this.searchUrl = 'https://apollo.senscritique.com/'
    this.errorSearchUrl = this.baseUrl + '/search?query=%search%'
  }

  buildErrorUrl (videoName: string): string {
    return this.errorSearchUrl.replace('%search%', videoName)
  }

  // remove all special char / string inside parentheses and lowercase the entire string
  cleanTitle (title: string): string | null {
    return title?.replace(/ *\([^)]*\) */g, '').replace(/[^\w ]/g, '').replace(/\s+/g, ' ').toLowerCase() || null
  }

  getYear (dateRelease: string): number | null {
    return new Date(dateRelease).getFullYear()
  }

  isSimilarTitle (title: string, distance: number): boolean {
    return (title.length <= 10 && distance <= 2) || (title.length > 10 && distance <= 4)
  }

  isRelevanceTitle (title: string, distance: number): boolean {
    return title.length <= 15 && distance <= 10
  }

  mapVideoInfos (result: ProductResult, title: string, type: VideoType): VideoInfo {
    return {
      name: title,
      redirect: `${this.baseUrl}${result.product.url}`,
      url: `${this.baseUrl}${result.product.url}`,
      id: result.product.universe,
      type: type,
      rating: result.product.rating?.toString()
    }
  }

  async getVideoInfo (search: string, type: VideoType, year: string = null, seasons: string): Promise<VideoInfo | null> {
    const defaultVideoInfos = {
      name: search,
      redirect: this.buildErrorUrl(search),
      id: null,
      type: null
    }

    if (search) {
      const titleSearch = this.cleanTitle(search)

      const headers = new Headers()
      headers.append('User-Agent', `senscritique-extension v${app.version}`)
      headers.append('Content-Type', 'application/json')
      const response = await fetch(this.searchUrl, {
        headers,
        method: 'POST',
        body: JSON.stringify(searchQuery).replace('%query%', search)
      })

      if (response.ok) {
        const body = await response.json()
        const results = body[0]?.data?.results?.hits?.items

        if (results.length > 0) {
          const levenshteinResults = []

          for (const result of results) {
            const title = this.cleanTitle(result.product?.title)
            const yearDateRelease = this.getYear(result.product?.dateRelease)
            const distance = Levenshtein.get(title, titleSearch)

            // add products in an array with the distance of levenshtein in addition
            if (type === VideoType.MOVIE && result.product.universe === UniverseTypeId.MOVIE &&
              parseInt(year) === yearDateRelease) {
              levenshteinResults.push({ ...result, distance: distance })
            }
            if (type === VideoType.TVSHOW && result.product.universe === UniverseTypeId.TVSHOW) {
              levenshteinResults.push({ ...result, distance: distance })
            }

            // MOVIE
            if ((type === VideoType.MOVIE && result.product.universe === UniverseTypeId.MOVIE) &&
              parseInt(year) === yearDateRelease &&
              this.isSimilarTitle(title, distance)) {
              return this.mapVideoInfos(result, title, type)
            }

            // TVSHOW
            // if tvShow only has one season, we compare the years
            if ((type === VideoType.TVSHOW && result.product.universe === UniverseTypeId.TVSHOW) &&
              this.isSimilarTitle(title, distance) &&
              parseInt(seasons) === 1 &&
              parseInt(year) === yearDateRelease) {
              return this.mapVideoInfos(result, title, type)
            }

            if ((type === VideoType.TVSHOW && result.product.universe === UniverseTypeId.TVSHOW) &&
              this.isSimilarTitle(title, distance)) {
              return this.mapVideoInfos(result, title, type)
            }
          }

          // if levenshteinResults has only one result this result is return
          // or if levenshteinResults has multiple results, the product which has the lowest levenshtein distance will be display
          // MOVIE
          if (levenshteinResults?.length > 0 && type === VideoType.MOVIE) {
            if (levenshteinResults.length === 1) {
              return this.mapVideoInfos(levenshteinResults[0], levenshteinResults[0].product.title, type)
            }
            const closestResult = levenshteinResults.reduce(
              (accumulator, currentValue) =>
                accumulator.distance < currentValue.distance
                  ? accumulator
                  : currentValue
            )
            return this.mapVideoInfos(closestResult, closestResult.product.title, type)
          }

          // TVSHOW
          // in addition we check if the tvshow's title is relevant with levenshtein and if the year is similar
          if (levenshteinResults?.length > 0 && type === VideoType.TVSHOW) {
            let yearDateRelease = this.getYear(levenshteinResults[0].product?.dateRelease)

            if (levenshteinResults.length === 1 &&
              this.isRelevanceTitle(levenshteinResults[0].product.title, levenshteinResults[0].distance) &&
              parseInt(year) === yearDateRelease) {
              return this.mapVideoInfos(levenshteinResults[0], levenshteinResults[0].product.title, type)
            }
            const closestResult = levenshteinResults.reduce(
              (accumulator, currentValue) =>
                accumulator.distance < currentValue.distance
                  ? accumulator
                  : currentValue
            )

            yearDateRelease = this.getYear(closestResult.product?.dateRelease)
            if (this.isRelevanceTitle(closestResult.product.title, closestResult.distance) &&
              parseInt(year) === yearDateRelease) {
              return this.mapVideoInfos(closestResult, closestResult.product.title, type)
            }
          }

          return defaultVideoInfos
        }
      }

      return defaultVideoInfos
    }
  }
}

export default SensCritique

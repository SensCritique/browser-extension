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

  hasSimilarTitle (title: string, distance: number): boolean {
    return (title.length <= 10 && distance <= 2) || (title.length > 10 && distance === 4)
  }

  async getVideoInfo (search: string, type: VideoType, year: string = null): Promise<VideoInfo> {
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

      let videoInfo = null

      if (response.ok) {
        const body = await response.json()
        const results = body[0]?.data?.results?.hits?.items

        if (results.length > 0) {
          const levenshteinResults = []

          for (const result of results) {
            const title = this.cleanTitle(result.product?.title)
            const yearDateRelease = result.product?.dateRelease
            const distance = Levenshtein.get(title, titleSearch)

            // add products in an array with the distance of levenshtein in addition
            if (type === VideoType.MOVIE && result.product.universe === UniverseTypeId.MOVIE &&
              parseInt(year) === parseInt(yearDateRelease)) {
              levenshteinResults.push({ ...result, distance: distance })
            }
            if (type === VideoType.TVSHOW && result.product.universe === UniverseTypeId.TVSHOW) {
              levenshteinResults.push({ ...result, distance: distance })
            }

            if ((type === VideoType.MOVIE && result.product.universe === UniverseTypeId.MOVIE) &&
              parseInt(year) === parseInt(yearDateRelease) &&
              this.hasSimilarTitle(title, distance)) {
              videoInfo = {
                name: title,
                redirect: `${this.baseUrl}${result.product.url}`,
                url: `${this.baseUrl}${result.product.url}`,
                id: result.product.universe,
                type: type,
                rating: result.product.rating?.toString()
              }
              break
            } else if ((type === VideoType.TVSHOW && result.product.universe === UniverseTypeId.TVSHOW) &&
              this.hasSimilarTitle(title, distance)) {
              videoInfo = {
                name: title,
                redirect: `${this.baseUrl}${result.product.url}`,
                url: `${this.baseUrl}${result.product.url}`,
                id: result.product.universe,
                type: type,
                rating: result.product.rating?.toString()
              }
              break
            }
          }

          // if levenshteinResults has only one result this product is return
          // or if levenshteinResults has multiple results, the product which has the lowest levenshtein distance will be display
          if (!videoInfo) {
            if (levenshteinResults?.length === 1) {
              videoInfo = {
                name: results[0].product.title,
                redirect: `${this.baseUrl}${results[0].product.url}`,
                url: `${this.baseUrl}${results[0].product.url}`,
                id: results[0].product.universe,
                type: type,
                rating: results[0].product.rating?.toString()
              }
            } else if (levenshteinResults?.length > 1) {
              const closestResult = levenshteinResults.reduce(
                (accumulator, currentValue) =>
                  accumulator.distance < currentValue.distance
                    ? accumulator
                    : currentValue
              )
              videoInfo = {
                name: closestResult.product.title,
                redirect: `${this.baseUrl}${closestResult.product.url}`,
                url: `${this.baseUrl}${closestResult.product.url}`,
                id: closestResult.product.universe,
                type: type,
                rating: closestResult.product.rating?.toString()
              }
            }
          }

          if (videoInfo) {
            return videoInfo
          }
        }
      }

      return {
        name: search,
        redirect: this.buildErrorUrl(search),
        id: null,
        type: null
      }
    }
  }
}

export default SensCritique

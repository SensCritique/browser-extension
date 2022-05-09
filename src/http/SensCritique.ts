import { VideoType } from './VideoType'
import * as Levenshtein from 'fast-levenshtein'
import { Client, VideoInfo } from './Client'
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
    query: 'query Results($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {\n  results(query: $query, filters: $filters) {\n    facets {\n      identifier\n      label\n      type\n      entries {\n        count\n        id\n        label\n        __typename\n      }\n      __typename\n    }\n    summary {\n      total\n      sortOptions {\n        id\n        label\n        __typename\n      }\n      __typename\n    }\n    hits(page: $page, sortBy: $sortBy) {\n      sortedBy\n      page {\n        from\n        pageNumber\n        total\n        totalPages\n        __typename\n      }\n      items {\n        ... on ResultHit {\n          id\n          product {\n            ...ProductMinimal\n            currentUserInfos {\n              ...ProductUserInfos\n              __typename\n            }\n            scoutsAverage {\n              average\n              __typename\n            }\n            __typename\n          }\n          fields {\n            alternative_title\n            casting\n            collection_count\n            cover\n            creators\n            genres\n            sc_rating\n            title\n            universe\n            url\n            year\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ProductMinimal on Product {\n  ...ProductNano\n  category\n  channel\n  dateCreation\n  dateLastUpdate\n  dateRelease\n  dateReleaseEarlyAccess\n  dateReleaseJP\n  dateReleaseOriginal\n  dateReleaseUS\n  displayedYear\n  duration\n  episodeNumber\n  frenchReleaseDate\n  listCount\n  numberOfEpisodes\n  numberOfSeasons\n  originalRun\n  originalTitle\n  parentTvShowId\n  productionStatus\n  retailReleaseDate\n  seasonId\n  seasonNumber\n  subtitle\n  synopsis\n  url\n  actors {\n    name\n    person_id\n    url\n    __typename\n  }\n  artists {\n    name\n    person_id\n    url\n    __typename\n  }\n  authors {\n    name\n    person_id\n    url\n    __typename\n  }\n  tvChannel {\n    name\n    url\n    __typename\n  }\n  countries {\n    id\n    name\n    __typename\n  }\n  creators {\n    name\n    person_id\n    url\n    __typename\n  }\n  developers {\n    name\n    person_id\n    url\n    __typename\n  }\n  directors {\n    name\n    person_id\n    url\n    __typename\n  }\n  distributors {\n    name\n    person_id\n    url\n    __typename\n  }\n  franchises {\n    id\n    label\n    slug\n    url\n    __typename\n  }\n  gameSystems {\n    id\n    label\n    __typename\n  }\n  genresInfos {\n    id\n    label\n    slug\n    url\n    __typename\n  }\n  illustrators {\n    name\n    person_id\n    url\n    __typename\n  }\n  isbn\n  medias(backdropSize: "1200") {\n    randomBackdrop\n    backdrop\n    picture\n    screenshot\n    videos {\n      id\n      image\n      provider\n      type\n      __typename\n    }\n    __typename\n  }\n  musicLabels {\n    name\n    person_id\n    url\n    __typename\n  }\n  pencillers {\n    name\n    person_id\n    url\n    __typename\n  }\n  producers {\n    name\n    person_id\n    url\n    __typename\n  }\n  publishers {\n    name\n    person_id\n    url\n    __typename\n  }\n  soundtracks {\n    id\n    title\n    url\n    __typename\n  }\n  stats {\n    currentCount\n    ratingCount\n    recommendCount\n    reviewCount\n    wishCount\n    __typename\n  }\n  translators {\n    name\n    person_id\n    url\n    __typename\n  }\n  __typename\n}\n\nfragment ProductNano on Product {\n  id\n  rating\n  title\n  universe\n  url\n  yearOfProduction\n  medias(backdropSize: "1200") {\n    backdrop\n    picture\n    screenshot\n    __typename\n  }\n  __typename\n}\n\nfragment ProductUserInfos on ProductUserInfos {\n  dateDone\n  hasStartedReview\n  isCurrent\n  id\n  isDone\n  isListed\n  isRecommended\n  isRejected\n  isReviewed\n  isWished\n  productId\n  rating\n  userId\n  gameSystem {\n    id\n    label\n    __typename\n  }\n  lastEpisodeDone {\n    id\n    episodeNumber\n    __typename\n  }\n  review {\n    url\n    __typename\n  }\n  __typename\n}\n'
  }
]

export default class SensCritique implements Client {
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

  async getVideoInfo (search: string, type: VideoType, year: string = null): Promise<VideoInfo> {
    if (search) {
      const headers = new Headers()
      headers.append('User-Agent', `Noteflix v${app.version}`)
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
          for (const result of results) {
            if (((result.product.universe === 4 && type === VideoType.SERIE) ||
              (type === VideoType.MOVIE && result.product.universe === 1)) && result.product.title === search) {
              videoInfo = {
                name: result.product.title,
                redirect: `${this.baseUrl}${result.product.url}/critiques`,
                url: `${this.baseUrl}${result.product.url}`,
                id: result.product.universe,
                type: type
              }
              break
            }
          }

          if (videoInfo) {
            const response = await fetch(videoInfo.url)
            const html = await response.text()
            const parser = new DOMParser()
            const dom = parser.parseFromString(html, 'text/html')
            const microFormat = dom.documentElement.querySelector('script[type="application/ld+json"]')?.innerHTML
            const nativeMicroFormat = JSON.parse(microFormat)

            videoInfo.rating = nativeMicroFormat?.aggregateRating?.ratingValue.toString()

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

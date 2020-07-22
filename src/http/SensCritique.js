import VideoTypeEnum from './VideoTypeEnum'
import * as Levenshtein from 'fast-levenshtein'

export default class SensCritique {
  constructor () {
    this.searchUrl = 'https://www.senscritique.com/sc2/search/autocomplete.json?query=%search%'
    this.errorSearchUrl = 'https://www.senscritique.com/search?q=%search%'
  }

  buildErrorUrl (videoName) {
    return this.errorSearchUrl.replace('%search%', videoName)
  }

  async getVideoInfo (search, year = null, type) {
    if (search) {
      const url = this.searchUrl.replace('%search%', encodeURI(search))
      const headers = new Headers()
      headers.append('x-requested-with', 'XMLHttpRequest')
      const response = await fetch(url, { headers })
      let videoInfo = null
      if (response.ok) {
        const body = await response.json()
        if (body.json.length > 0) {
          let previousLevenshteinDistance = 100
          for (const result of body.json) {
            // subtype_id = 4 => Serie / subtype_id = 1 => film
            if ((result.subtype_id === 4 && type === VideoTypeEnum.SERIE) ||
              (type === VideoTypeEnum.MOVIE && result.subtype_id === 1)) {
              const levenshteinDistance = Levenshtein.get(result.label, `${search} (${year})`)
              if (levenshteinDistance < previousLevenshteinDistance) {
                previousLevenshteinDistance = levenshteinDistance
                videoInfo = {
                  name: search,
                  redirect: `${result.url}/critiques`,
                  url: result.url,
                  id: result.subtype_id,
                  type: type
                }
              }
            }
          }

          if (videoInfo) {
            const response = await fetch(videoInfo.url)
            const html = await response.text()
            const parser = new DOMParser()
            const dom = parser.parseFromString(html, 'text/html')
            videoInfo.rating = dom.documentElement.querySelector('[itemprop="ratingValue"]').innerText

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

export default class AllocineClient {
  constructor() {
    this.searchUrl = 'https://www.allocine.fr/_/autocomplete/';
    this.movieRatingUrl  = 'http://www.allocine.fr/film/fichefilm-%id%/critiques/spectateurs/';
    this.serieRatingUrl = 'http://www.allocine.fr/series/ficheserie-%id%/critiques/';
  }
  async getVideoInfo(search) {
    if (search) {
      const url = this.searchUrl + encodeURI(search);
      const response = await fetch(url);
      if (response.ok) {
        const body = await response.json();
        if (!body.error && body.results.length > 0) {
          const firstResult = body.results[0];
          return {
            name: search,
            id: firstResult.entity_id,
            type: firstResult.entity_type,
          };
        }
      }
    }
  }

  async getRating(videoInfo) {
    const ratingUrl = this.buildRatingUrl(videoInfo);
    const response = await fetch(ratingUrl);
    if (response.ok) {
      const html = await response.text();
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, 'text/html');

      return dom.documentElement.querySelector('.note').innerText;
    }

    return null;
  }

   buildRatingUrl(videoInfo) {
    if(videoInfo.type ==='movie') {
      return this.movieRatingUrl.replace('%id%',videoInfo.id);
    }
    if(videoInfo.type=== 'series'){
      return this.serieRatingUrl.replace('%id%',videoInfo.id);
    }

    return null;
  };
}

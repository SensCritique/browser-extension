import VideoTypeEnum from './VideoTypeEnum';

export default class AllocineClient {
  constructor() {
    this.searchUrl = 'https://www.allocine.fr/_/autocomplete/';
    this.movieRatingUrl  = 'https://www.allocine.fr/film/fichefilm-%id%/critiques/spectateurs/';
    this.serieRatingUrl = 'https://www.allocine.fr/series/ficheserie-%id%/critiques/';
    this.failRedirectUrl = 'https://www.allocine.fr/recherche/?q=%s';
  }

  async getVideoInfo(search, year = null, type) {
    if (search) {
      const url = this.searchUrl + encodeURI(search);
      const response = await fetch(url);
      if (response.ok) {
        const body = await response.json();
        if (!body.error && body.results.length > 0) {
          for(const result of body.results) {
            if(result.entity_type === type &&
              ((type === VideoTypeEnum.SERIE) ||
                type === VideoTypeEnum.MOVIE && result.data.year === year)) {
              return {
                name: search,
                id: result.entity_id,
                type: type
              };
            }
          }
        }
      }

      return {
        name: search,
        id: null,
        type: null,
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
      const note = dom.documentElement.querySelector('.note');

      return note ? note.innerText : null;
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

  buildRedirectUrl(videoName) {
    return this.failRedirectUrl.replace('%s', encodeURI(videoName));
  }
}

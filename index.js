const observerConfig = {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
};
const searchUrl = 'https://www.allocine.fr/_/autocomplete/';
let movieRatingUrl  = 'http://www.allocine.fr/film/fichefilm-%id%/critiques/spectateurs/';
let serieRatingUrl = 'http://www.allocine.fr/series/ficheserie-%id%/critiques/';
const videoItems = [];


const findRatings = () => {
  console.log('Finding movies/series...');
  const items = document.getElementsByClassName('jawBone');
  if (items.length > 0) {
      for(let i=0; i<items.length;i++){
        const item = items[i];
        const videoName = item.querySelector('.logo').getAttribute('alt');
        if (videoName &&  !Object.keys(videoItems).includes(videoName)) {
          addRating(videoName, item).then(() => {
            console.log('"'+videoName+ '" rating ajouté');
          });
        }
      }
     
  }
};

const css = "font-family: Arial;" +
  "  color: #fecc00; " +
  "  border-radius: 45px; " +
  "  background-color: rgba(255,255,255, 0.05); " +
  "  position: absolute;" +
  "  z-index: 100; " +
  "  left:2em;" +
  "  bottom:1em; " +
  "  text-align: center;" +
  "  line-height: 50px;" +
  "  height: 50px;" +
  "  font-size: 25px; " +
  "  font-weight:bold;" +
  "  width: 50px" ;

const addRating = async (videoName, element) => {
  const videoInfo = await fetchAllocineInfo(videoName);
  const ratingUrl = buildRatingUrl(videoInfo);
  const rating = await fetchRating(ratingUrl);
  let span = document.createElement('span');
  let style = document.createAttribute('style');
  style.value = css;
  span.setAttributeNode(style);
  span.innerText = rating;
  element.appendChild(span);

  videoItems[videoName] = videoInfo;
};

const fetchAllocineInfo = async search => {
  if(search) {
    const url = searchUrl + encodeURI(search);
    const response = await fetch(url);
    if(response.ok) {
      const body = await response.json();
      if(!body.error && body.results.length > 0){
        const firstResult = body.results[0];
        return {
          name: search,
          id: firstResult.entity_id,
          type: firstResult.entity_type,
        };
      }
    }
  }
};

const fetchRating = async ratingUrl => {
  const response = await fetch(ratingUrl);
  if (response.ok) {
    const html = await response.text();
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    const rating = dom.documentElement.querySelector('.note').innerText;

    return rating ? rating : 0;
  }

  return null;
};

const buildRatingUrl = (videoInfo) => {
  if(videoInfo.type ==='movie') {
    return movieRatingUrl.replace('%id%',videoInfo.id);
  }
  if(videoInfo.type=== 'series'){
    return serieRatingUrl.replace('%id%',videoInfo.id);
  }

  return null;
};

const observer = new MutationObserver(findRatings);
observer.observe(document, observerConfig);

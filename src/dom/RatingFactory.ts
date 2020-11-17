import {AllocineRating} from './AllocineRating'
import {Rating} from './Rating'
import {Service} from '../http/Service'
import {SensCritiqueRating} from './SensCritiqueRating'
import {VideoInfo} from "../http/Client";

export default class RatingFactory {
  create(service: Service, videoInfo: VideoInfo): Rating {
    switch (service) {
      case Service.ALLOCINE:
        return new AllocineRating(videoInfo)
      case Service.SENSCRITIQUE:
        return new SensCritiqueRating(videoInfo)
    }
    throw new Error(`Unknown service "${service}"`)
  }
}

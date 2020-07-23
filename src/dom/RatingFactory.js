import { AllocineRating } from './AllocineRating'
import { ServiceEnum } from '../http/ServiceEnum'
import { SensCritiqueRating } from './SensCritiqueRating'

export default class RatingFactory {
  create (service, videoInfo) {
    switch (service) {
      case ServiceEnum.ALLOCINE:
        return new AllocineRating(videoInfo)
      case ServiceEnum.SENSCRITIQUE:
        return new SensCritiqueRating(videoInfo)
    }
    throw new Error(`Unknown service "${service}"`)
  }
}

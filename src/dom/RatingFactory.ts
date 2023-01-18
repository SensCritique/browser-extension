import { Rating } from './Rating'
import { Service } from '../enum/Service'
import { SensCritiqueRating } from './SensCritiqueRating'
import { VideoInfo } from '../http/Client'

export default class RatingFactory {
  create (service: Service, videoInfo: VideoInfo): Rating {
    return new SensCritiqueRating(videoInfo)
  }
}

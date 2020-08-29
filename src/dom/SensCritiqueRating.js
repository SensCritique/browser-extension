import { Rating } from './Rating'
import SensCritiqueLogo from '../../images/services/senscritique'

export const SensCritiqueRating = class SensCritiqueRating extends Rating {
  constructor (videoInfo) {
    super()
    this.videoInfo = videoInfo
    this.logo = SensCritiqueLogo
    this.rating = videoInfo.rating ? this.ratingInPercent(videoInfo.rating) : null
  }

  ratingInPercent (rating) {
    if (rating === null || rating === undefined || !rating.match(/^(?:\d{1,2}[,.])?\d{1,2}$/) || rating > 10 || rating < 0) {
      return null
    }

    rating = parseFloat(rating.replace(',', '.'))

    return rating * 10
  }
}

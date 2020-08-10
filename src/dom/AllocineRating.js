import { Rating } from './Rating'
import AllocineLogo from '../../images/services/allocine'

export const AllocineRating = class AllocineRating extends Rating {
  constructor (videoInfo) {
    super()
    this.videoInfo = videoInfo
    this.logo = AllocineLogo
    this.rating = videoInfo.rating ? this.ratingInPercent(videoInfo.rating) : null
  }

  ratingInPercent (rating) {
    if (rating === null || rating === undefined || !rating.match(/^(?:\d[,.])?\d$/) || rating > 5 || rating < 0) {
      return null
    }

    rating = parseFloat(rating.replace(',', '.'))

    return Math.ceil(parseFloat((rating / 5).toFixed(2)) * 100)
  }
}

import { Rating } from './Rating'

export const SensCritiqueRating = class SensCritiqueRating extends Rating {
  constructor (videoInfo) {
    super()
    this.videoInfo = videoInfo
    this.logo = 'https://www.senscritique.com/favicon-32x32.png'
    this.rating = videoInfo.rating ? this.ratingInPercent(videoInfo.rating) : null
  }

  ratingInPercent (rating) {
    rating = parseFloat(rating.replace(',', '.'))

    return rating * 10
  }
}

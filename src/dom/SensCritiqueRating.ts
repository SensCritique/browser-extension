import { Rating } from './Rating'
import SensCritiqueLogo from '../../images/services/senscritique'
import { VideoInfo } from '../http/Client'

export const SensCritiqueRating = class SensCritiqueRating extends Rating {
  constructor (videoInfo: VideoInfo) {
    super()
    this.videoInfo = videoInfo
    this.logo = SensCritiqueLogo
    // Incoherence, réaffectation d'un number via une string
    this.rating = videoInfo.rating ? this.ratingInPercent(videoInfo.rating) : null
  }

  ratingInPercent (rawRating: string): number {
    if (rawRating === null || rawRating === undefined || !rawRating.match(/^(?:\d{1,2}[,.])?\d{1,2}$/)) {
      return null
    }

    const rating = parseFloat(rawRating.replace(',', '.'))

    return rating * 10
  }
}

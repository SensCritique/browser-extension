import { VideoInfo } from '../http/Client'

export const COLOR = {
  RED: '#B3302A',
  GREY: '#82837f',
  YELLOW: '#fecc00',
  GREEN: '#2EB33B',
  BLACK: '#1A1A1A',
  WHITE: '#FFFFFF',
}

export class Rating {
  public rating: string
  public ratingPercent: number
  protected videoInfo: VideoInfo
  protected logo: string

  get color(): string {
    if (!this.ratingPercent) {
      return COLOR.GREY
    }
    if (this.ratingPercent >= 0 && this.ratingPercent < 55) {
      return COLOR.RED
    }
    if (this.ratingPercent >= 55 && this.ratingPercent < 65) {
      return COLOR.YELLOW
    }

    if (this.ratingPercent >= 65) {
      return COLOR.GREEN
    }
  }

  render(): Element {
    const divBackground = document.createElement('div')
    divBackground.style.width = '95px'
    divBackground.style.height = '44px'
    divBackground.style.background = 'rgba(52, 52, 52, 0.8)'
    divBackground.style.borderRadius = '20px'
    divBackground.style.display = 'flex'
    divBackground.style.justifyContent = 'space-between'
    divBackground.style.position = 'relative'

    const a = document.createElement('a')
    a.style.position = 'absolute'
    a.setAttribute('id', this.videoInfo.hashId)
    a.setAttribute('href', this.videoInfo.redirect)
    a.setAttribute('target', '_blank')
    a.style.display = 'block'
    a.style.height = '100%'
    a.style.width = '100%'

    const divLogo = document.createElement('div')
    divLogo.style.paddingLeft = '10px'
    divLogo.style.display = 'flex'
    divLogo.style.alignItems = 'center'

    const logo = document.createElement('img')
    logo.src = 'data:image/png;base64, ' + this.logo
    logo.width = 32
    logo.height = 32

    const divBackgroundCircle = document.createElement('div')
    divBackgroundCircle.style.borderRadius = '50%'
    divBackgroundCircle.style.width = '44px'
    divBackgroundCircle.style.height = '44px'
    divBackgroundCircle.style.backgroundColor = 'rgba(255,255,255, 0.3)'

    const divProgressCircle = document.createElement('div')
    divProgressCircle.style.borderRadius = '50%'
    divProgressCircle.style.width = '44px'
    divProgressCircle.style.height = '44px'
    divProgressCircle.style.display = 'flex'
    divProgressCircle.style.justifyContent = 'center'
    divProgressCircle.style.alignItems = 'center'
    divProgressCircle.style.background = `conic-gradient(${this.color} ${this.ratingPercent}%, transparent 0 100%)`

    const divSmallCircle = document.createElement('div')
    divSmallCircle.style.borderRadius = '50%'
    divSmallCircle.style.width = '36px'
    divSmallCircle.style.height = '36px'
    divSmallCircle.style.backgroundColor = COLOR.BLACK
    divSmallCircle.style.display = 'flex'
    divSmallCircle.style.justifyContent = 'center'

    const textRating = document.createElement('span')
    textRating.style.fontSize = '16px'
    textRating.style.fontWeight = '700'
    textRating.innerText = this.rating ? this.rating : '?'
    textRating.style.color = COLOR.WHITE

    divBackground.appendChild(divLogo)
    divBackground.appendChild(a)
    divBackground.appendChild(divBackgroundCircle)
    divBackgroundCircle.appendChild(divProgressCircle)
    divProgressCircle.appendChild(divSmallCircle)
    divSmallCircle.appendChild(textRating)
    divLogo.appendChild(logo)

    return divBackground
  }
}

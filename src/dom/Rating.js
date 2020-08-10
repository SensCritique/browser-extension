export const COLOR = {
  RED: '#B3302A',
  ORANGE: '#c95400',
  GREY: '#82837f',
  YELLOW: '#fecc00',
  GREEN: '#2EB33B'
}

export const Rating = class Rating {
  get color () {
    if (!this.rating) {
      return COLOR.GREY
    }
    if (this.rating >= 0 && this.rating < 25) {
      return COLOR.RED
    }
    if (this.rating >= 25 && this.rating < 50) {
      return COLOR.ORANGE
    }
    if (this.rating >= 50 && this.rating < 75) {
      return COLOR.YELLOW
    }
    if (this.rating >= 75) {
      return COLOR.GREEN
    }
  }

  render () {
    const a = document.createElement('a')
    a.setAttribute('id', this.videoInfo.hashId)
    a.setAttribute('href', this.videoInfo.redirect)
    a.setAttribute('target', '_blank')

    const logo = document.createElement('img')
    logo.src = 'data:image/png;base64, ' + this.logo
    logo.width = 26
    logo.height = 26
    const ratingElement = document.createElement('span')
    ratingElement.innerText = this.rating ? this.rating.toString() : '??'
    a.style.color = this.color
    a.style.fontWeight = 'bold'
    a.style.display = 'flex'
    a.style.alignItems = 'center'
    a.style.maxWidth = '50px'
    a.appendChild(logo)
    a.appendChild(ratingElement)

    return a
  }
}

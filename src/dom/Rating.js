export const Rating = class Rating {
  get color () {
    if (!this.rating) {
      return '#82837f'
    }
    if (this.rating >= 0 && this.rating < 25) {
      return '#B3302A'
    }
    if (this.rating >= 25 && this.rating < 50) {
      return '#c95400'
    }
    if (this.rating >= 50 && this.rating < 75) {
      return '#fecc00'
    }
    if (this.rating >= 75) {
      return '#2EB33B'
    }
  }

  render () {
    const a = document.createElement('a')
    a.setAttribute('id', this.videoInfo.hashId)
    a.setAttribute('href', this.videoInfo.redirect)
    a.setAttribute('target', '_blank')

    const logo = document.createElement('img')
    logo.src = this.logo
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

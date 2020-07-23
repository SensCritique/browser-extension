export default class Ratings {
  static render (hash) {
    const mainDiv = document.createElement('div')
    mainDiv.style.display = 'flex'
    mainDiv.style.marginBottom = '1em'
    mainDiv.style.maxWidth = '400px'
    mainDiv.style.height = '36px'
    mainDiv.style.lineHeight = '36px'
    mainDiv.classList.add(hash)

    // Allocine
    const allocineElement = document.createElement('div')
    allocineElement.style.padding = '0 .5em 0 .5em'
    allocineElement.style.position = 'relative'
    // allocineElement.style.width = '100px';
    // allocineElement.style.backgroundColor = '#ffb200';
    allocineElement.classList.add(`allocine_${hash}`)
    mainDiv.appendChild(allocineElement)

    // SensCritique
    const senscritiqueElement = document.createElement('div')
    senscritiqueElement.style.padding = '0 .5em 0 .5em'
    senscritiqueElement.style.position = 'relative'
    // senscritiqueElement.style.backgroundColor = '#da0000';
    // senscritiqueElement.style.width = '100px';
    senscritiqueElement.classList.add(`senscritique_${hash}`)
    mainDiv.appendChild(senscritiqueElement)

    return mainDiv
  }
}

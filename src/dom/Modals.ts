import logo64 from '../../images/logo'

export const AbTestModalId = 'senscritique_extension_help_modal'
export const NotSupportedModalId = 'senscritique_extension_not_supported_modal'

const Modal = (id: string, text: Element): Element => {
  const modal = document.createElement('div')

  modal.style.borderRadius = '5px'
  modal.style.backgroundColor = 'rgba(0,0,0, 0.7)'
  modal.style.padding = '.5em'
  modal.style.color = 'white'
  modal.style.position = 'fixed'
  modal.style.right = '5px'
  modal.style.top = '10vh'
  modal.style.zIndex = '1000'
  modal.style.display = 'flex'
  modal.style.alignItems = 'center'
  modal.style.cursor = 'pointer'
  modal.id = id

  const logo = document.createElement('img')
  logo.src = 'data:image/png;base64, ' + logo64
  logo.style.height = '24px'

  modal.append(logo)
  modal.append(text)

  return modal
}

export const ABTestModal = (): Element => {
  const text = document.createElement('div')
  text.style.fontSize = '14px'
  text.style.lineHeight = '24px'
  text.style.marginLeft = '10px'

  const button = document.createElement('a')
  button.style.color = '#b4b4b4'
  button.style.fontSize = '14px'
  button.style.textDecoration = 'underline'
  button.innerText = 'Désactiver l\'option "Participer à des tests"'
  button.href = 'https://www.netflix.com/DoNotTest'
  text.innerHTML = `
  Votre compte Netflix semble faire parti d'une phase de test, ce qui le rend incompatible avec SensCritique-extension.<br />
  ${button.outerHTML} pour que SensCritique-extension fonctionne. 
  `
  return Modal(AbTestModalId, text)
}

export const NotSupportedModal = (): Element => {
  const text = document.createElement('div')
  text.style.fontSize = '14px'
  text.style.lineHeight = '24px'
  text.style.marginLeft = '10px'

  text.innerHTML = `
  L'interface de Netflix ne semble plus être supportée par SensCritique-extension pour le moment. <br />
  Aucune crainte, nous sommes déjà sur le coup...🚀 <br /> 
  `
  return Modal(NotSupportedModalId, text)
}

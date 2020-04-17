# Intro
Ce repository contient deux extensions, une pour Firefox et une pour Chrome.

#### Workflow 
Le code est identique pour les deux extensions.
Seul le système d'évènement est propre à Chrome (`chrome.runtime.onMessage` etc.) mais il est reste interprété par Firefox.

##### Content_script
- Netflix: Récupération du nom de la vidéo
##### Background
- Allociné (HTTP): Récupération de l'ID/Type de la vidéo
- Allociné (HTTP): Récupération de la note de la vidéo
##### Content_script
- Noteflix: Génération du DOM avec le score allociné de la vidéo.

# Installation / Test
## Installation
L'installation est la même pour chaque extension:
- `npm install`
- `make watch-firefox` ou `make watch-chrome` pour lancer webpack en mode watch
## Tester l'extension en dev
#### Chrome
- Se rendre sur la page des extensions `chrome://extensions/`
- `Charger l'extension non empaquetée` et choisir le répertoire `dist/main/chrome`
- Pour chaque modification du code, cliquer sur l'icone `Actualiser`

#### Firefox
- Se rendre sur la page des extensions de debug `about:debugging#/runtime/this-firefox`
- `Charger un module complémentaire temporaire` et choisir le répertoire `dist/main/firefox`
- Pour chaque modification du code, cliquer sur le bouton `Actualiser`

# Contribuer
- Forker le repo et proposer une PR en respectant les normes de coding style du projet
- Thats all !

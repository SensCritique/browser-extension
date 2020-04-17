# Intro
Ce repository contient deux extensions, une pour Firefox (dans /firefox), une pour Chrome (dans /chrome). 
Le code n'est pas (et ne doit pas) être commun aux deux extensions afin d'éviter les potentiels problème de compatibilité avec les stores.

Le code est très similaire entre les deux mais diffère légèrement sur Chrome. Chrome ayant une [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) plus sévère,
 les call HTTP vers allociné se retrouvaient bloqués. Il a donc fallu découper l'extension en deux, une partie en tant que `content_script` et l'autre en `background` afin de ne plus être limité par les CSP.

Les call HTTP vers Allociné sont réalisés à travers des évènements Chrome.

#### Workflow pour firefox
##### Content_script
- Netflix: Récupération du nom de la vidéo
- Allociné (HTTP): Récupération de l'ID/Type de la vidéo
- Allociné (HTTP): Récupération de la note de la vidéo
- Noteflix: Génération du DOM avec le score allociné de la vidéo.

#### Workflow pour Chrome
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
- `npm run watch` pour lancer webpack en mode watch
## Tester l'extension en dev
#### Chrome
- Se rendre sur la page des extensions `chrome://extensions/`
- `Charger l'extension non empaquetée` et choisir le répertoire `dist/main`
- Pour chaque modification du code, cliquer sur l'icone `Actualiser`

#### Firefox
- Se rendre sur la page des extensions de debug `about:debugging#/runtime/this-firefox`
- `Charger un module complémentaire temporaire`
- Pour chaque modification du code, cliquer sur le bouton `Actualiser`

# Contribuer
- Forker le repo et proposer une PR en respectant les normes de coding style du projet
- Thats all !

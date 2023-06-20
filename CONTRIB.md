# Intro

Ce projet contient deux extensions (Firefox et Chrome), les deux extensions partagent le même code.

### **CLIENT (content_script)**

La partie client du code, permet de scrapper les différentes plateformes (Netflix, Disney et Prime). Elle analyse le DOM pour trouver l'emplacement où afficher la note et récupère l'id des produits disponibles sur la plateforme. Le scrapping est différent en fonction de chaque plateformes.

- Netflix: Emplacement de la note sur le wall et sur chaque produits (on trouve facilement les informations au scrapping et l'id de chaque produits pour l'envoyer côté serveur).
- Disney+: Pour l'instant, seulement possible d'afficher la note sur les pages produits, mais impossible de l'afficher sur le wall car l'id du produit n'est pas récupérable dans le DOM.
- Prime: Possible d'afficher la note sur les wall et toutes les pages produits, mais on rencontre beaucoup de subtilité lors du scrapping.

### **SERVEUR (background)**

La partie serveur, permet de récupérer la note de chaque produits de la plateforme grâce à l'envoi d'un tableau d'ids (scrappé côté client) et du provider via la requête GraphQL ci-dessous:

```
query productByPlatform($platformIds: [String]!, $provider: String)
{
    productByPlatform(platformIds: $platformIds provider: $provider)
    {
        platformId
        rating
        slug
        typeId
        productId
    }
}
```

**_Variables de la requète_**

- _platformIds: tableau de différents ids de produit de la plateforme_
- _provider: nom de la plateforme (ex: Netflix)_

Le matching est fait en amont, à l'aide de différents scrapper qui tournent quotidiennent sur chaque plateforme et matchent l'id du produit de la plateforme avec l'id du produit SensCritique, ces données sont insérées dans une table au sein de notre BDD.

La requête (ci-dessus) va faire appel à cette table qui va nous retourner la note et les différentes informations utilent pour l'affichage côté client (ex: Disney+).

Avantages

- SensCritique à la main sur sa propre table en BDD (indépendance)
- Possibilité de modifier rapidement si on rencontre une erreur de matching

Inconvénients

- Erreurs de matching (fiablilité)
- Problème au niveau du multi-plateforme, par exemple Canal+ affiche les produits Disney+ sur sa plateforme mais avec une autre id que celle présente sur Disney+.

# Workflow

##### (1) Content_script

- Netflix: Récupère les infos sur le wall ou la page produit
- Disney: Récupère les infos sur la page produit
- PrimeVideo: Récupère les infos sur le wall ou la page produit

##### (2) Background

- SensCritique (HTTP): Récupère la note via une requète

##### (3) Content_script

- browser-extension: Génère le DOM avec les notes SensCritique

# Installation / Test

## Installation

Même installation pour Firefox et Chrome:

- Vous devez installer `docker` et `docker-compose`.
- `make install`
- `make watch-firefox` ou `make watch-chrome` pour exécuter webpack dans le watch-mode.

## Test

#### Chrome

- Aller sur `chrome://extensions/` et cocher le mode développeur.
- `Load unpackaged extension` et sélectionner le dossier `dist/main/chrome`.
- À chaque fois que vous faites un changement dans le code, cliquez sur le bouton `Refresh`.

#### Firefox

- Aller sur la page de debug `about:debugging#/runtime/this-firefox`
- `Load a temporary add-on module` et sélectionner le fichier `dist/main/firefox/manifest.json`
- À chaque fois que vous faites un changement dans le code, cliquez sur le bouton `Refresh`.

# Contributer

- Pour nous remonter vos idées ou obtenir de l'aide, vous pouvez créer une [nouvelle discussion](https://github.com/SensCritique/browser-extension/discussions).
- Pour nous remonter des bugs, pour pouvez créer [un ticket](https://github.com/SensCritique/browser-extension/issues/new).

- Si vous souhaitez contribuer au projet et nous proposer votre code. Vous
  devez **Fork** le projet, **créer un branche** et proposer une **pull-request**.

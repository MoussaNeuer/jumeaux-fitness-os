# Jumeaux Fitness OS — démonstration commerciale

Démonstration statique et interactive d’un logiciel de gestion pour un réseau de salles de sport.
**Toutes les données sont fictives.** Aucun backend, aucun compte réel, aucun paiement réel,
aucune donnée envoyée à un serveur. Tout se passe dans le navigateur.

## Lancer la démo

1. Ouvrir `index.html` dans un navigateur récent ;
2. ou servir le dossier en HTTP pour activer la PWA et le service worker :
   `python -m http.server 5500`, puis ouvrir `http://localhost:5500/`.

Le service worker exige `http://` ou `https://` ; il reste inactif en `file://`.

## Le parcours de démonstration

### Espace direction — le poste de pilotage du réseau

C’est l’espace principal de la plateforme. Il conserve l’identité émeraude de Jumeaux Fitness OS
et consolide l’ensemble du réseau :

- adhérents, revenus, présences, taux d’activité et alertes des quatre salles ;
- flux de passages simulé « en direct », graphiques, classement et objectifs ;
- recherche globale et exports CSV (adhérents, paiements, présences) ;
- centre de contrôle qualité : doublons, fiches incomplètes, paiements à vérifier,
  corrections simulées en un clic ;
- simulateur d’expansion pour préparer une cinquième salle ;
- **Équipe & accès** : gestion simulée des gérants et collaborateurs du réseau.

### Équipe & accès (direction)

Le PDG gère les accès de chaque salle depuis un seul écran :

- un compte nominatif par collaborateur, rattaché à une salle et à un rôle
  (gérant, accueil, caisse, coach) ;
- création et modification d’un compte, suspension et réactivation immédiate ;
- révocation des sessions d’un collaborateur ou de tout le réseau ;
- suivi de la double authentification (2FA) et journal d’audit local ;
- politique d’accès présentée dans une fiche dédiée.

Ces actions sont **simulées** : aucun mot de passe, aucun jeton et aucune session réelle
ne sont créés.

### Back-office de chaque salle

Quatre espaces autonomes : **Keur Massar, Yeumbeul, Guédiawaye et Parcelles**.
Chaque salle possède ses adhérents, abonnements, paiements, présences et statistiques.

- Tableau de bord, recherche, filtres, tri et pagination.
- Création et modification d’adhérents, renouvellement d’abonnement.
- Enregistrement de paiements, statuts, reçus imprimables et exports.
- Contrôle d’accès par sélecteur ou caméra (selon les API du navigateur).

### Une identité visuelle par salle

Chaque salle applique sa palette dans son back-office **et** dans l’espace adhérent,
sur une base noir et blanc :

| Salle | Palette |
| --- | --- |
| Keur Massar | Violet · Noir · Blanc |
| Yeumbeul | Rouge · Noir · Blanc |
| Guédiawaye | Jaune · Noir · Blanc |
| Parcelles | Violet · Noir · Blanc |

La direction, elle, reste sur l’identité émeraude de la plateforme. Les thèmes clair et sombre
sont tous deux pris en charge.

### Contrôle d’accès QR

- Chaque fiche génère un **vrai QR code scannable**.
- Le QR encode une ancre du type `#checkin=KM-0001&salle=km`.
- Il ouvre une **borne plein écran** indépendante, utilisable sur un autre appareil
  ou un second onglet, avec le résultat du contrôle, l’adhérent et les actions utiles.
- Les règles de statut, d’expiration et de multi-salles sont appliquées côté client.
- Si le navigateur ne fournit pas `BarcodeDetector`, un message explique la limite
  et renvoie vers le sélecteur ; aucune promesse de lecture caméra n’est faite à tort.

### Espace adhérent

Connexion de démonstration, carte numérique avec QR, abonnement, historique de paiements,
présences, profil et renouvellement simulé. L’interface est optimisée pour téléphone
et reprend la couleur de la salle de l’adhérent.

### Mode présentation

Parcours guidé en **12 étapes** couvrant la vision, le réseau, l’équipe et les accès,
une salle, les adhérents, les renouvellements, le contrôle d’accès, les paiements,
la qualité, l’espace client et l’expansion. Navigation avec les flèches `←` `→`,
sortie avec `Échap`.

## Stack et contraintes

- HTML5 sémantique, CSS3 moderne, JavaScript ES6+ vanilla.
- Aucun framework, aucun PHP, aucun serveur Node, aucune base de données.
- Aucune API nécessitant une clé secrète, aucun appel réseau métier.
- Polices, icônes et générateur de QR **auto-hébergés** dans `assets/`.
- Interface responsive : desktop, tablette, téléphone, borne et impression.
- PWA légère : manifeste, icônes et service worker avec repli hors ligne.

## Structure

```
index.html                 point d’entrée et chargement des scripts
assets/css/style.css       base, thèmes, identités des salles, page d’accueil
assets/css/dashboard.css   application, espace direction, équipe, tableaux, modales
assets/css/components.css  présentation, espace adhérent, borne, login
assets/css/responsive.css  adaptations mobile, tablettes et impression
assets/js/data.js          données fictives, salles, palettes, rôles et comptes
assets/js/core.js          état, thème de salle, composants, graphiques, QR, exports
assets/js/landing.js       page commerciale
assets/js/dashboard.js     réseau, équipe & accès, back-offices, rapports, expansion
assets/js/actions.js       adhérents, paiements, reçus, scanner, borne
assets/js/member-portal.js connexion et espace adhérent
assets/js/presentation.js  parcours guidé en 12 étapes
assets/js/app.js           routage par ancre, rendu, horloge, service worker
assets/fonts/              Inter, Instrument Serif, Font Awesome
assets/icons/              icônes PWA et favicon
assets/vendor/             CSS Font Awesome et générateur de QR local
manifest.json              métadonnées PWA
sw.js                      cache des ressources statiques
```

## Données et persistance

- Les données de démonstration sont générées au chargement à partir de la date du jour.
- Les modifications (adhérents, paiements, présences, comptes) restent **en mémoire pour la session**.
- Seul le thème clair/sombre est conservé dans `localStorage`.
- Le bouton de réinitialisation du back-office recharge les données initiales.
- Les exports CSV sont produits localement par le navigateur.

## Accessibilité et performance

- Navigation clavier, lien d’évitement, libellés ARIA et focus géré dans les modales.
- Contrastes soignés, respect de `prefers-reduced-motion`, styles d’impression dédiés.
- Aucune dépendance CDN ; les ressources critiques sont locales et préchargées.
- Le service worker sert un repli hors ligne après la première visite.

## Publier sur GitHub Pages

1. Envoyer le contenu du dossier à la racine du dépôt ;
2. ouvrir **Settings → Pages** ;
3. choisir la branche `main` et le dossier `/ (root)` ;
4. ouvrir `https://utilisateur.github.io/nom-du-projet/`.

Tous les chemins sont relatifs : la démo fonctionne aussi dans un sous-dossier.
Le HTTPS active la PWA et le service worker.

## Limites assumées

Cette version est un **prototype commercial**, pas un produit exploitable en production :
pas de comptes réels, pas de base de données partagée, pas de paiement, pas de signature
de contrat, pas de synchronisation entre appareils. La gestion des accès, la 2FA et les
sessions sont illustrées par l’interface mais ne sont pas appliquées techniquement.
La lecture caméra dépend du navigateur. Les tarifs, rôles et règles multi-salles restent
à valider avant le pilote réel.

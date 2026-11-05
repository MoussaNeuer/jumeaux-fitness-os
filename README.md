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
- **tableau de bord stratégique** : CA mensuel et annualisé, charges et résultat par salle,
  marge estimée, impayés, objectifs du mois et prévisions indicatives ;
- lecture comparée du réseau : Keur Massar peut mener au chiffre d’affaires quand
  Yeumbeul compte le plus d’adhérents actifs ;
- flux de passages simulé « en direct », graphiques, classement et objectifs ;
- **Finance & comptabilité** : journal des encaissements, charges fixes et variables,
  caisse du jour, rapprochement, rapports par salle et exports Excel / PDF ;
- recherche globale et exports CSV (adhérents, paiements, présences) ;
- centre de contrôle qualité : doublons, fiches incomplètes, paiements à vérifier,
  corrections simulées en un clic ;
- simulateur d’expansion pour préparer une cinquième salle ;
- **Performance des salles** : comparaison des quatre sites sur un seul écran
  (actifs, CA, résultat, renouvellements, nouveaux, présences, impayés) ;
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
- **Abonnements** : formules mensuelle, trimestrielle et annuelle, dates de début et de fin,
  auto-renouvellement simulé, historique, suspension temporaire, changement de formule,
  alertes J-7 / J-3 / J-1, listes des expirés, des inactifs et des demandes à traiter.
- **Paiements** : trois statuts distincts — confirmé (encaissé), déclaré (à vérifier)
  et en attente (non réglé) — avec rapprochement, reçu imprimable et export.
- **Caisse** : fond de caisse, encaissements du jour, montant théorique, clôture et écart.
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

- Alerte d’expiration et demande de renouvellement transmise au gérant.
- Demande de changement de formule, annulation et préférence d’auto-renouvellement.
- Historique des renouvellements et téléchargement du dernier reçu.
- Onglet **Planning** : programme indicatif des cours et réservation de séance simulée
  (présentée comme une fonctionnalité à confirmer pour la version connectée).

### Finance & comptabilité

- Journal des encaissements avec référence, moyen de paiement et statut.
- Charges fixes et variables par salle, dépenses du jour, ajout et suppression d’écritures.
- Caisse quotidienne : fond, encaissements confirmés, théorique, comptage et écart.
- Rapprochement des paiements déclarés ou en attente avant comptabilisation.
- Rapports par établissement, synthèse mensuelle, export Excel et impression / PDF.
- Les montants sont des **hypothèses de simulation**, jamais des comptes réels.

### Performance des salles

Une page unique compare les quatre établissements : adhérents actifs, chiffre d’affaires,
résultat estimé, marge, renouvellements, nouveaux adhérents, présences, impayés et panier
moyen. Elle met en évidence les logiques différentes entre volume d’adhérents et revenu.

### Mode présentation

Parcours guidé en **21 étapes** couvrant la vision, le réseau, la finance consolidée,
le rapprochement, la performance des salles, l’équipe et les accès, une salle, les adhérents,
les renouvellements, le contrôle d’accès, les paiements, la qualité, l’espace client,
la demande de renouvellement, le planning, l’expansion et la décision de pilote.
Navigation avec les flèches `←` `→`, sortie avec `Échap`.

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
assets/js/dashboard.js     réseau, finance, performance, équipe & accès, back-offices, rapports
assets/js/actions.js       adhérents, abonnements, finance, reçus, scanner, borne
assets/js/member-portal.js connexion, espace adhérent, planning et demandes
assets/js/presentation.js  parcours guidé en 21 étapes
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
- Les exports financiers sont générés en `.xls` (tableau HTML compatible Excel) ou via
  l’impression du navigateur pour un PDF. Aucun fichier n’est envoyé.

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

Les chiffres financiers, charges, objectifs et prévisions sont des **hypothèses de
simulation**. Ils ne constituent ni des comptes réels ni une promesse de gain. Ils doivent
être confrontés aux vrais volumes et factures de Jumeaux Fitness avant toute décision.

## Version « pro » (v7, révision 7.4)

Nouveautés, toutes simulées avec des données fictives :

- **Rôles** : bandeau en haut de chaque écran du back-office pour passer de Direction à Responsable de salle, Agent d'accueil ou Comptable. Le menu et les données changent, et ouvrir une autre salle est refusé (critères AC-01 et AC-02).
- **Pilote & décisions** (menu Analyse) : trajectoire en 9 phases, 9 critères d'acceptation, décisions attendues, fiche 1 page à imprimer en PDF.
- **Paiement Wave / Orange Money** (onglet Paiements) : scénario simulé de demande, redirection et réponses de webhook. Aucune signature réelle n’est vérifiée et aucun fournisseur n’est contacté.
- **Panne réseau** (bouton du bandeau) : contrôle « manuel requis » au lieu d'un faux accès, procédure manuelle tracée, régularisation au retour du réseau.
- **Rappel d'expiration** (onglet Abonnements) : aperçu WhatsApp, SMS et notification, marqué « exemple ».
- **Scan caméra** : repli jsQR (chargé à la demande) pour iPhone, où BarcodeDetector n'existe pas.
- Mode présentation : 21 étapes, dont rôles, Mobile Money, panne réseau et décision demandée. Le titre et la description s'affichent dans un bandeau compact en haut, libérant l'écran ; navigation aux flèches (← →), tactile par balayage horizontal sur mobile, et plein écran.
- **Logo officiel** : le logo fourni (`assets/images/logo.jpeg`) est décliné en `logo.png` (lockup complet) et `logo-mark.png` (emblème carré). Il est présent sur la page d’accueil, le back-office, les quatre salles (en-tête de chaque back-office et cartes établissement), l’espace adhérent, la borne, les reçus, la présentation, la fiche pilote et la page 404. Les icônes PWA et le favicon sont générés à partir de ce logo.
- `404.html`, image de partage 1200 x 630 (`assets/icons/og-image.png`), cache PWA `jfos-v7.4`.

Fichiers ajoutés : `assets/js/pro.js`, `assets/css/pro.css`, `assets/vendor/jsQR.js`,
`assets/images/logo.png`, `assets/images/logo-mark.png`.
À chaque modification, changer ensemble `?v=` dans `index.html` et `V` dans `sw.js`.

> Le script `assets/js/pro.js` se branche sur les fonctions de `app.js` : il doit être chargé
> **après** `assets/js/app.js` dans `index.html`.

## Avant la réunion
1. Ouvrir le site une fois avec internet, puis recharger (mise à jour du cache).
2. Tester sur un vrai iPhone (Safari) et un vrai Android (Chrome) : menu, rôles, scan caméra, plein écran, installation PWA.
3. Lancer Lighthouse (Chrome, onglet Lighthouse, mode mobile) : viser plus de 90 en accessibilité et performance.
4. Utiliser « Réinitialiser la démo » (Paramètres) entre deux présentations.

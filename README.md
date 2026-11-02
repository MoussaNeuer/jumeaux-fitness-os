# Jumeaux Fitness OS — démonstration commerciale

Prototype statique (HTML / CSS / JavaScript vanilla). **Toutes les données sont fictives** : aucun backend, aucune vraie authentification, aucun vrai paiement.

## Structure
- `index.html` : point d'entrée
- `assets/css/` : style.css (base + landing), dashboard.css, components.css (animations, présentation), responsive.css
- `assets/js/` : data.js (données fictives des 4 salles), core.js (état, graphiques, QR), landing.js, dashboard.js (direction + back-offices), actions.js (adhérents, paiements, scanner), member-portal.js, presentation.js, app.js (rendu)
- `manifest.json`, `sw.js`, `assets/icons/` : PWA

## Les 4 back-offices
Keur Massar, Yeumbeul, Guédiawaye et Parcelles ont chacun leurs adhérents, abonnements, paiements, présences et statistiques. Le total réseau est la somme des quatre salles.

## Publier sur GitHub Pages
1. Créer un dépôt et envoyer tout le contenu du dossier à la racine.
2. Settings → Pages → Source : branche `main`, dossier `/ (root)`.
3. Ouvrir `https://utilisateur.github.io/nom-du-projet/` (HTTPS requis pour la PWA).

## Utilisation devant le PDG
Bouton « Mode présentation » (10 étapes) · flèches ← → · Échap pour quitter.

## À valider avant la vraie plateforme
Tarifs, règles d'accès multi-salles, rôles : voir le cahier des charges (section 23).

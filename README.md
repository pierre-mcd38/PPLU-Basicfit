# 🏋️‍♂️ PPLU Basic-Fit • App Hypertrophie & Tracker (Android APK)

Application mobile **100 % hors-ligne** (Vanilla JS ES6 modulaire + CSS3 + Capacitor 6 Android) dédiée au suivi d'un programme de musculation **PPLU sur 4 jours (Push, Pull, Legs, Upper)** calibré pour le matériel **Basic-Fit**.

Conçue selon les recommandations scientifiques modernes sur l'hypertrophie (**Schoenfeld, Beardsley, Israetel**) avec une **protection biomécanique stricte du tendon du long biceps**.

---

## 📱 Télécharger et installer l'APK Android

À chaque modification poussée sur la branche `main`, **GitHub Actions** compile automatiquement une nouvelle version de l'application Android :

1. **Via les Releases GitHub (le plus rapide sur mobile)** :  
   👉 [**Télécharger `app-debug.apk` dans la dernière Release (`latest-apk`)**](https://github.com/pierre-mcd38/PPLU-Basicfit/releases/tag/latest-apk)
2. **Via l'onglet Actions** :  
   Ouvrez l'onglet [**Actions**](https://github.com/pierre-mcd38/PPLU-Basicfit/actions), cliquez sur le dernier workflow **Build Android APK** terminé, puis téléchargez l'artifact **`PPLU-BasicFit-APK`**.

---

## 🧬 Philosophie Scientifique & Biomécanique

### 1. Zéro « Junk Volume » : 3 séries effectives par exercice
- **100 % des exercices sont calibrés en 3 séries effectives** (`6-8`, `8-10` ou `10-12` répétitions, `RIR 0-2`) pour maximiser le recrutement des unités motrices à haut seuil dès la 1re série sans accumuler de fatigue nerveuse ni d'usure tendineuse parasite.
- **Aucune série au-delà de 12 répétitions** afin de limiter les cycles de frottement mécanique dans la gouttière bicipitale et d'éviter que la brûlure métabolique ne stoppe la série avant le véritable échec mécanique.
- **Temps de repos optimisés (2 à 3 minutes)** pour garantir une récupération complète du système nerveux central entre chaque série.

### 2. Protection stricte du Tendon du Long Biceps & du Labrum
- **Plan scapulaire & Prises neutres** : Priorité absolue aux prises neutres et semi-pronation avec coudes fléchis à **30-45°** dans le plan de l'omoplate.
- **Zéro hyperextension & Zéro Overhead** :
  - Aucun Dips, aucun Bayesian Curl (dos à la poulie), aucun Curl incliné lourd.
  - Aucune extension triceps *Overhead* (remplacée par l'extension poulie haute buste penché à 30° et la barre au front prise marteau, où le chef long possède son bras de levier maximal sans conflit sous-acromial).
  - Aucun tirage haut du dos en barre droite pronation coudes hauts (remplacé par des prises semi-pronation / neutres larges).
- **Exclusions strictes** : Aucun soulevé de terre, aucun leg curl allongé, aucune machine convergente.

---

## 📋 Structure du Programme PPLU (4 Jours)

| Séance | Format | Exercices principaux (3 variantes `Principal`, `V1`, `V2` par poste) |
| :--- | :---: | :--- |
| **1. PUSH** 🔥 | 6 Exos • 18 Séries | 1. Chest Press assise (neutre) → 2. Shoulder Press machine (neutre) → 3. Écarté poulie basse → 4. Élévations latérales poulie → 5. Extensions triceps barre V → 6. Extensions triceps corde (buste 30°) |
| **2. PULL** 🧲 | 6 Exos • 18 Séries | 1. Tirage vertical prise neutre → 2. Rowing machine appui thoracique → 3. Rowing T-Bar / MAG large → 4. Oiseau Pec Deck inversé → 5. Curl pupitre barre EZ → 6. Curl marteau corde |
| **3. LEGS** 🦵 | 5 Exos • 15 Séries | 1. Hack Squat → 2. Leg Curl assis (buste penché 15°) → 3. Leg Extension assis (dossier reculé) → 4. Mollets presse 45° → 5. Crunch poulie haute |
| **4. UPPER** ⚡ | 7 Exos • 21 Séries | 1. Développé incliné haltères (30°) → 2. Tirage vertical prise serrée → 3. Pec Deck assis → 4. Rowing poulie basse MAG large → 5. Élévations latérales machine → 6. Curl poulie basse face poulie → 7. Extensions triceps unilatérales |

---

## ⚡ Fonctionnalités Clés de l'Application

- **Validation de série `✓` & Auto-Chrono** : Un clic sur `✓` valide visuellement la série en vert, pré-remplit automatiquement la charge/répétitions si les champs étaient vides, et lance immédiatement le chronomètre de repos de l'exercice.
- **Coach de Surcharge Progressive (Double Progression)** : Analyse la dernière séance archivée et affiche automatiquement l'objectif du jour :
  - `🚀 Objectif : Monte à +2.5 kg` lorsque le haut de la fourchette de répétitions est validé sur les 3 séries.
  - `🎯 Objectif : Garde la charge & vise +1 rep` tant que la progression est en cours dans la fourchette.
- **Chronomètre Flottant & Wake Lock** : Calcul précis par delta de timestamp (résistant à la mise en veille), triple bip synthétisé via Web Audio API, vibrations haptiques et maintien de l'écran allumé (`🔒 Écran actif`).
- **Variantes & Ordre Dynamique** : Bascule instantanée entre `Principal`, `V1` et `V2` (avec historique indépendant par variante) et réorganisation de l'ordre des exercices (`↑` / `↓`).
- **Mode Screen 1 Écran** : Vue ultra-condensée permettant d'afficher l'intégralité de la séance sur un seul écran de téléphone.
- **Fiches Story HD 9:16 (`1080×1920`)** : Générateur Canvas PNG haute définition avec partage natif Android (`@capacitor/share` & `@capacitor/filesystem`).
- **Double Persistance Hors-Ligne & Rétrocompatibilité** : Sauvegarde temps réel dans `localStorage` + `IndexedDB`, export/import `.JSON`, copier/coller rapide et migration automatique des sauvegardes de l'ancienne version monolithique (`v5 → v6`).

---

## 🗂️ Architecture du Projet

```text
/
├── www/                        # Application Web servie par Capacitor
│   ├── index.html              # Structure HTML5 sémantique
│   ├── manifest.json           # Manifeste PWA & icônes SVG
│   ├── css/
│   │   ├── variables.css       # Design tokens, palette sombre, safe-areas
│   │   ├── layout.css          # Grille mobile-first, header sticky, bottom-nav, modales
│   │   └── components.css      # Cartes d'exercices, pilule chrono, badges, boutons
│   └── js/
│       ├── app.js              # Point d'entrée ES6 et initialisation
│       ├── data/
│       │   └── program.js      # Données PPLU, variantes, volume & règles biomécaniques
│       ├── store/
│       │   └── storage.js      # LocalStorage + IndexedDB + Import/Export JSON + Migration v5→v6
│       ├── features/
│       │   ├── timer.js        # Chronomètre, Wake Lock API, Web Audio API & vibrations
│       │   ├── workout.js      # Séries, validation ✓, Double Progression, variantes & Mode Screen
│       │   └── shareCard.js    # Générateur Canvas HD PNG 9:16 & partage natif Capacitor
│       └── ui/
│           └── render.js       # Rendu DOM et délégation d'événements globale
├── android/                    # Projet natif Android généré par Capacitor
├── .github/workflows/
│   └── build-apk.yml           # Pipeline CI/CD GitHub Actions (Node 20 + JDK 17 + Gradle)
├── capacitor.config.json       # Configuration Capacitor (com.basicfit.pplu)
└── package.json                # Dépendances Capacitor (@capacitor/core, android, filesystem, share)
```

---

## 🛠️ Développement Local

```bash
# 1. Installer les dépendances
npm install

# 2. Synchroniser le dossier www/ avec le projet natif Android
npm run cap:sync

# 3. Ouvrir le projet dans Android Studio (optionnel)
npm run cap:open
```

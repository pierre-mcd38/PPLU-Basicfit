# 📱 PPLU Basic-Fit • Application Mobile de Suivi de Musculation

**PPLU Basic-Fit** est une application mobile Android native (`.apk`) et Web **100 % hors-ligne**, conçue pour suivre ses séances de musculation en salle de manière fluide, rapide et sans aucune distraction.

Contrairement aux applications commerciales lourdes qui imposent une création de compte, un abonnement, une connexion Internet permanente et des dizaines de clics pour saisir une série, cette application a été pensée autour d'un seul principe : **zéro friction pendant l'entraînement**.

---

## 🎯 Que propose l'application ?

### 1. Une interface pensée pour la salle (Utilisation à une seule main)
- **Navigation au pouce** : Barre d'onglets fixe en bas de l'écran permettant de basculer instantanément entre les séances et les paramètres d'une seule main.
- **Saisie directe sans rechargement** : Les champs de poids (`KG`) et de répétitions (`REPS`) ouvrent directement le pavé numérique mobile et enregistrent chaque frappe en temps réel sans jamais fermer le clavier.
- **Système de variantes intégré (`Principal`, `V1`, `V2`)** : Si une machine est occupée en salle, un simple clic permet de basculer sur une variante équivalente. Chaque variante possède sa propre mémoire de charges, ses propres notes et son propre historique.
- **Réorganisation à la volée (`↑` / `↓`)** : L'ordre des exercices d'une séance peut être modifié en direct selon la disponibilité du matériel, avec possibilité de rétablir l'ordre par défaut en un clic.
- **Barre de progression de séance & Durée en direct** : Le sous-en-tête de chaque séance affiche en temps réel le nombre de séries validées (`📊 X / 18 séries`), une jauge visuelle d'avancement et le temps écoulé depuis le début de l'entraînement (`⏱️ XX min`).
- **Mode « Screen » (Vue condensée 1 écran)** : Un bouton dédié masque les grilles de saisie pour condenser l'intégralité de la séance, des prises et des performances sur un seul écran sans avoir à défiler.

### 2. Un suivi intelligent de la progression & de l'échauffement
- **Calculateur d'échauffement intelligent (`🔥 Chauffe`)** : Adapte automatiquement le protocole de chauffe selon que le groupe musculaire est froid (début de séance : 2 paliers courts à `50 % × 6-8 reps` puis `80 % × 2-3 reps` pour réveiller le système nerveux et les tendons sans fatigue lactique) ou déjà chaud (1 micro-série optionnelle de calibrage à `70 % × 3-4 reps`), avec lancement direct des temps de repos courts (`45s`, `1m00`, `1m30`).
- **Coach de Surcharge Progressive automatique (Double Progression)** : L'application analyse automatiquement les performances de la dernière séance par rapport à la fourchette cible de l'exercice et affiche l'objectif du jour :
  - **`🚀 Objectif : Monte à +2.5 kg`** lorsque le haut de la fourchette de répétitions a été validé sur toutes les séries.
  - **`🎯 Objectif : Garde la charge & vise +1 rep`** tant que la progression est en cours dans la fourchette.
- **Validation de série `✓` tout-en-un** : Cocher une série (`S1`, `S2`, `S3`) effectue trois actions simultanées :
  1. Colore la série en **vert** pour savoir immédiatement où l'on en est dans sa séance.
  2. **Auto-complète** intelligemment le poids et les répétitions si les champs ont été laissés vides (en reprenant la série précédente ou la dernière séance).
  3. **Démarre automatiquement le chronomètre de repos** calibré pour l'exercice.
- **Pré-remplissage rapide (`⚡ Pré-remplir`) & Propagation du poids** : Permet de charger en un clic toutes les performances de la séance précédente, ou de propager automatiquement le poids saisi en série 1 vers les séries suivantes.
- **Notes de réglages par machine** : Chaque exercice dispose d'un champ de note persistant pour mémoriser ses réglages personnels (hauteur du siège, cran du boudin, position de la poulie) et ses consignes d'exécution.
- **Historique multi-dates** : À la fin de l'entraînement, le bouton **Valider & Archiver** enregistre la séance dans l'historique daté de chaque exercice (avec possibilité de consulter, recopier ou supprimer une ancienne entrée).

### 3. Un chronomètre de repos et une gestion d'écran intégrés
- **Pilule chronomètre flottante** : Toujours visible au-dessus de la barre de navigation, quel que soit l'endroit où l'on se trouve sur la page.
- **Précision par horloge système** : Le décompte repose sur un calcul de différence de *timestamp* (`Date.now()`). Même si le téléphone est verrouillé ou si l'on change d'application pendant 2 minutes, le chronomètre ne prend aucun retard.
- **Alertes sonores & haptiques** : Émet un triple bip synthétisé (via *Web Audio API*, sans fichier audio externe) accompagné d'une vibration du téléphone à la fin du temps de repos.
- **Maintien de l'écran allumé (`🔒 Écran actif`)** : Intègre l'API *Screen Wake Lock* pour empêcher l'écran du smartphone de s'éteindre entre deux séries.

### 4. Partage visuel & Générateur de Fiches HD 9:16
- **Génération d'image PNG Haute Définition (`1080×1920`)** : L'application intègre un moteur de rendu *Canvas 2D* qui dessine instantanément et hors-ligne une fiche récapitulative complète de la séance au format Story (9:16), incluant les exercices, les variantes choisies, les charges du jour et les notes.
- **Partage natif Android** : Grâce à l'intégration native avec le système Android, la fiche générée peut être envoyée directement vers la galerie photo ou partagée sur n'importe quelle application.

---

## 💡 Pourquoi ces choix techniques ?

### 1. Pourquoi une application 100 % Hors-Ligne (Local-First) ?
Beaucoup de salles de sport (souvent situées en sous-sol ou dans des bâtiments métalliques) captent très mal le réseau mobile.
- L'application n'effectue **aucune requête réseau** : elle s'ouvre instantanément.
- **Double persistance locale (`localStorage` + `IndexedDB`)** : Toutes les données sont enregistrées simultanément dans deux moteurs de stockage internes du téléphone.
- **Portabilité totale des données** : L'onglet **⚙️ SYSTÈME** permet d'exporter et de partager toute sa base de données en un fichier `.JSON` (vers Google Drive, WhatsApp, Fichiers, etc.), de l'importer en un clic, ou de copier/coller son code de sauvegarde dans le presse-papiers.

### 2. Pourquoi du Vanilla JavaScript (ES6+) et CSS3 modulaire sans framework lourd ?
Le choix de ne pas utiliser de framework lourd (React, Angular, Vue) est volontaire :
- **Performance et batterie** : Aucun *Virtual DOM* gourmand en mémoire, démarrage immédiat dans la WebView Android et fluidité maximale à 60/120 Hz.
- **Pérennité et zéro dette technique** : Le code repose uniquement sur les standards natifs du Web (Modules ES6, CSS Variables, Canvas API, Web Audio API, IndexedDB, Wake Lock API), découpés proprement par responsabilités (`data/`, `store/`, `features/`, `ui/`).

### 3. Pourquoi Capacitor 6 + GitHub Actions ?
- **Expérience Android native** : **Capacitor** transforme l'application web en un véritable package Android (`.apk`) disposant des permissions natives (`WAKE_LOCK`, `VIBRATE`) et des ponts système (`@capacitor/filesystem` et `@capacitor/share`) pour que les exports de fichiers et d'images fonctionnent nativement sur téléphone.
- **Compilation Cloud automatisée (CI/CD)** : Le workflow GitHub Actions compile automatiquement l'APK Android dans le cloud à chaque modification du code source, sans nécessiter d'installer Android Studio ou le SDK Android sur son ordinateur.

---

## 🗂️ Architecture du Projet

```text
/
├── www/                        # Cœur de l'application (HTML5 / CSS3 / ES6 Modules)
│   ├── index.html              # Structure sémantique et modales
│   ├── manifest.json           # Manifeste PWA & icônes vectorielles embarquées
│   ├── css/
│   │   ├── variables.css       # Thème sombre, typographie, variables d'espacement
│   │   ├── layout.css          # Grille responsive mobile-first, navigation basse, modales
│   │   └── components.css      # Cartes d'exercices, pilule chrono, badges, boutons
│   └── js/
│       ├── app.js              # Point d'entrée et initialisation de l'application
│       ├── data/
│       │   └── program.js      # Structure des séances, variantes et consignes
│       ├── store/
│       │   └── storage.js      # Moteur de persistance (LocalStorage + IndexedDB) & Import/Export
│       ├── features/
│       │   ├── timer.js        # Chronomètre, Wake Lock API, synthèse audio & vibrations
│       │   ├── workout.js      # Logique de suivi, validation des séries, progression & Mode Screen
│       │   └── shareCard.js    # Génération graphique Canvas HD 9:16 & partage natif
│       └── ui/
│           └── render.js       # Rendu de l'interface et délégation globale des événements
├── android/                    # Projet natif Android généré par Capacitor
├── .github/workflows/
│   └── build-apk.yml           # Pipeline CI/CD de génération automatique de l'APK
├── capacitor.config.json       # Configuration Capacitor (com.basicfit.pplu)
└── package.json                # Dépendances Capacitor et scripts npm
```

---

## 📲 Téléchargement et Installation

1. Rendez-vous dans la section [**Releases (`latest-apk`)**](https://github.com/pierre-mcd38/PPLU-Basicfit/releases/tag/latest-apk) (ou dans l'onglet [**Actions**](https://github.com/pierre-mcd38/PPLU-Basicfit/actions) du dépôt GitHub).
2. Téléchargez le fichier **`app-debug.apk`** sur votre smartphone Android.
3. Lancez l'installation : l'application est immédiatement prête à l'emploi, 100 % hors-ligne.

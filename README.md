
# 🛒 YOVO MALL TOGO - E-Commerce PWA

Ce projet est une application e-commerce moderne (Progressive Web App) conçue pour le marché de Lomé. Elle utilise une architecture "No-Build" basée sur les modules ES natifs (ESM) et les `importmaps`.

## 🚀 Guide de démarrage rapide (VS Code)

Comme ce projet utilise des imports ESM directs depuis `esm.sh`, vous n'avez pas besoin d'une étape de compilation complexe (Webpack/Vite) pour le faire fonctionner localement.

### 1. Prérequis
*   **Visual Studio Code** installé.
*   Extension **"Live Server"** (de Ritwick Dey) installée dans VS Code.
*   Un navigateur moderne (Chrome, Edge ou Safari).

### 2. Installation
1.  Ouvrez le dossier du projet dans VS Code.
2.  Assurez-vous que tous les fichiers sont à la racine :
    *   `index.html`
    *   `index.tsx`
    *   `App.tsx`
    *   `db.ts`
    *   `manifest.json`

### 3. Lancement du projet
1.  Cliquez avec le bouton droit sur `index.html`.
2.  Sélectionnez **"Open with Live Server"**.
3.  L'application s'ouvrira automatiquement dans votre navigateur à l'adresse `http://127.0.0.1:5500`.

---

## 🛠️ Stack Technique
*   **Frontend :** React 19 (via ESM)
*   **Styling :** Tailwind CSS 3 (via CDN)
*   **Base de données :** Simulation MongoDB via `localStorage` (persistance locale par navigateur).
*   **Typage :** TypeScript natif.
*   **PWA :** Manifeste de l'application inclus pour installation mobile.

## 📁 Structure des fichiers
*   `index.html` : Point d'entrée, contient l'importmap pour gérer les dépendances React sans `node_modules`.
*   `index.tsx` : Initialisation du rendu React.
*   `App.tsx` : Logique principale, gestion des vues (Accueil, Magasin, Panier, Admin).
*   `db.ts` : Couche d'abstraction de données simulant les délais réseaux et les opérations CRUD.
*   `manifest.json` : Configuration pour l'installation sur smartphone.

## 🔑 Accès Administrateur
Pour tester la gestion du stock et voir les commandes :
1.  Allez dans la section **ADMIN**.
2.  Email : `admin@gmail.com`
3.  Mot de passe : `1234`

## 💡 Notes importantes
*   **Protocole HTTP :** En raison de l'utilisation des modules ES (`type="module"`), le fichier `index.html` **doit** être servi via un serveur local (comme Live Server). L'ouverture directe du fichier (`file://...`) causera des erreurs CORS.
*   **Persistance :** Les données (produits ajoutés, commandes) sont stockées dans le `localStorage` de votre navigateur. Si vous videz votre cache, les données de test reviendront à l'état initial.

---
*Développé pour YOVO MALL - Qualité Supérieure à Lomé.*

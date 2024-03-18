# Project Name

## Description

Provide a short description about your project. What does it do? What technologies does it use? Who would use it?

## Architecture

This project follows a monorepo structure with two main applications: a backend application and a frontend application, along with a shared directory.

### Backend (apps/back)
The backend application is structured as an AdonisJS application. It includes:

- `ace.js`: The CLI script for AdonisJS.
adonisrc.ts: The configuration file for AdonisJS.
- `app/`: Contains the main application logic, including exceptions, middleware, and models.
- `bin/`: Contains scripts for starting the server, running console commands, and running tests.
- `config/`: Contains configuration files for various aspects of the application.
- `database/`: Contains files related to database setup and migrations.
- `start/`: Contains files that are run at the start of the application.
- `tests/`: Contains test files.
- `doc-api/`: Contains api endpoint test files in .bru (use bruno => oss equivalent to postman)

Each file and directory has a specific role in the application. For example, the `app/services/media_librairy_service.ts` file appears to define a service for handling media library operations.

### Frontend (apps/front)
The frontend application is a Nuxt.js application. It includes:

- `app.vue`: The main Vue component.
- `components`/: Contains reusable Vue components.
- `layouts/`: Contains layout components used by Nuxt.js.
nuxt.config.ts: The configuration file for Nuxt.js.
- `pages/`: Contains page components used by Nuxt.js.
- `public/`: Contains static files that are served directly by Nuxt.js.
- `server/`: Contains server-side logic for the Nuxt.js application.

### Shared (shared/)
The shared/ directory is likely used for code that is shared between the frontend and backend applications.


Each application has its own package.json for managing dependencies, and there is a pnpm-workspace.yaml file at the root of the project for managing the monorepo with pnpm.

## Installation

### Setting Environment Variables
You need to set up environment variables for your application. These are usually stored in a .env file in the root of your backend application directory. If a .env.example file exists, you can copy it to create your .env file:

```bash cp .env.example .env```

Then, open the .env file and fill in the appropriate values for each variable.

### Running Migrations
Before running the server, you need to run database migrations. This sets up your database schema according to the definitions in your migration files. In an AdonisJS application, you can run migrations using the following command:

```bash cp .env.example .env```

### Launching the Server
Finally, you can start the server. If you're in a development environment, you can use the following command:

```pnpm  dev```

Or, if you're in a production environment, you can use:

```pnpm  dev```

Remember to run these commands in the root directory of your backend application.

## To do

### Multilinguisme
- [X] Implémenter la gestion des langues pour les articles.
- [X] Mettre en place la planification de la publication par langue.

### SEO Optimisé par Langue
- [ ] Ajouter des métadonnées personnalisées pour chaque traduction.
- [ ] Implémenter les données structurées pour le référencement.

### Bibliothèque Média
- [X] Développer un système de gestion des ressources visuelles et multimédias.
- [ ] Intégrer la possibilité d'ajouter facilement des médias aux articles.

### États de Publication
- [X] Ajouter la possibilité de créer des brouillons d'articles.
- [ ] Mettre en place la planification des publications futures.

### Interface Administrateur
- [X] Développer une interface intuitive pour la gestion du contenu.
- [ ] Intégrer des fonctionnalités de gestion d'articles, de langues, et de médias.

### Éditeur de Texte en Format Block
- [X] Intégrer un éditeur de texte en format block pour la rédaction flexible des articles.
- [ ] Permettre la mise en forme avancée du contenu.

### Images/Média Customizables
- [ ] Utiliser Sharp pour le traitement d'images.
- [ ] Intégrer IPX pour une optimisation dynamique des formats médias.

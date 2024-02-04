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


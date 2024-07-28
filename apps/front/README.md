# Nuxt 3 Minimal Starter

For more information on how to use Nuxt 3 and Nuxt UI, please refer to the following resources:

- [Nuxt 3 Documentation](https://v3.nuxtjs.org/)
- [Nuxt UI Documentation](https://ui.nuxt.com/)
- [Tailwind Documentation](https://ui.nuxt.com/)

These resources provide comprehensive guides and API references to help you understand and use Nuxt 3 and Nuxt UI effectively.

# Architecture

This project follows a monorepo structure with two main applications: a backend application (AdonisJS) and a frontend application (Nuxt.js), along with a shared directory.

## Backend (apps/back)

The backend application is built with AdonisJS and includes:

- `app/`: Contains the main application logic (controllers, models, services, etc.)
- `bin/`: Scripts for server management and testing
- `commands/`: Custom CLI commands (e.g., `schedule_posts.ts`)
- `config/`: Application configuration files
- `database/`: Database migrations and seeders
- `doc-api/`: API endpoint test files (.bru format for Bruno)
- `start/`: Application startup files
- `tests/`: Test files
- Configuration files: `ace.js`, `adonisrc.ts`, `.env.example`, `.gitignore`

Recent updates:

- Added media routes and validators
- Implemented user and role management features
- Refactored editor functionality

## Frontend (apps/front)

The frontend application is built with Nuxt.js and includes:

- `components/`: Reusable Vue components
- `composables/`: Composable functions for shared logic
- `layouts/`: Layout components
- `middleware/`: Custom middleware
- `pages/`: Page components, including admin pages
- `plugins/`: Nuxt.js plugins
- `public/`: Static assets
- `repositories/`: Data fetching and API interaction logic
- `server/`: Server-side logic
- `tiptap/`: Custom tiptap editor components
- `types/`: TypeScript type definitions
- `utils/`: Utility functions
- Configuration files: `app.config.ts`, `app.vue`, `nuxt.config.ts`, `tailwind.config.ts`

Recent updates:

- Added media link to admin navigation
- Refactored editor functionality
- Updated npm dependencies and plugins
- Implemented user and role management features

## Shared (shared/)

The `shared/` directory contains code shared between the frontend and backend applications.

Each application has its own `package.json` for managing dependencies, and there is a `pnpm-workspace.yaml` file at the root of the project for managing the monorepo with pnpm.

# Setup

Follow these steps to set up and launch the project in development mode:

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/cms-blog-monorepos.git
cd cms-blog-monorepos
```

# Features

## User Profile

The User Profile feature allows users to customize their experience and manage their account settings within the CMS.

Key components:

- Profile editing: Users can update their name, email, and password
- Avatar upload: Users can upload and set a custom profile picture
- Account settings: Management of email notifications and privacy preferences
- Activity log: View recent login sessions and content interactions

Implementation details:

- Accessible from the dashboard or navigation menu
- Includes theme preference management
- Requires updates to the user authentication system and frontend interface

## User and Role Management

This feature enhances administrators' ability to manage user accounts and control access within the CMS.

User Management:

- Create, edit, and delete user accounts
- View and search/filter user lists
- Enable/disable user accounts

Role Management:

- Create, edit, and delete user roles with customizable permissions
- Define granular permissions for CMS features
- Assign roles to user accounts

Implementation details:

- Accessible from the admin dashboard or navigation menu
- Implements role-based access control (RBAC)
- Requires updates to the authentication system, database schema, and admin interface

Both features significantly improve the CMS's user management capabilities and overall security.

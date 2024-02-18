# Nuxt 3 Minimal Starter

For more information on how to use Nuxt 3 and Nuxt UI, please refer to the following resources:

- [Nuxt 3 Documentation](https://v3.nuxtjs.org/)
- [Nuxt UI Documentation](https://ui.nuxt.com/)
- [Tailwind Documentation](https://ui.nuxt.com/)

These resources provide comprehensive guides and API references to help you understand and use Nuxt 3 and Nuxt UI effectively.
## Architecture

This project follows a specific directory structure:

- `app.vue`: This is the main Vue component.
- `components/`: This directory contains Vue components that are used in various parts of the application.
- `composables/`: This directory contains Vue composables, which are reusable logic functions in Vue.
- `layouts/`: This directory contains layout components, which dictate how other components are arranged on the page.
- `pages/`: This directory contains the Vue components that are mapped to routes.
- `plugins/`: This directory contains JavaScript plugins that you want to run before instantiating the root Vue.js application.
- `public/`: This directory contains static resources that are directly served by the server.
- `server/`: This directory contains server-side code.
- `types/`: This directory contains TypeScript type definitions.
- `utils/`: This directory contains utility functions.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

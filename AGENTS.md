# Agents Guide

## Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run generate` - Generate static site
- `bun run preview` - Preview production build
- `bunx drizzle-kit generate` - Generate DB migrations
- `bunx drizzle-kit migrate` - Run DB migrations
- `bunx drizzle-kit studio` - Open Drizzle Studio

## Code Style

- Vue 3 Composition API with `<script setup lang="ts">`
- Use Nuxt auto-imports (no explicit imports for Vue composables)
- Components: PascalCase files, descriptive names
- Utils: camelCase functions in `app/lib/utils.ts`
- DB schema: snake_case table names, camelCase columns
- API routes: Zod validation with `validateBody()`/`validateQuery()`
- Error handling: Use `handleApiError()` from utils
- Styling: Tailwind CSS with `cn()` utility for class merging
- Icons: lucide-vue-next with `LucideIconName` imports
- Types: Interface definitions inline or in server/types/index.ts
- Database: Drizzle ORM, Turso/SQLite with nanoid() for IDs

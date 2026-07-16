# AGENTS.md

## Commands
- `npm run dev` - Start Vite dev server (http://localhost:5173)
- `npm run build` - Production build to `dist/`
- `npm run typecheck` - Type-check with `tsc -b` (no lint or test scripts configured)

## Project Structure
- Onboard2Earn: a single feature app for staff-assisted customer onboarding and referral rewards
- `tsconfig.json` references `tsconfig.app.json` (src) and `tsconfig.node.json` (vite.config.ts)
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- React Router v7, routes defined in `src/app/App.tsx`
- Pages in `src/app/pages/` (`StartScreen.tsx`, `LoginPage.tsx`, `staff-rewards/`)
- Motion library: import from `"motion/react"` (not framer-motion)
- PWA-capable (`public/service-worker.js`, registered in `index.html`)

## Aliases
- `@` → `./src` (vite.config.ts:11-16, mirrored in tsconfig.app.json)

## Important
- Keep **both** React and Tailwind plugins in vite.config.ts - removing either breaks the build
- SVG/CSV files can be imported directly (`assetsInclude` in vite.config.ts)
- Entry point: `src/main.tsx` imports `src/styles/index.css` (loads Effra font, Tailwind)
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Atmospheris is the website for [www.atmospheris.org](https://www.atmospheris.org) — a reference implementation of the ISO 2533 Standard Atmosphere model. The site provides an interactive calculator, 3D atmosphere explorer, property tables, charts, and documentation for the companion Ruby gem and TypeScript library.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # SSG build (vite-ssg) + copies index.html → 404.html
npm run preview    # Preview production build locally
npm run deploy     # Build + write CNAME for GitHub Pages
```

No test suite exists in this repo. The core computation library lives in a separate repo (`atmospheris-js`).

## Architecture

**Stack:** Vue 3 (Composition API, `<script setup>`) + Vite + vite-ssg (Static Site Generation) + GitHub Pages

**SSG:** The entire site is pre-rendered at build time via `vite-ssg`. Routes are enumerated in `vite.config.js` → `ssgOptions.includedRoutes`. Client-side hydration handles interactivity (Three.js scene, Chart.js, etc.).

**Local library dependency:** The `atmospheris` package is a `file:` link to `../atmospheris-js` (the sibling repo). In CI, the deploy workflow checks out `atmospheris/atmospheris-js` into `vendor/`, builds it, and points `ATMOSPHERIS_PATH` env var at the dist. Locally you need the `atmospheris-js` repo cloned as a sibling directory with its dist built.

**Key directories:**
- `src/views/` — Page-level components (one per route)
- `src/components/calculator/` — Calculator sub-components: `CalculatorForm`, `CalculatorResults`, `AtmosphereExplorer` (Three.js 3D scene), `CalculatorTable`, `CalculatorCharts` (Chart.js)
- `src/components/layout/` — `TheHeader`, `TheFooter`
- `src/composables/` — Shared Vue composables (`useSeo`, `useTheme`, `useScrollAnimation`, `useReadingProgress`)
- `src/utils/` — Helper functions (`seoHelpers` for structured data schemas)
- `src/styles/` — `main.css` (design system tokens, light/dark themes) and `calculator.css`

**Calculator architecture:** `CalculatorView.vue` is the main page with tab routing (`/calculator`, `/calculator/explorer`, `/calculator/table`, `/calculator/charts`). It holds the shared state (current altitude, calculation result, mode) and delegates to tab-specific components. The form emits a `calculate` event; the parent calls `atmospheris` library functions (`getAllProperties`, `getAltitudeFromPressure`, `getAltitudeFromProperty`) and passes results down.

**Styling:** CSS custom properties design system defined in `main.css` with `[data-theme="dark"]` override block. Dark/light theme toggled via `localStorage` and `prefers-color-scheme` media query. No CSS framework.

**SEO:** Each view calls `useSeo()` composable which uses `@unhead/vue` to set meta tags, canonical URLs, Open Graph, Twitter cards, and JSON-LD structured data.

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds both `atmospheris-js` and the site, then deploys to GitHub Pages. Pushes to `main` trigger automatic deployment. The site domain is `www.atmospheris.org` (CNAME file).

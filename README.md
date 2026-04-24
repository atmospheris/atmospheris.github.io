# atmospheris.github.io

The official website for [Atmospheris](https://github.com/atmospheris/atmospheris) — the reference implementation of the ISO 2533 Standard Atmosphere model.

Published at **[www.atmospheris.org](https://www.atmospheris.org)**.

## What's Here

- **Interactive calculator** — compute 20+ atmospheric properties at any altitude from −2,000 m to 80,000 m
- **3D Atmosphere Explorer** — interactive Three.js visualization of atmosphere layers and particles
- **2D Charts** — Chart.js graphs of temperature, pressure, density, and speed of sound vs. altitude
- **Table Generator** — generate custom atmosphere tables with CSV export
- **Library documentation** — API reference for the Ruby gem and TypeScript/JavaScript package
- **ISO 2533 reference** — constants, temperature layers, calculation formulas
- **Symbols & References** — complete symbol definitions and bibliography
- **Dark/light theme** with responsive mobile layout

## Tech Stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vite](https://vite.dev/) + [vite-ssg](https://github.com/antfu/vite-ssg) — static site generation
- [vue-router](https://router.vuejs.org/) — client-side routing
- [Three.js](https://threejs.org/) — 3D atmosphere visualization
- [Chart.js](https://www.chartjs.org/) — 2D scientific graphs
- [atmospheris](https://www.npmjs.com/package/atmospheris) — TypeScript ISA calculation library
- Custom CSS design system (no framework)

## Development

```bash
npm install
npm run dev       # start dev server at http://localhost:5173
npm run build     # build static site to dist/
npm run preview   # preview production build
```

### Prerequisites

The site depends on the `atmospheris` TypeScript library located at `../../atmospheris-js`. Make sure it's built first:

```bash
cd ../../atmospheris-js
npm install
npm run build
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, 3D atmosphere preview, features |
| `/calculator` | Full interactive calculator with 4 tabs: Calculator, Explorer 3D, Table, Charts |
| `/library` | Ruby gem and TypeScript library documentation |
| `/iso-2533` | ISO 2533 Standard Atmosphere reference — constants, layers, formulas |
| `/symbols` | Math symbols, variables, and formulas used in the standard |
| `/references` | Bibliography and standards family comparison |
| `/about` | About Atmospheris and Ribose |

## Deployment

Deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).

The workflow:
1. Checks out this repo and `atmospheris/atmospheris-js`
2. Builds the JS library (`npm run build` in atmospheris-js)
3. Installs website dependencies and builds the static site (`vite-ssg build`)
4. Deploys to GitHub Pages

Custom domain: `www.atmospheris.org`

## Project Structure

```
src/
├── main.js                    # ViteSSG entry point
├── App.vue                    # Root component
├── router/index.js            # 7 routes + 404
├── styles/
│   ├── main.css               # Full CSS design system
│   └── calculator.css         # Calculator, explorer, table, chart styles
├── composables/
│   ├── useTheme.js            # Dark/light mode
│   ├── useSeo.js              # Per-page SEO meta
│   └── ...
├── components/
│   ├── layout/
│   │   ├── TheHeader.vue      # Fixed glassmorphism header
│   │   └── TheFooter.vue      # Gradient footer
│   └── calculator/
│       ├── CalculatorForm.vue     # Input form (altitude/pressure modes, temp offset)
│       ├── CalculatorResults.vue  # Results table with MathML symbols
│       ├── AtmosphereExplorer.vue # Three.js 3D atmosphere column
│       ├── CalculatorCharts.vue   # Chart.js 2D graphs
│       └── CalculatorTable.vue    # Table generator with CSV export
└── views/
    ├── HomeView.vue           # Homepage
    ├── CalculatorView.vue     # 4-tab calculator page
    ├── LibraryView.vue        # Library docs
    ├── Iso2533View.vue        # ISO 2533 reference with MathML formulas
    ├── SymbolsView.vue         # Math symbols & variables
    ├── ReferencesView.vue      # Bibliography
    └── AboutView.vue          # About page
```

## License

BSD-2-Clause — Ribose Inc.

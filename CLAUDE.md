# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PharmAid — frontend web application for a major Russian vaccine supplier and biopharmaceutical manufacturer. Built with custom Web Components (CElement framework), Lit-HTML templating, and PostCSS styling. Bundled with Webpack 5, managed with Yarn.

Comments throughout the codebase are in Russian.

## Commands

- **Dev server**: `yarn dev` (runs on port 1113, serves from `public/`)
- **Production build**: `./build.sh` (runs `yarn build`, copies static assets, adds cache-busting timestamps, removes newlines from template literals in JS bundle, deletes standalone `styles.bundle.js`)
- **Install dependencies**: `yarn`

No test or lint commands are configured.

## Architecture

### Entry Point Flow

`src/entries/base.ts` -> creates `MyApp extends App` -> registers components, binds methods, fires lifecycle hooks (`created`, `onload`, `onresize`).

### Core Classes

- **`App`** (`src/app/App.ts`): Application orchestrator. Registers custom elements (converting CamelCase names to dash-case via `camelToDash`), manages media screen detection via CSS custom property `--media-screen`, throttles resize events (200ms). Lifecycle hooks: `created()`, `onload()`, `onresize(oldScreen, newScreen)`. Utility: `isTouchDevice()`, `isMobileScreen()`, `isDesktopScreen()`.
- **`CElement`** (`src/components/c-element/c-element.ts`): Base class for all custom elements extending `HTMLElement`. Provides Shadow DOM, Lit-HTML rendering (`render`/`html`), IntersectionObserver for lazy init (`intersectedCallback`), and DOM helpers (`$find`, `$findAll`, `$on`, `$emit`, `$get`, `$set`, `$remove`, `$createSlotRoot`, `$render`, `$update`).

### Key Directories

- `src/entries/` — Webpack entry points (JS bundle + styles bundle)
- `src/app/` — App class and config
- `src/components/` — CElement base class (new components extend this)
- `src/directives/` — Reusable behaviors: `collapse.ts` (accordion), `fade.ts` (transitions), `body-lock.ts` (scroll lock)
- `src/plugins/` — Event bus (`bus.ts`) for inter-component communication via Comment node
- `src/utils/` — Helpers: throttle decorator, animation restart, case conversion, intersection observer, template interpolation, object utilities
- `src/pages/` — HTML page templates (fed to HtmlWebpackPlugin via `src/routes.ts`)
- `src/views/` — Partial HTML fragments (header, footer, popups, preload)
- `src/assets/styles/` — PostCSS styles organized into: `common/` (global), `entries/` (bundle entry points as .ts), `form/` (form components), `ui/` (header, footer, menus), `mixins/`
- `src/assets/svg/icons/` — SVG icons (checkbox, radio button)
- `src/types/` — Custom type declarations for untyped dependencies (body-scroll-lock, CSS modules, PostCSS plugins)
- `public/` — Static assets (images, favicon); `public/dist/` is the build output

### Build Pipeline

Webpack processes two entry bundles:
- **`base`** — JS/TS bundle (`src/entries/base.ts`)
- **`styles`** — CSS bundle (assembled from .ts entry files in `src/assets/styles/entries/` that import CSS: root, fonts, top, common, ui)

PostCSS pipeline: global data -> custom media queries -> mixins -> easings -> for loops -> responsive type -> hover media feature -> simple vars -> hexrgba -> nested ancestors -> nested selectors. Production adds pxtorem (16px root).

`build.sh` post-processes: copies images/favicon, fixes relative paths, adds version timestamps to asset URLs, strips newlines from JS, removes `styles.bundle.js`.

### Routing

Routes defined in `src/routes.ts` — each route maps to an HTML template in `src/pages/`. Currently one route: `index.html` ("Главная страница"). HtmlWebpackPlugin generates the output HTML for each route.

### Current State

- Only the home page (`index.html`) exists with basic structure (header, main, footer)
- No custom components registered yet (components object is empty in `base.ts`)
- Header and footer views are present but have empty content
- Style infrastructure is in place (fonts, colors, normalize, typography, forms, header/footer/menu styles)

## Dependencies

**Runtime**: `lit-html` (templating), `body-scroll-lock` (popup scroll management), `imask` (input masking), `headroom.js` (header hide-on-scroll)

**Key dev**: Webpack 5, TypeScript 5.9, PostCSS with 15+ plugins, html-webpack-plugin, terser, cssnano + clean-css

## Conventions

- Path alias: `@/*` maps to `./src/*` (configured in tsconfig and webpack)
- Component registration: pass class name in CamelCase to `App.components` — it auto-converts to dash-case for the custom element tag
- CElement utility methods are prefixed with `$` (e.g., `$find`, `$emit`)
- Private methods prefixed with `_`
- TypeScript strict mode enabled (`strict: true`, target ES2020)
- Styles entry points are `.ts` files that import CSS (allows webpack to process them)
- CSS uses PostCSS features: nesting, mixins (prefixed with `_`), custom media queries, simple vars
- SVG icons inlined as webpack assets
- HTML views included via `require()` in page templates (processed by html-loader)
- `App.methods` динамически расширяет экземпляр App — внутри `onload`/`onresize` доступ к методам через `this['methodName']`

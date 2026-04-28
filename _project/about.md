# About this project

Vue 3 + Vite app exploring an interactive CKM (Cardiovascular-Kidney-Metabolic) Venn diagram for the American Heart Association. Each version of the diagram lives at its own route (`/`, `/v2`, `/v3`, `/v4`, …) so we can iterate on visual / interaction approaches in parallel without breaking existing ones.

## Folders you'll care about

- **`_assets/`** — design assets (icons, organ illustrations, source SVG/EPS) to use as you build
- **`_context/`** — project brief and reference materials (read `00-project-brief.pdf` first)
- **`_plan/`** — optional. If you want AI to generate a plan before coding, drop it here as `vN.md` (see existing `v1.md` for shape)
- **`src/components/`** — the `ckmh-connections-*.vue` components, one per version
- **`src/views/`** — the route-level views that wrap each component

## Adding a new version (e.g. v5)

The fastest way is to ask Claude to scaffold it for you. One prompt usually does it:

> Create a new v5 version of the CKMH connections experience: duplicate `ckmh-connections-v3.vue` as `ckmh-connections-v5.vue`, create a matching `V5View.vue` based on `V3View.vue`, and add a `/v5` route in `src/router/index.js`.

Swap `v3` for whichever version you want to fork from (the latest is usually the best base).

After the scaffold is done, iterate on the new file with focused prompts, e.g.:

> In `ckmh-connections-v5.vue`, replace the click ripple with a particle burst that radiates from each organ label.

> Make the hover state on the base circles desaturate the unfocused ones instead of dimming them.

Once it's running, visit `/v5` in dev (or `/#/v5` in the production build — prod uses hash history).

## Running locally

```bash
pnpm install
pnpm dev
```

## Shared data

All versions read from `src/data/ckmh-connections.js`. If you need region-level content changes, edit there once and every version picks them up.

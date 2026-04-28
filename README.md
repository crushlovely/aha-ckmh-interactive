# aha-ckmh-interactive

An interactive Venn-diagram learning experience for the American Heart Association exploring how **Cardiovascular**, **Kidney**, and **Metabolic** health are connected. Built with Vue 3 + Vite. Each design iteration lives at its own route (`/`, `/v2`, `/v3`, …) so we can prototype in parallel without breaking earlier versions.

## Repository layout

| Folder | What's in it |
| --- | --- |
| `_assets/` | Design assets — organ illustrations, weather icons, source SVG/EPS, etc. Pull from here when building. |
| `_context/` | Project brief and reference material. Start with `00-project-brief.pdf` for audience and goals. |
| `_plan/` | Optional pre-dev plans. Use AI to generate a comprehensive plan before coding and drop it here as `vN.md`. |
| `_project/` | Internal project docs. See `about.md` for the workflow when adding a new version. |
| `src/components/` | The `ckmh-connections-*.vue` components — one file per version. |
| `src/views/` | Route-level views that wrap each version's component. |
| `src/data/ckmh-connections.js` | Shared region content (titles, body, callouts, stats) — every version reads from here. |
| `src/router/index.js` | Vue Router config; add a route here when introducing a new version. |


## Running locally

```bash
pnpm install
pnpm dev
```

Then visit the dev URL (Vite prints it on start).

## Adding a new version

Create feature branches for new work.

See [`_project/about.md`](_project/about.md) for the duplicate-component → view → route workflow.


## Deploy

Merge feature branch into main and the project will deploy to github pages at
[https://crushlovely.github.io/aha-ckmh-interactive](https://crushlovely.github.io/aha-ckmh-interactive)


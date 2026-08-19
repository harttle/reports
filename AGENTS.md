# Reports

Marp slide decks. Each talk is a folder with `slides.md`. Shared styles in `themes/`, shared images in `assets/`. Config in `.marprc.yml`, build via `scripts/build.mjs`. Syntax highlighting uses Marp’s built-in highlight.js via `scripts/engine.js` (registers Liquid and mixed HTML+Liquid).

## Conventions

- Themes live in `themes/` (one CSS file per theme); pick with `theme: …` in slide frontmatter — no per-report `theme.css`
- Assets live in repo-root `assets/`, referenced as `../assets/…` from slide markdown
- For layout and styling details, read the theme file and existing slides — do not duplicate them here

## Commands

```bash
npm install
npm start          # http://localhost:8080/<report>/slides.md
npm run build      # dist/
```

## Before finishing theme/HTML changes

Export PNGs to `.local/` and inspect them. Put all scratch output under `.local/` — not the repo root.

```bash
marp <report>/slides.md -o .local/verify.png --images png --theme-set themes --allow-local-files
```

Use `--slide N` for a single slide.

## Temporary files

Put all scratch output under `.local/` — PNG exports, test HTML, one-off scripts, etc. Do not leave temporary files in the project root or report folders. Delete `.local/` contents when done.

# Reports

Talks and slide decks, built with [Marp](https://marp.app/) and published to GitHub Pages.

- Site: https://harttle.github.io/reports/ (also https://www.harttle.com/reports/)
- LiquidJS talk: https://harttle.github.io/reports/liquidjs-nus-2026-08/

## Layout

Each report lives in its own directory with a `slides.md` file. Shared assets and slide styles live at the repo root:

```
assets/
  liquidjs-logo.png
themes/
  liquidjs.css
liquidjs-nus-2026-08/
  slides.md
```

`npm run build` runs `scripts/build.mjs`, which builds every `*/slides.md` into `dist/`. Shared Marp options live in `.marprc.yml`.

## Commands

```bash
npm install
npm start          # live Marp server
npm run build      # build all reports into dist/
```

While the server is running, open http://localhost:8080/liquidjs-nus-2026-08/slides.md

# Reports

Talks and slide decks, built with [Marp](https://marp.app/) and published to GitHub Pages.

- Site: https://harttle.github.io/reports/
- LiquidJS talk: https://harttle.github.io/reports/liquidjs-opensource/

## Layout

Each report lives in its own directory with a `slides.md` file (and optional `theme.css` / `assets/`):

```
liquidjs-opensource/
  slides.md
  theme.css
  assets/
```

`npm run build` finds every such directory and writes HTML into `dist/`.

## Commands

```bash
npm install
npm start          # live Marp server
npm run build      # build all reports into dist/
```

While the server is running, open http://localhost:8080/liquidjs-opensource/slides.md

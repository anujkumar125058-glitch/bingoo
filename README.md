# Bingo 25 — Vercel-ready source

This ZIP is structured so that `package.json`, `index.html`, `vite.config.js`, and the `src/` folder are all at the project root.

## Deploy correctly
1. Extract this ZIP.
2. Create a GitHub repository.
3. Upload the **contents inside** the extracted `bingo-25-vercel-final` folder directly to the repository root. Do not upload the ZIP itself and do not put the whole folder one level deeper.
4. In Vercel, import that repository.
5. Set Root Directory to `./`, Framework to Vite, Build Command to `npm run build`, and Output Directory to `dist`.

The repository root must contain:
- `package.json`
- `index.html`
- `vite.config.js`
- `src/main.jsx`
- `src/App.jsx`
- `src/style.css`

Run locally with Node.js 18+: `npm install` then `npm run build`.

# quest

## Dev

```bash
cd /path/to/mam && npm start
# Open http://localhost:9080/bog/quest/app/-/test.html
```

## Build

```bash
npx mam bog/quest
```

## Docker

```bash
docker compose up --build
# Open http://localhost:8080
```

## Deploy

Push to `master` → GitHub Actions → GitHub Pages: https://bog.github.io/quest/

Feature branches deploy to: https://bog.github.io/quest/{branch-name}/

## Desktop (Tauri)

Tag `v*` triggers Tauri build via GitHub Actions.

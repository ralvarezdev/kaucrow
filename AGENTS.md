# kaucrow — agent guide

The memorial site for Javier Pérez (@kaucrow), made by his friends: a single-page
React 19 app where the photos hang in five three.js scenes (night sky, gallery,
table, a growing crowd, a desktop in his own Hyprland style). Visitors cannot
upload — the album is curated from this repo, and every contribution arrives as
a pull request and is read before it is merged. Content rules live in `README.md`.

## Commands (repo root, needs Node 22 + pnpm)

- Setup: `task frontend:install` (pnpm, frozen lockfile)
- Dev: `task frontend:dev`; production build locally: `task frontend:preview`
- Gate: `task check` (Biome lint, typecheck, Vitest); `task ci` adds the build
- Individually: `task lint:frontend`, `task typecheck:frontend`,
  `task test:frontend`, `task coverage:frontend`; `task fmt:fix` applies Biome fixes
- Deploy: `task deploy` — runs `ci`, then uploads `web/dist` to Cloudflare Pages
  (needs the three `CLOUDFLARE_*` values in `.env`, see `.env.example`)

## Layout

```
web/src/components/       Crow sprite, Ferris crab, shared ui/ primitives
web/src/features/album/   store, phrases, seed data, expanded view, support links
web/src/features/scenes/  one file per scene, shared frame code, scene registry
web/src/styles/           tokens.css (spacing/radii), themes.css (one theme per scene)
web/public/photos/        committed WebP photos and thumb/ (480px) for the Growing scene
memories/                 one markdown file per person; not rendered on the site yet
```

## Conventions

- One theme per scene: `themes.css` switches on `data-scene`, so components never
  know which scene they are in — but three.js scene colours live in each scene
  file, so a palette change means editing both places.
- A new photo is converted to WebP with `-strip` (drops EXIF and location), given a
  480px `thumb/` copy, then its number added to `PHOTO_NUMBERS` in
  `features/album/data/seed.ts`.
- Everything animated honours `prefers-reduced-motion`, and the hidden list of real
  buttons mirroring the canvas photos is the keyboard/screen-reader path — keep
  both when adding or changing a scene.
- The layout is authored for 1280×800 and fitted to the window, so narrow windows
  crop rather than reflow.

## Boundaries

- Always: keep the prose about Javier factual and kind; run `task check` before
  proposing a change.
- Ask first: editing remembrance text, the memorial framing or the support links;
  adding photos of identifiable people; setting `SHOW_FAMILY`.
- Never: commit a photo with location metadata or without the people's consent;
  reuse the photos elsewhere; merge a contribution unreviewed; commit `.env`.

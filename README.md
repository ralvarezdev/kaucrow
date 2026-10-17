# Kaucrow Memorial

> *Fly high, kaucrow.*

A small website to remember **Javier Pérez**, known online as **@kaucrow**
(2005 – 2026), made by his friends. It is a photo album you can
walk through: the photos hang in a night sky, a gallery, on a table, in a
crowd that keeps growing, and on a desktop styled after his own setup.

- Profile: [github.com/kaucrow](https://github.com/kaucrow)
- His dotfiles: [github.com/kaucrow/dotfiles](https://github.com/kaucrow/dotfiles)

---

## Javier

Javier was a programmer. He kept his own setup on Arch Linux with
Hyprland, a palette generated with matugen and JetBrains Mono, and he
published it as dotfiles for anyone to copy. Rust was his favourite
language, which is why a pixel crab walks along the bottom of the page. A
crow stands in the corner too, after his handle, *kaucrow*.

This site borrows from all of that on purpose. The colours and the font come
from his own setup, and the crab and the crow nod to what he loved, so the
album feels like his corner of the internet.

<!--
  This section is short because it only says what the code and his public
  profile can back up. Add what only his friends know: how you met him,
  what he was working on, what he was like, the jokes, the projects, the
  things he taught you. A few honest paragraphs matter more here than
  anything in the sections below.
-->

### What his friends say

The page rotates short lines under his name. Some are jokes only a
programmer would get, some are plain. All of them live in
[`web/src/features/album/data/phrases.ts`](web/src/features/album/data/phrases.ts),
and anyone who loved him is welcome to add one.

> Compiled without warnings. · Thanks for the rice. · cargo run forever. ·
> Still in everyone's PATH. · Memory-safe in all of ours. · Fly high, kaucrow.

### Ways to help

Two links in the page point to things that matter in the fight against
leukemia: where to donate to research and patient support, and how to join
a bone marrow registry. They are in
[`web/src/features/album/data/support.ts`](web/src/features/album/data/support.ts):

| Kind | Organization |
| --- | --- |
| Donate | [Leukemia & Lymphoma Society](https://give.lls.org) |
| Join a registry | [NMDP (Be The Match)](https://www.nmdp.org/get-involved/join-the-registry) |
| Join a registry | [DKMS](https://www.dkms.org/register-donor) |

Registries differ by country. If there is a local organization where you
live, add it to that file.

---

## Share your memories / Comparte tus recuerdos

**English.** Everyone who knew Javier is invited to add to this page: your
memories, your thanks, what you admired about him, what you remember, what
you appreciate. You can also add phrases for the rotating line and photos you
would like to share. Big or small, all of it counts.

**Español.** Invitamos a todos los que conocieron a Javier a sumar a esta
página: tus recuerdos, tus agradecimientos, las cosas que admirabas de él, lo
que recuerdas, lo que aprecias de Javier, etc. También puedes añadir frases
para la línea que rota y fotos que quieras compartir. Cualquier aporte, grande
o pequeño, cuenta.

### What you can add / Qué puedes aportar

| What / Qué | Where / Dónde |
| --- | --- |
| Memories, thanks, what you admired and appreciate / Recuerdos, agradecimientos, lo que admirabas y aprecias | a file in [`memories/`](memories/), see its [README](memories/README.md) |
| Phrases / Frases | [`web/src/features/album/data/phrases.ts`](web/src/features/album/data/phrases.ts) |
| Photos / Fotos | [`web/public/photos/`](web/public/photos/), see [Adding photos](#adding-photos) |
| Names and notes for photos / Nombres y notas para fotos | [`web/src/features/album/data/seed.ts`](web/src/features/album/data/seed.ts) |

### How: only through pull requests / Cómo: solo con pull requests

Every contribution goes through a **pull request**, and nothing is merged or
published until it has been read. This is to prevent anything written or
shared in bad faith, and to take care of Javier's memory and of the people in
the photos.

Toda contribución pasa por un **pull request**, y nada se integra ni se
publica hasta que haya sido leído. Es para evitar cualquier mala intención y
para cuidar la memoria de Javier y a las personas que aparecen en las fotos.

1. Ask for access, or send what you want to add to the person who looks after
   the repository, [@ralvarezdev](https://github.com/ralvarezdev), who can
   open the pull request for you. The repository is private for now. /
   Pide acceso, o envía lo que quieras añadir a quien cuida el repositorio,
   [@ralvarezdev](https://github.com/ralvarezdev), que puede abrir el pull
   request por ti. Por ahora el repositorio es privado.
2. Make your change on a branch and open a pull request against `main`. /
   Haz tu cambio en una rama y abre un pull request hacia `main`.
3. Wait for it to be read and merged. We may ask you to change something. /
   Espera a que lo lean y lo integren. Es posible que te pidamos cambiar algo.

### Please / Por favor

- Be kind and honest. This is a place to remember him. / Sé amable y
  honesto. Este es un lugar para recordarlo.
- Share only photos you are allowed to share, and only if the people in them
  would be happy to see them here. / Comparte solo fotos que puedas compartir,
  y solo si a quienes salen en ellas les alegraría verlas aquí.
- Do not include phone numbers, addresses, or other private data, and no
  links or ads. / No incluyas teléfonos, direcciones ni otros datos privados,
  ni enlaces o publicidad.
- Convert photos as shown in [Adding photos](#adding-photos), so location
  metadata is removed. If that is hard, send the photo to the maintainer
  instead of committing the original. / Convierte las fotos como se indica en
  [Adding photos](#adding-photos), para quitar la ubicación. Si es difícil,
  envía la foto al encargado en vez de subir el original.

---

## The album

The album is curated: photos come from this repository, and visitors cannot
upload anything. That is a choice, so the page stays safe and calm.

Five views, switched from the bottom-left:

| View | What it is |
| --- | --- |
| **Night sky** | Photos float at three depths with slow parallax, joined by dotted constellations. |
| **Gallery** | A 3D room with framed photos on the walls. |
| **Table** | A tilted tabletop with scattered prints and one picked up. |
| **Growing** | A crowd of 100+ small photos. Scroll to zoom, drag to look around. |
| **Kaucrow's dotfiles** | Tiled windows in the style of his Hyprland setup, with his palette and font. |

Things you can do:

- **Click the large photo** (or press *Expand photo*) to see it big, at its own
  proportions. Esc closes it.
- **Click any smaller photo** to bring it into focus.
- **Watch it change.** Every few seconds one shown photo is swapped for one
  waiting out of sight, so every photo gets its turn.
- **Poke the crow.** It follows the pointer and caws when clicked.
- **Wait for the crab.** It scuttles across the bottom, stops to wave its
  claws, and moves on. With reduced motion turned on, it stands still.

Everything animated respects `prefers-reduced-motion`.

---

## Adding photos

Photos live in `web/public/photos/` as WebP, with 480px copies in
`web/public/photos/thumb/` for the small cards in *Growing*.

To convert a folder of JPEGs (needs ImageMagick):

```sh
for f in *.jpg; do
  magick "$f" -auto-orient -resize '1600x1600>' -strip -quality 82 \
    web/public/photos/"${f%.jpg}.webp"
  magick "$f" -auto-orient -resize '480x480>' -strip -quality 75 \
    web/public/photos/thumb/"${f%.jpg}.webp"
done
```

`-strip` removes metadata, including any location. Do this every time:
these photos show real people.

Then list the file numbers in
[`web/src/features/album/data/seed.ts`](web/src/features/album/data/seed.ts)
(`PHOTO_NUMBERS`, files named `javier-0001.webp` and so on). The scenes show
a different selection on each load.

Photos belong to the friends and family who shared them. Please don't reuse
them elsewhere without asking.

### Still open

- Names and short notes for individual photos. Notes show as captions in
  the expanded view.
- Family photos. Everyone is `friends` for now, so the Family group is
  hidden. Set `SHOW_FAMILY = true` in
  [`web/src/features/album/config.ts`](web/src/features/album/config.ts) once
  there are some, and mark which photos are family.

---

## Technical notes

| Area | Choice |
| --- | --- |
| App | Vite, React 19, strict TypeScript |
| 3D | three.js through `@react-three/fiber` and `drei` |
| State | zustand |
| Styles | CSS Modules and CSS variables, no CSS-in-JS |
| Lint | Biome |
| Tests | Vitest and Testing Library |
| Tasks | [Task](https://taskfile.dev) |
| Hosting | Cloudflare Pages (direct upload) |

### Run it

You need Node 22 and [pnpm](https://pnpm.io).

```sh
cd web
pnpm install
pnpm dev
```

With [Task](https://taskfile.dev) installed, from the repository root:

```sh
task frontend:dev     # dev server
task check            # lint, typecheck, tests
task ci               # check plus a production build
```

### Deploy

Copy `.env.example` to `.env` and fill in `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_PAGES_PROJECT`, then:

```sh
task deploy
```

It runs the CI gate and uploads `web/dist` to Cloudflare Pages.
`.env` is git-ignored.

### How it is organised

```
web/src/
  components/
    Crow/       the crow sprite, with gaze and caw
    Ferris/     the pixel crab and its patrol
    ui/         Button, Chip, Field, Dialog
  features/
    album/      store, header, phrases, expanded view, support links, seed data
    scenes/     night-sky, gallery, table, growing, dotfiles, shared frame code
  styles/
    tokens.css  shared spacing, radii, colours
    themes.css  one theme per scene, chosen with data-scene
```

- **One theme per scene.** `themes.css` swaps colours, fonts and header
  alignment by `data-scene`, so no component needs to know which scene it is in.
- **Photos at their own proportions.** Each photo is fitted inside its frame
  and never stretched; spare space shows the frame's paper colour.
- **Accessible alongside a canvas.** A hidden list of real buttons mirrors the
  photos in the scene, so keyboard and screen-reader users can use them too.
- **Scene colours** inside three.js live in each scene file, not in the CSS
  variables, so changing a palette means editing both places.

### Known limits

- The layout is authored for 1280×800 and fitted to the window, so very
  narrow screens crop the sides instead of reflowing.
- Blurring far cards in *Growing* needs Safari 18 or newer.
- The three.js bundle is large (about 917 kB, 244 kB gzipped).

---

## Credits

- **Ferris**, Rust's mascot, by Karen Rustad Tölva, is in the public domain
  (CC0). The pixel crab is a hand-drawn sprite traced from it.
- **Dotfiles**: the palette, the font choice and the window layout of the
  *Kaucrow's dotfiles* view come from
  [kaucrow/dotfiles](https://github.com/kaucrow/dotfiles).
- **Fonts**: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) and
  [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif),
  both under the SIL Open Font License.
- **Crow**: the sprite comes from the mockups made for this site.

---

*Thanks for everything, Javier.*

# Proposals

Design proposals for the site, each a runnable preview. They are throwaway: none of them is part of the app or its build, and they read the album's photos in place from `web/public/photos`, so they carry no copies.

| Proposal | What it explores | Open it |
|---|---|---|
| `motion-preview/` | Loading, scene transitions, photo, lightbox and header motion (A–D). Built into the app. | Open `index.html` in a browser. |
| `gallery-preview/` | Six ways to show the whole gallery as one view: constellation field, memory sphere, overview grid, corridor, table pile, stained-glass crow. | Open `index.html` in a browser. |
| `cosmos-preview/` | The chosen direction in three.js: one sky of zones you zoom into, the ThinkPad as the overview grid, the Arch star as home, four ways to define zones, and a guided journey. | `task proposals:cosmos`, then http://localhost:5199 (WebGL will not load textures from `file://`). |
| `claude-design/` | The original mockups the site was made from. | Open the HTML in a browser. |

The Cosmos zones are placeholders until each photo has a `zone` field.

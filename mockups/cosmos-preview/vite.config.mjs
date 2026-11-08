// Dev server for the Cosmos proposal. It lives outside web/, so it borrows web's packages, sources and photos:
//   task proposals:cosmos   (from the repo root)
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))
const web = here('../../web')
const requireFromWeb = createRequire(`${web}/package.json`)
const react = (await import(requireFromWeb.resolve('@vitejs/plugin-react'))).default

export default {
  root: here('.'),
  // The album's photos, served at /photos/ as in the app.
  publicDir: `${web}/public`,
  plugins: [react()],
  resolve: {
    alias: {
      '@': `${web}/src`,
      // main.ts sits outside web/, so its bare imports would not find web's node_modules.
      three: `${web}/node_modules/three`,
      react: `${web}/node_modules/react`,
      'react-dom': `${web}/node_modules/react-dom`,
    },
    dedupe: ['react', 'react-dom', 'three'],
  },
  server: { port: 5199, strictPort: true, fs: { allow: [here('../..')] } },
}

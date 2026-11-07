// Deploys dist/ as a Cloudflare Worker (static assets). The public hostname is
// configuration, not code: SITE_HOST (a bare hostname such as kaucrow.dev) comes from
// the repo-root .env, the shell or a repository variable. wrangler cannot take a custom domain on
// its command line, so this writes wrangler.deploy.jsonc (git-ignored) from wrangler.jsonc
// plus the route, then runs wrangler against it. Without SITE_HOST nothing is bound and
// the Worker answers on its workers.dev address. Extra arguments go to wrangler
// (`node web/scripts/deploy.mjs --dry-run`).
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';

// The API token is a secret handled by reference: CLOUDFLARE_API_TOKEN_FILE names a file that
// holds it (mode 0600, outside the repo; a leading ~ is expanded), read here and handed to
// wrangler only. CLOUDFLARE_API_TOKEN itself still works and wins when both are set.

const host = (process.env.SITE_HOST ?? '').trim().toLowerCase();
if (host && !/^(?=.{4,253}$)([a-z0-9-]+\.)+[a-z]{2,}$/.test(host)) {
  console.error(`SITE_HOST must be a bare hostname, got "${host}"`);
  process.exit(2);
}

// wrangler.jsonc allows // comments and trailing commas; nothing else is non-JSON.
const strip = (text) =>
  text
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n')
    .replace(/,(\s*[}\]])/g, '$1');

const base = JSON.parse(strip(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8')));
const config = host ? { ...base, routes: [{ pattern: host, custom_domain: true }] } : base;
const out = new URL('../wrangler.deploy.jsonc', import.meta.url);
writeFileSync(out, `${JSON.stringify(config, null, 2)}\n`);
console.error(
  host ? `deploying ${config.name} to ${host}` : `deploying ${config.name} with no custom domain (SITE_HOST unset)`,
);

const env = { ...process.env };
const tokenFile = (env.CLOUDFLARE_API_TOKEN_FILE ?? '').trim().replace(/^~(?=\/|$)/, homedir());
if (!env.CLOUDFLARE_API_TOKEN && tokenFile) {
  try {
    env.CLOUDFLARE_API_TOKEN = readFileSync(tokenFile, 'utf8').trim();
  } catch {
    console.error(`cannot read CLOUDFLARE_API_TOKEN_FILE (${tokenFile})`);
    process.exit(2);
  }
}

const run = spawnSync('pnpm', ['dlx', 'wrangler@4', 'deploy', '--config', out.pathname, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
  cwd: new URL('..', import.meta.url).pathname,
});
process.exit(run.status ?? 1);

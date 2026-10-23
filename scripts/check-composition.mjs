/**
 * Read the desktop profile exactly the way the app does — `loadProfileDirectory`
 * from `@deepseek-ai/dsh-app-boot` — without mounting a single plugin.
 *
 * It answers three packaging questions at once:
 *   • was the bundle skipped (missing manifest, bad patch file, incompatible range)?
 *   • is `dsh-balance-badge` part of the composed bundle list?
 *   • which patch rows does it contribute, and from which resolved directory?
 *
 * Run:
 *   node scripts/check-composition.mjs [appPackageJson] [profileDir]
 *
 * Without arguments it falls back to `DSH_APP_PACKAGE` / `DSH_PROFILE_DIR`, then
 * to the default Desktop Beta install and profile paths.
 */
import { pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'

const DEFAULT_APP_PACKAGE = 'D:/dsh/DSH Desktop Beta/resources/app/package.json'

/** Pick the first profile directory that exists, so the same command works on any machine. */
function defaultProfileDir() {
  const candidates = [
    process.env.DSH_PROFILE_DIR,
    path.join(homedir(), '.dsh-beta', 'profiles', 'desktop'),
    path.join(homedir(), '.dsh', 'profiles', 'desktop')
  ].filter((candidate) => typeof candidate === 'string' && candidate !== '')
  const found = candidates.find((candidate) => existsSync(path.join(candidate, 'package.json')))
  if (found === undefined) {
    throw new Error(
      'no dsh profile found. Pass it as the second argument or set DSH_PROFILE_DIR:\n' +
        candidates.map((candidate) => `  - ${candidate}`).join('\n')
    )
  }
  return found
}

const appPackage = process.argv[2] ?? process.env.DSH_APP_PACKAGE ?? DEFAULT_APP_PACKAGE
const profileDir = process.argv[3] ?? defaultProfileDir()
const appRoot = appPackage.replace(/[\\/]package\.json$/i, '')

const appBoot = await import(pathToFileURL(`${appRoot}/node_modules/@deepseek-ai/dsh-app-boot/lib/index.js`).href)
const profile = appBoot.loadProfileDirectory('dsh-plugin-desktop', profileDir, appPackage)

console.log('skipped bundles:', profile.skippedBundles.length === 0 ? 'none' : JSON.stringify(profile.skippedBundles))
console.log('bundles:', profile.layers.map((layer) => layer.packageName).join(', '))

const ours = profile.layers.find((layer) => layer.packageName === 'dsh-balance-badge')
if (ours === undefined) {
  console.error('FAIL: dsh-balance-badge is not part of the composed bundle list')
  process.exit(1)
}
console.log('package dir:', ours.packageDir)
console.log('patch file:', ours.patchPaths.join(', '))
console.log('patch rows:', JSON.stringify(ours.patches))
console.log('OK: bundle layer loads without being skipped')

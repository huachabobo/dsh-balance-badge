/**
 * Offline check for the Host half: the "充值" opener route.
 *
 * It mounts `index.js` against a fake Cordis context, then drives the registered
 * handler with fake requests. Only rejection paths are exercised — a valid call
 * would really hand the URL to the system browser.
 *
 * Run:  node scripts/check-host-route.mjs
 */
import { pathToFileURL } from 'node:url'
import { fileURLToPath } from 'node:url'

const pluginPath = fileURLToPath(new URL('../index.js', import.meta.url))
const plugin = await import(pathToFileURL(pluginPath).href)

const failures = []
const routes = []
const effects = []
const logs = []

const sub = {
  webServer: {
    register(route) {
      routes.push(route)
      return () => {}
    }
  },
  effect(factory, label) {
    const dispose = factory()
    effects.push({ label, dispose })
    return () => {}
  }
}

plugin.apply({
  logger: (name) => ({
    info: (message, ...rest) => logs.push(`info ${name} ${message} ${rest.join(' ')}`),
    warn: (message, ...rest) => logs.push(`warn ${name} ${message} ${rest.join(' ')}`)
  }),
  inject(dependencies, callback) {
    if (!Array.isArray(dependencies) || !dependencies.includes('webServer')) failures.push('apply did not inject webServer')
    return callback(sub)
  }
})

if (plugin.name !== 'dsh-balance-badge') failures.push(`unexpected plugin name: ${plugin.name}`)
if (plugin.inject.length !== 0) failures.push('Host half should mount without required services')
if (routes.length !== 1) failures.push(`expected one route registration, saw ${routes.length}`)

const route = routes[0]
if (route === undefined) {
  console.error('FAIL')
  for (const failure of failures) console.error(' - ' + failure)
  process.exit(1)
}
if (route.kind !== 'prefix' || route.path !== '/dsh-balance-badge/open') {
  failures.push(`unexpected route: ${route.kind} ${route.path}`)
}
if (!effects.some((entry) => String(entry.label).includes('opener'))) failures.push('route registration is not effect-scoped')
if (!logs.some((line) => line.includes('badge mounted'))) failures.push('mount line missing from the Host log')

/** Minimal Node-like response the handler mutates. */
function fakeResponse() {
  const state = { status: 0, headers: {}, body: '' }
  return {
    state,
    writeHead(status, headers) {
      state.status = status
      state.headers = headers ?? {}
    },
    end(body) {
      state.body = String(body ?? '')
    }
  }
}

const cases = [
  { name: 'cross-site', url: '/dsh-balance-badge/open?url=https%3A%2F%2Fexample.com', headers: { 'sec-fetch-site': 'cross-site' }, status: 403 },
  { name: 'missing url', url: '/dsh-balance-badge/open', headers: {}, status: 400 },
  { name: 'javascript scheme', url: '/dsh-balance-badge/open?url=javascript%3Aalert(1)', headers: {}, status: 400 },
  { name: 'plain http off loopback', url: '/dsh-balance-badge/open?url=http%3A%2F%2Fevil.example', headers: {}, status: 400 },
  { name: 'credentials in url', url: '/dsh-balance-badge/open?url=https%3A%2F%2Fu%3Ap%40example.com', headers: {}, status: 400 },
  { name: 'over-long url', url: '/dsh-balance-badge/open?url=' + encodeURIComponent('https://example.com/' + 'a'.repeat(2100)), headers: {}, status: 400 }
]

for (const testCase of cases) {
  const response = fakeResponse()
  await route.handler({ url: testCase.url, headers: testCase.headers }, response)
  if (response.state.status !== testCase.status) {
    failures.push(`${testCase.name}: expected ${testCase.status}, saw ${response.state.status} ${response.state.body}`)
  }
  if (response.state.status >= 400 && response.state.headers['cache-control'] !== 'no-store') {
    failures.push(`${testCase.name}: rejection is cacheable`)
  }
}

if (failures.length > 0) {
  console.error('FAIL')
  for (const failure of failures) console.error(' - ' + failure)
  process.exit(1)
}
console.log(`PASS: route ${route.path} registered; ${cases.length} rejection paths behave`)
process.exit(0)

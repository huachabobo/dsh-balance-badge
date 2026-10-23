/**
 * Host half of `dsh-balance-badge`.
 *
 * Two jobs:
 *  1. Be a mountable Loader entry, so the client module registry publishes
 *     `/plugins/dsh-balance-badge/client.js` for the browser half.
 *  2. Own the "充值" hop into the system browser. A renderer has no Electron
 *     shell API here, and `window.open` stays inside the app, so the badge asks
 *     this Host route instead: it validates the target and hands it to the
 *     operating system's default browser.
 */
import { spawn } from 'node:child_process'

/** Loader identity; must match the `name` used by the bundle patch. */
export const name = 'dsh-balance-badge'

/** No Host services are required to mount; the web route joins when present. */
export const inject = []

/** Route the badge calls to hand a Platform page to the system browser. */
const OPEN_ROUTE = '/dsh-balance-badge/open'

/** Longest URL this route will forward. */
const MAX_URL_LENGTH = 2048

/** Hostnames accepted for plain-HTTP targets (HTTPS is accepted everywhere). */
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1'])

/**
 * Accept only credential-free HTTPS, or loopback HTTP for local development.
 * @param value - untrusted `url` query parameter.
 * @returns the normalized URL, or null when it may not be opened.
 */
function parseTarget(value) {
  if (typeof value !== 'string' || value === '' || value.length > MAX_URL_LENGTH) return null
  let url
  try {
    url = new URL(value)
  } catch {
    return null
  }
  if (url.username !== '' || url.password !== '') return null
  if (url.protocol === 'https:') return url.href
  if (url.protocol === 'http:' && LOOPBACK_HOSTS.has(url.hostname)) return url.href
  return null
}

/** Whether a request may reach the opener: same-origin browser calls only. */
function isSameOriginCall(request) {
  const site = request.headers['sec-fetch-site']
  if (typeof site !== 'string') return true
  return site === 'same-origin' || site === 'none'
}

/**
 * Hand one URL to the desktop's default browser without a shell string.
 * @param url - validated https (or loopback http) URL.
 * @returns whether the launcher process was started.
 */
function spawnOpener(url) {
  const platform = process.platform
  const command = platform === 'win32' ? 'rundll32.exe' : platform === 'darwin' ? 'open' : 'xdg-open'
  const args = platform === 'win32' ? ['url.dll,FileProtocolHandler', url] : [url]
  try {
    const child = spawn(command, args, { detached: true, stdio: 'ignore', windowsHide: true })
    child.on('error', () => {})
    child.unref()
    return true
  } catch {
    return false
  }
}

/**
 * Announce the mounted badge and serve the browser hop.
 * @param ctx - Host plugin context.
 */
export function apply(ctx) {
  const logger = ctx.logger('dsh-balance-badge')
  logger.info('badge mounted; client bundle served from ./client')
  ctx.inject(['webServer'], (sub) => {
    const handler = async (request, response) => {
      if (!isSameOriginCall(request)) {
        response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
        response.end('cross-site opener calls are not allowed')
        return
      }
      let target = null
      try {
        target = parseTarget(new URL(request.url ?? '/', 'http://dsh.invalid').searchParams.get('url'))
      } catch {
        target = null
      }
      if (target === null) {
        response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
        response.end('invalid url')
        return
      }
      const started = spawnOpener(target)
      if (!started) logger.warn('could not start the system browser for %s', target)
      response.writeHead(started ? 204 : 500, { 'cache-control': 'no-store' })
      response.end()
    }
    sub.effect(
      () => sub.webServer.register({ kind: 'prefix', path: OPEN_ROUTE, handler }),
      'balance badge: system-browser opener route'
    )
  })
}

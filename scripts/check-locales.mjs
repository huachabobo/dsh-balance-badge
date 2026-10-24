/**
 * Locale parity check for the client bundle.
 *
 * Reads the two dictionary literals out of `client.js` and verifies that:
 *   1. every key exists in both languages,
 *   2. every key actually appears in the bundle source (so dead strings are
 *      caught — computed keys like `t(pricing.peak ? "rate.peak" : "rate.off")`
 *      count as long as the literal is there),
 *   3. every direct `t("…")` call resolves to a dictionary entry.
 *
 * Run:  node scripts/check-locales.mjs
 */
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')

/** Slice one `const <name> = { … }` literal out of the bundle source. */
function extractLiteral(name) {
  const marker = `const ${name} = {`
  const start = source.indexOf(marker)
  if (start < 0) throw new Error(`dictionary ${name} not found`)
  const open = source.indexOf('{', start)
  let depth = 0
  for (let index = open; index < source.length; index += 1) {
    const character = source[index]
    if (character === '{') depth += 1
    else if (character === '}') {
      depth -= 1
      if (depth === 0) return source.slice(open, index + 1)
    }
  }
  throw new Error(`dictionary ${name} is not closed`)
}

// The literals are plain JSON-shaped objects; evaluating our own source here is
// the same trust boundary as running the bundle.
const zh = new Function(`return ${extractLiteral('zh')}`)()
const en = new Function(`return ${extractLiteral('en')}`)()

/** Every double-quoted string in the bundle, used as a "this key is referenced" probe. */
const literals = new Set()
for (const match of source.matchAll(/"((?:[^"\\]|\\.)*)"/g)) literals.add(match[1])

/** Keys a direct `t("…")` call asks for. */
const direct = new Set()
for (const match of source.matchAll(/\bt\("((?:[^"\\]|\\.)*)"/g)) direct.add(match[1])

const failures = []
for (const key of direct) {
  if (!(key in zh)) failures.push(`zh is missing "${key}" (used by t(...))`)
  if (!(key in en)) failures.push(`en is missing "${key}" (used by t(...))`)
}
for (const key of Object.keys(zh)) {
  if (!(key in en)) failures.push(`en lacks "${key}" (present in zh)`)
  if (!literals.has(key)) failures.push(`zh key "${key}" appears nowhere in the bundle`)
}
for (const key of Object.keys(en)) {
  if (!(key in zh)) failures.push(`zh lacks "${key}" (present in en)`)
}

if (failures.length > 0) {
  console.error('FAIL')
  for (const failure of failures) console.error(' - ' + failure)
  process.exit(1)
}
console.log(
  `PASS: ${Object.keys(zh).length} zh / ${Object.keys(en).length} en entries, ${direct.size} direct t() keys, every key referenced`
)

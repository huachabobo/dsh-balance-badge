/**
 * Locale parity check for the client bundle.
 *
 * Reads the two dictionary literals out of `client.js`, collects every
 * translation key the code actually asks for (direct `t("…")` calls plus the
 * range-table keys), and reports keys that are missing in either language or
 * present in only one of them.
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

const used = new Set()
for (const match of source.matchAll(/\bt\("([^"]+)"/g)) used.add(match[1])
for (const match of source.matchAll(/key: "(panel\.[^"]+)"/g)) used.add(match[1])

const failures = []
for (const key of [...used].sort()) {
  if (!(key in zh)) failures.push(`zh is missing "${key}"`)
  if (!(key in en)) failures.push(`en is missing "${key}"`)
}
for (const key of Object.keys(zh)) {
  if (!(key in en)) failures.push(`en lacks "${key}" (present in zh)`)
  if (!used.has(key)) failures.push(`zh key "${key}" is never requested`)
}
for (const key of Object.keys(en)) {
  if (!(key in zh)) failures.push(`zh lacks "${key}" (present in en)`)
}

if (failures.length > 0) {
  console.error('FAIL')
  for (const failure of failures) console.error(' - ' + failure)
  process.exit(1)
}
console.log(`PASS: ${used.size} keys used, ${Object.keys(zh).length} zh / ${Object.keys(en).length} en entries, no gaps`)

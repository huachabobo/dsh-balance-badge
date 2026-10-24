/**
 * Offline smoke test for the dsh-balance-badge browser bundle.
 *
 * The bundle is a `window.__ModuleLoader__` factory, so this harness fakes the
 * module system, the shared platform modules (react-dom portal, ui-primitives
 * surface/hooks), the cordis slot/locale services, Browser storage, and the
 * account remotes — then renders the registered components with
 * react-dom/server. It proves the bundle parses, registers both slots, renders
 * every balance phase, and draws the history panel from stored samples.
 *
 * Run:  node scripts/smoke-test.mjs      (SHOW=<scenario> prints that markup)
 *       DSH_PROFILE_DIR=<profile dir>    when react/react-dom are not in the default profile
 */
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'
import path from 'node:path'

/**
 * A matching react + react-dom pair (the page itself gets both from the shell).
 * Resolved from this package's own node_modules (CI installs them), then from a
 * dsh profile, which is where an installed Harness keeps them.
 */
function resolveRuntime() {
  const candidates = [path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'package.json')]
  if (process.env.DSH_PROFILE_DIR !== undefined && process.env.DSH_PROFILE_DIR !== '') {
    candidates.push(path.join(process.env.DSH_PROFILE_DIR, 'package.json'))
  }
  candidates.push(path.join(homedir(), '.dsh-beta', 'profiles', 'desktop', 'package.json'))
  candidates.push(path.join(homedir(), '.dsh', 'profiles', 'desktop', 'package.json'))
  for (const candidate of candidates) {
    try {
      const candidateRequire = createRequire(candidate)
      candidateRequire.resolve('react')
      candidateRequire.resolve('react-dom/server')
      return candidateRequire
    } catch (_error) {
      /* try the next profile */
    }
  }
  throw new Error(
    'react/react-dom not found. Point DSH_PROFILE_DIR at a dsh profile that has them installed:\n' +
      candidates.map((candidate) => `  - ${candidate}`).join('\n')
  )
}

const requireRuntime = resolveRuntime()
const React = requireRuntime('react')
const { renderToStaticMarkup } = requireRuntime('react-dom/server')

const zh = {
  label: '余额',
  loading: '同步中',
  signedOut: '未登录',
  failed: '读取失败',
  empty: '无钱包',
  bonus: '＋赠金 {amount}',
  'tooltip.title': 'DeepSeek 账号余额',
  'tooltip.recharge': '充值余额',
  'tooltip.bonus': '赠金余额',
  'tooltip.session': '本会话消耗',
  'tooltip.updated': '更新时间',
  'tooltip.error': '上次刷新失败',
  'tooltip.hint': '点击查看余额变化',
  'tooltip.signedOut': '没有可用的账号登录状态，请到 设置 → 账号 完成登录',
  aria: 'DeepSeek 账号余额：{value}，点击查看余额变化',
  'panel.aria': '余额变化',
  'panel.title': '余额变化',
  'panel.total': '合计',
  'panel.recharge': '充值',
  'panel.bonus': '赠金',
  'panel.rangeLabel': '时间范围',
  'panel.range.1h': '1时',
  'panel.range.6h': '6时',
  'panel.range.24h': '24时',
  'panel.range.3d': '3天',
  'panel.spent': '区间消耗',
  'panel.gained': '区间增加',
  'panel.maxDrop': '最大单次',
  'panel.high': '最高',
  'panel.low': '最低',
  'panel.samples': '{count} 个采样点',
  'panel.updated': '最近更新 {time}',
  'panel.refresh': '立即刷新',
  'panel.refreshing': '刷新中',
  'panel.clear': '清空记录',
  'panel.topUp': '充值',
  'panel.sessionSpend': '本会话消耗',
  'panel.sessionTurns': '{count} 轮',
  'panel.topUpBlocked': '无法打开充值页，请到 设置 → 账号 打开',
  'panel.empty': '还没有采样点',
  'panel.emptyRange': '该时间范围没有采样点',
  'panel.emptyHint': '插件会在后台轮询余额。点「立即刷新」或等下一次自动刷新，这里就会开始记录曲线。',
  'panel.needMore': '再记录 1 个采样点就能画曲线',
  'panel.chartAria': '余额变化曲线：{from} 至 {to}',
  'panel.close': '关闭',
  'panel.cleared': '已清空记录',
  'rate.peak': '峰',
  'rate.off': '谷',
  'rate.tooltip': '当前 {model} 输出价 {price}/百万 tokens（{mode}时段）',
  'duration.d': '{days} 天 {hours} 小时',
  'duration.hm': '{hours} 小时 {minutes} 分',
  'duration.m': '{minutes} 分钟',
  'panel.price.title': '模型价格',
  'panel.price.peak': '高峰',
  'panel.price.off': '空闲',
  'panel.price.until': '距调价 {duration}',
  'panel.price.cacheHit': '输入·命中',
  'panel.price.cacheMiss': '输入·未命中',
  'panel.price.output': '输出',
  'panel.price.unit': '元 / 百万 tokens',
  'panel.price.windows': '高峰＝北京时间 周一至周五 9:00–12:00、14:00–18:00；其余时段（含周末与法定节假日）空闲，空闲价 = 高峰价的一半。',
  'panel.price.other': '另一模型 {model}：高峰 {peak} · 空闲 {off}',
  'panel.price.source': '价格来源：DeepSeek 官方定价页（2026-10）'
}
const t = (key, params) =>
  (zh[key] ?? key).replace(/\{(\w+)\}/g, (match, name) => (params && name in params ? String(params[name]) : match))

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const storage = new Map()
const localStorageStub = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear()
}

/** Shared platform modules the bundle asks for, stubbed to their observable shape. */
const reactDomStub = {
  // The page portals into document.body; the test renders the panel inline.
  createPortal: (children) => children
}
const primitivesStub = {
  MenuSurface: React.forwardRef(function MenuSurfaceStub({ className, children, ...rest }, ref) {
    return React.createElement('div', { ...rest, ref, className }, children)
  }),
  useAnchoredPosition: () => ({ left: 24, top: 24 }),
  useDismissOnOutsidePointer: () => {},
  SegmentedControl: ({ id, value, options, onChange, label, className }) =>
    React.createElement(
      'div',
      { role: 'tablist', 'aria-label': label, className, 'data-value': value },
      options.map((option) =>
        React.createElement('button', { key: option.value, type: 'button', role: 'tab', 'aria-selected': option.value === value, id: `${id}-${option.value}`, onClick: () => onChange(option.value) }, option.label)
      )
    ),
  Button: ({ children, variant, size, ...rest }) => React.createElement('button', { type: 'button', 'data-variant': variant, 'data-size': size, ...rest }, children)
}

/** Load the bundle and hand back its exported client plugin. */
async function loadBundle() {
  let factory
  globalThis.window = {
    __ModuleLoader__: { load: ({ factory: fn }) => { factory = fn } },
    addEventListener() {},
    removeEventListener() {}
  }
  const injected = []
  globalThis.document = {
    visibilityState: 'visible',
    addEventListener() {},
    removeEventListener() {},
    querySelector: () => null,
    createElement: () => ({ dataset: {}, textContent: '' }),
    head: { appendChild: (tag) => injected.push(tag) }
  }
  globalThis.localStorage = localStorageStub
  // The page's window.open is the shell's new-window route; report success.
  globalThis.open = () => ({})
  await import(new URL('../client.js', import.meta.url).href)
  if (factory === undefined) throw new Error('bundle never called window.__ModuleLoader__.load')
  const moduleRequire = (name) => {
    if (name === 'react') return React
    if (name === 'react/jsx-runtime') return requireRuntime('react/jsx-runtime')
    if (name === 'react-dom') return reactDomStub
    if (name === '@deepseek-ai/dsh-client-ui-primitives') return primitivesStub
    throw new Error(`unexpected require("${name}")`)
  }
  return factory(moduleRequire)
}

/** Minimal client context: record slot registrations, dictionaries, disposers. */
function fakeContext(account) {
  const registrations = new Map()
  const dictionaries = new Map()
  const disposers = []
  const ctx = {
    effect(fn) {
      const dispose = fn()
      if (typeof dispose === 'function') disposers.push(dispose)
      return () => {}
    },
    locale: {
      register(ns, table) {
        dictionaries.set(ns, table)
        return () => dictionaries.delete(ns)
      },
      getSnapshot: () => ({ active: 'zh' }),
      bind: () => t
    },
    slots: {
      inject(key, callback) {
        disposers.push(() => {})
        return callback()
      },
      register(options, component) {
        registrations.set(options.name, { options, component })
        return () => registrations.delete(options.name)
      }
    },
    remote: {
      account: {
        getState: async () => account.state,
        getBalance: () => (account.balance === 'pending' ? new Promise(() => {}) : Promise.resolve(account.balance))
      }
    }
  }
  return { ctx, registrations, dictionaries, disposeAll: () => disposers.splice(0).forEach((fn) => fn()) }
}

const credentialStored = {
  ok: true,
  value: {
    status: 'credential-stored',
    links: { usageUrl: 'https://platform.deepseek.com/usage', topUpUrl: 'https://platform.deepseek.com/top_up' },
    attempt: null
  }
}
const readyBalance = {
  ok: true,
  value: {
    status: 'ready',
    value: [{ currency: 'CNY', balance: '110.00' }],
    bonusWallets: [{ currency: 'CNY', balance: '10.00' }]
  }
}

const scenarios = [
  {
    name: 'ready',
    account: { state: credentialStored, balance: readyBalance },
    expect: ['余额', '¥110.00', '＋赠金 ¥10.00', 'data-tone="normal"', 'dbb_rate', '/M'],
    panelExpect: ['余额变化', '充值', '合计', '立即刷新', '清空记录', '再记录 1 个采样点', 'data-variant="primary"', '>充值</button>', '本会话消耗', '¥0.00', '0 轮', 'data-price-block', '模型价格', '高峰', '空闲', '距调价', '输入·命中', '输入·未命中', '输出', '¥8', '¥4'],
    panelAbsent: ['panel.topUp']
  },
  {
    name: 'history',
    seed: 'history',
    account: { state: credentialStored, balance: readyBalance },
    expect: ['¥110.00'],
    panelExpect: ['余额变化', '区间消耗', '−¥3.50', 'data-dir="down"', '最大单次', '−¥2.40', '最高', '¥123.50', '5 个采样点', '<path', '<svg', '1时', '6时', '24时', '3天', '本会话消耗', '¥1.23', '3 轮', 'data-session-spend']
  },
  {
    name: 'topup',
    seed: 'topup',
    account: { state: credentialStored, balance: readyBalance },
    expect: ['¥110.00'],
    // The wallet grew by 119.50 across the window: report it as an increase.
    panelExpect: ['区间增加', '+¥119.50', 'data-dir="up"', 'data-variant="primary"', '>充值</button>']
  },
  {
    name: 'low balance',
    account: {
      state: credentialStored,
      balance: { ok: true, value: { status: 'ready', value: [{ currency: 'CNY', balance: '0.30' }], bonusWallets: [{ currency: 'CNY', balance: '0.00' }] } }
    },
    expect: ['¥0.30', 'data-tone="warn"'],
    // A zero bonus wallet must not produce "+ 赠金 ¥0.00" noise.
    absent: ['赠金'],
    panelExpect: ['充值', '¥0.30', '立即刷新'],
    panelAbsent: ['合计', '赠金']
  },
  {
    name: 'signed out',
    account: { state: { ok: true, value: { status: 'signed-out', links: { usageUrl: 'https://platform.deepseek.com/usage', topUpUrl: 'https://platform.deepseek.com/top_up' } } }, balance: { ok: true, value: null } },
    expect: ['未登录', 'data-tone="normal"', 'data-phase="signed-out"'],
    // No credential read: the panel must not offer a top-up action.
    panelAbsent: ['data-variant="primary"', '>充值</button>']
  },
  {
    name: 'failure',
    seed: 'stale',
    account: {
      state: credentialStored,
      balance: { ok: false, error: { code: 'account/network', message: 'network unreachable' } }
    },
    expect: ['读取失败', 'data-tone="error"', 'data-phase="error"'],
    // History exists but falls outside the selected window.
    panelExpect: ['该时间范围没有采样点']
  },
  {
    name: 'refreshing',
    // A read that never settles keeps the store in its loading/refreshing state.
    account: { state: credentialStored, balance: 'pending' },
    expect: ['同步中', 'data-phase="loading"'],
    panelExpect: ['刷新中'],
    panelAbsent: ['data-variant="primary"']
  }
]

/** Seed a series that ends 20 minutes ago so the delayed poll appends one more point. */
function seedHistory() {
  const now = Date.now()
  const points = [
    [now - 50 * 60000, 123.5],
    [now - 40 * 60000, 123.5],
    [now - 30 * 60000, 122.4],
    [now - 20 * 60000, 120.0]
  ]
  storage.set('dsh-balance-badge:samples:v1', JSON.stringify({ version: 1, currency: 'CNY', points }))
  storage.set(
    'dsh-balance-badge:sessions:v1',
    JSON.stringify({ version: 1, entries: { 's-1': { spent: 1.23, turns: 3, updatedAt: now, currency: 'CNY' } } })
  )
}

/** One sample far outside every selectable window. */
function seedStale() {
  const now = Date.now()
  storage.set(
    'dsh-balance-badge:samples:v1',
    JSON.stringify({ version: 1, currency: 'CNY', points: [[now - 10 * 86400000, 3]] })
  )
}

/** Near-empty wallet topped up to the live read: the window's net change is positive. */
function seedTopUp() {
  const now = Date.now()
  const points = [
    [now - 40 * 60000, 0.5],
    [now - 20 * 60000, 0.5]
  ]
  storage.set('dsh-balance-badge:samples:v1', JSON.stringify({ version: 1, currency: 'CNY', points }))
}

const SLOTS = ['conversation.composer.dock', 'conversation.hero.options']
const failures = []
const bundle = await loadBundle()

if (bundle.name !== 'dsh-balance-badge') failures.push(`unexpected plugin name: ${bundle.name}`)
if (!Array.isArray(bundle.inject) || !bundle.inject.includes('slots')) failures.push('plugin does not inject slots')
if (typeof bundle.apply !== 'function') failures.push('plugin has no apply()')

// Peak/off-peak billing math, driven by fixed Beijing timestamps.
const pricing = bundle.__test
if (pricing === undefined) failures.push('plugin exposes no pricing test hook')
else {
  const beijing = (month, day, hour, minute) => Date.UTC(2026, month - 1, day, hour - 8, minute)
  const cases = [
    ['Mon 10:00 peak', beijing(10, 26, 10, 0), true],
    ['Mon 11:59 peak', beijing(10, 26, 11, 59), true],
    ['Mon 12:00 off', beijing(10, 26, 12, 0), false],
    ['Mon 13:59 off', beijing(10, 26, 13, 59), false],
    ['Mon 14:00 peak', beijing(10, 26, 14, 0), true],
    ['Mon 17:59 peak', beijing(10, 26, 17, 59), true],
    ['Mon 18:00 off', beijing(10, 26, 18, 0), false],
    ['Sun 10:00 off', beijing(10, 25, 10, 0), false],
    ['Sat 15:00 off', beijing(10, 24, 15, 0), false]
  ]
  for (const [label, at, expected] of cases) {
    const actual = pricing.isPeakAt(at)
    if (actual !== expected) failures.push(`pricing: ${label} should be ${expected ? 'peak' : 'off-peak'}`)
  }
  const flipsToNoon = pricing.nextChangeAt(beijing(10, 26, 11, 0))
  if (flipsToNoon !== beijing(10, 26, 12, 0)) failures.push('pricing: 11:00 should flip at 12:00')
  const flipsToLunchEnd = pricing.nextChangeAt(beijing(10, 26, 13, 0))
  if (flipsToLunchEnd !== beijing(10, 26, 14, 0)) failures.push('pricing: 13:00 should flip at 14:00')
  const fridayEvening = pricing.nextChangeAt(beijing(10, 23, 18, 30))
  if (fridayEvening !== beijing(10, 26, 9, 0)) failures.push('pricing: Friday evening should flip at Monday 09:00')
  if (pricing.rateText(0.02) !== '¥0.02' || pricing.rateText(4.5) !== '¥4.5') failures.push('pricing: rate formatting is off')
}

for (const scenario of scenarios) {
  storage.clear()
  if (scenario.seed === 'history') seedHistory()
  if (scenario.seed === 'topup') seedTopUp()
  if (scenario.seed === 'stale') seedStale()

  const harness = fakeContext(scenario.account)
  bundle.apply(harness.ctx)
  for (const slot of SLOTS) {
    if (!harness.registrations.has(slot)) failures.push(`${scenario.name}: missing registration for ${slot}`)
  }
  const dict = harness.dictionaries.get('dsh-balance-badge')
  if (dict === undefined || dict.zh === undefined || dict.en === undefined) {
    failures.push(`${scenario.name}: dictionaries are not registered`)
  }

  // Let the delayed first read land before rendering.
  await sleep(1800)
  for (const slot of SLOTS) {
    const entry = harness.registrations.get(slot)
    if (entry === undefined) continue
    const closed = renderToStaticMarkup(
      React.createElement(entry.component, { t, sessionId: 's-1', useSession: (selector) => selector({ running: false }) })
    )
    for (const needle of scenario.expect) {
      if (!closed.includes(needle)) failures.push(`${scenario.name} @ ${slot}: chip lacks ${needle} -> ${closed.slice(0, 320)}`)
    }
    for (const needle of scenario.absent ?? []) {
      if (closed.includes(needle)) failures.push(`${scenario.name} @ ${slot}: chip shows unwanted ${needle} -> ${closed.slice(0, 320)}`)
    }
    if (!closed.includes('data-balance-badge')) failures.push(`${scenario.name} @ ${slot}: badge marker missing`)
    if (!closed.includes('aria-haspopup="dialog"')) failures.push(`${scenario.name} @ ${slot}: trigger does not advertise the panel`)
    if (process.env.SHOW === scenario.name) console.log(closed + '\n')
  }

  if (scenario.panelExpect !== undefined) {
    const entry = harness.registrations.get(SLOTS[0])
    const opened = renderToStaticMarkup(
      React.createElement(entry.component, { t, sessionId: 's-1', defaultOpen: true, useSession: (selector) => selector({ running: false }) })
    )
    for (const needle of scenario.panelExpect) {
      if (!opened.includes(needle)) failures.push(`${scenario.name}: panel lacks ${needle} -> ${opened.slice(0, 700)}`)
    }
    for (const needle of scenario.panelAbsent ?? []) {
      if (opened.includes(needle)) failures.push(`${scenario.name}: panel shows unwanted ${needle} -> ${opened.slice(0, 700)}`)
    }
    if (!opened.includes('data-balance-panel')) failures.push(`${scenario.name}: panel marker missing`)
    if (!opened.includes('role="dialog"')) failures.push(`${scenario.name}: panel is not a dialog`)
    if (process.env.SHOW === `${scenario.name}-panel`) console.log(opened + '\n')
  }
  harness.disposeAll()
}

if (failures.length > 0) {
  console.error('FAIL')
  for (const failure of failures) console.error(' - ' + failure)
  process.exit(1)
}
console.log(`PASS: ${scenarios.length} scenarios; chip and history panel rendered as expected`)
process.exit(0)

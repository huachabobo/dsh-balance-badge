# dsh-balance-badge

把 **DeepSeek 账号余额** 直接放在对话输入框正下方，不用每次打开 `设置 → 账号` 才能看一眼。

## 效果

- 聊天页：余额胶囊挂在 Composer 卡片正下方的那一行（`conversation.composer.dock`），与上下文用量指示器同一排。
- 首屏：新建会话的 Hero 页把同一枚胶囊放在工作区行右侧（`conversation.hero.options`）。
- 命中余额时显示 `余额 ¥110.00`；赠金大于 0 时才追加 `＋赠金 ¥10.00`（平台常驻一个 0.00 的赠金钱包，不会显示成 `＋赠金 ¥0.00`）。
- 悬停显示明细：充值余额、赠金余额、本会话消耗、更新时间、最近一次失败原因。
- **点击胶囊弹出一枚小浮窗**（向上展开，292px，和「任务列表」等按钮同一种菜单材质/portal/点击外部关闭的行为），画出余额随时间的消耗曲线；面板会记住你上次选的时间范围。
- 轮次结束后（模型刚花完钱）自动补读一次。
- 后台每 60 秒静默刷新一次，只读**可见**页面；切回窗口或恢复标签页时若数据超过 20 秒会补读。
- 状态语义：`同步中` / `未登录` / `读取失败`，余额低于 1 时变成琥珀色警示。

## 浮窗里有什么

```
余额变化                      −¥3.50
充值 ¥110.00   赠金 ¥10.00   合计 ¥120.00
本会话消耗 ¥1.23 · 3 轮
[ 1时 ][ 6时 ][24时 ][ 3天 ]
 ╭─────╮
 │  ╲__│  ← 折线 + 面积，琥珀色圆点标出区间内最大的一次下跌
 ╰─────╯
10:27                        11:17
区间消耗 −¥3.50   最大单次 −¥2.40
最高 ¥123.50      最低 ¥120.00
────────────────────────────────
最近更新 11:17:33 · 5 个采样点   [充值][立即刷新][清空记录]
```

- 头部的 `−¥3.50` 是所选区间的净变化：`−` 表示花掉了，`+` 表示余额变多（充值到账），统计行会对应写成「区间消耗」或「区间增加」。
- **「充值」走系统浏览器**：Host 半侧注册了一个本地路由 `/dsh-balance-badge/open?url=…`，点按钮时客户端 `fetch` 它，Host 校验 URL 后用 `rundll32 url.dll,FileProtocolHandler`（Windows）/ `open`（macOS）/ `xdg-open`（Linux）把它交给默认浏览器。这样可以绕开「侧边栏内置浏览器打开平台页是空白」和「`window.open` 只会在 DSH 里再开一个窗口」这两条路，也不会经过 cmd/shell 拼串。路由只接受无凭据的 https（开发用的 loopback http 除外），并拒绝跨站请求（`Sec-Fetch-Site: cross-site` → 403）。取不到 Host 路由时（纯网页）退回 `window.open`，再退回锚点导航；三条都不通则备注行提示到 `设置 → 账号` 打开。
- **「本会话消耗」**：一轮开始时记住当时的合计，轮次结束后强刷一次余额，把差额记到这个会话名下；换会话时每个会话显示自己累计的数字。见下一节。
- 「合计」只在赠金大于 0 时出现，避免 `充值 ¥2.46  合计 ¥2.46` 这种重复。
- 统计按 2 列排布；蓝点是最近一次采样，琥珀色小圆点标出区间内最大的一次单次消耗（若最大消耗正好发生在最后一个采样点，就不再重复画点，只保留统计数字）。
- 区间切换用共享的 `SegmentedControl`：只覆盖三样东西 —— `box-sizing:border-box`（它的 `.control` 没有设，`width:100%` 会把 4px 内边距加到 100% 之外，右侧被面板裁掉一条）、`width:100%`、`grid-auto-columns:minmax(0,1fr)`（`1fr` 默认有 min-content 下限，标签一挤就顶出去）。**不要**覆盖它的 `display` —— 白色滑块是按「控件宽度 ÷ 段数」算的，改成 flex 会让滑块和标签错位。
- 浮窗内容区是 `overflow-x: hidden; overflow-y: auto`，不会再出现底部那条横向滑条。
- 关闭：点浮窗外部、再点一次胶囊、或按 `Esc`。
- 曲线右端点是最近一次采样；采样点不够时给对应提示 —— 还没有任何数据是「还没有采样点」，只有 1 个点是「再记录 1 个采样点就能画曲线」，数据都在所选范围之外是「该时间范围没有采样点」。
- 正在刷新时底部备注会追加「刷新中」，刷新按钮同时置灰。

## 本会话消耗怎么算的

Platform 不给「某个会话花了多少钱」，只能用余额落差归因：

| 时刻 | 动作 |
| --- | --- |
| 一轮开始（`session.running` 变 true） | 先用现有快照记一个基线，同时强制读一次余额；新数据回来后（若这一轮还在跑）把基线换成新鲜值，避免拿十几秒前的旧余额当起点 |
| 一轮结束（变回 false） | 先等掉所有在途读数，再强制读一次；`基线 − 新余额 > 0.0001` 就累加到该 `sessionId`，轮数 +1 |
| 换会话 | 读各自记录，互不影响 |
| 存储 | `localStorage["dsh-balance-badge:sessions:v1"]`，最多保留 200 个会话（按最近更新丢弃） |

它是估算，不是账单：同一时刻若有别的窗口也在消耗，差额会被算进当前会话；刷新失败的那一轮不计。要看精确数字仍以 `设置 → 账号` 的平台账单为准。想清掉就点「清空记录」（同时清空曲线）。

## 曲线数据从哪来

Platform 没有余额历史接口，所以**采样由插件自己完成**：

| 规则 | 值 |
| --- | --- |
| 采样时机 | 每次成功读到余额（含 60 秒轮询、轮次结束、打开浮窗、点「立即刷新」） |
| 记点条件 | 金额变化 ≥ 0.0001，或距上一个点已超过 10 分钟（心跳，保证时间轴不歪） |
| 采样值 | 选中币种下「充值 + 赠金」的合计，也就是真正会被扣掉的总额 |
| 保留 | 3 天，最多 900 点（超出丢最旧的） |
| 存储 | `localStorage["dsh-balance-badge:samples:v1"]`，写失败自动退回内存态 |
| 币种切换 | 检测到币种变化时清空重来（避免把 ¥ 和 $ 画进同一条线） |

因为按「变化 + 心跳」记点，曲线点数远少于轮询次数：一天正常使用大约几十到一百多个点。刚装上时曲线是空的，用几轮对话后就会长出来。同一浏览器里换账号会共用同一份历史（客户端拿不到账号 ID）；不想要就点「清空记录」。


## 数据来源

只走 Host 已有的账号 Remote，不额外存储凭据，也不解析响应头：

| 调用 | 用途 |
| --- | --- |
| `remote.account.getState()` | 判断是否有可用的账号登录（`credential-stored`），并取 `links.topUpUrl` / `links.usageUrl` |
| `remote.account.getBalance(client)` | 读充值钱包与赠金钱包（`CNY` / `USD` 十进制字符串） |

`client` 元数据（版本、界面语言、时区偏移）在每次调用时现读，与设置页一致；因此切换界面语言后下一次刷新即生效。

## 安装

```powershell
# 1) 克隆到 profile 的插件目录
git clone https://github.com/huachabobo/dsh-balance-badge `
  "$env:USERPROFILE\.dsh-beta\plugins\dsh-balance-badge"

# 2) 让 profile 声明依赖与组合包
#    ~/.dsh-beta/profiles/desktop/package.json:
#      dependencies:        "dsh-balance-badge": "link:../../plugins/dsh-balance-badge"
#      dsh.profile.bundles: "dsh-balance-badge"   ← 追加到数组末尾

# 3) 在 profile 目录安装（只解析本地目录，不访问 registry）
cd "$env:USERPROFILE\.dsh-beta\profiles\desktop"
pnpm install
```

`link:` 会把 `node_modules/dsh-balance-badge` 指回源目录（Windows 上是 junction），改完 `client.js` 不用重装；想固定一份副本就改用 `file:`。用 `~/.dsh` 而不是 `~/.dsh-beta` 时把路径换掉即可。

## 安装后如何生效

1. **保存 profile 配置**：启用 HMR 的 profile（随产品交付的 desktop / web 模板默认开启）会在 `package.json`、`cordis.patch.yml` 变化时重新组合，插件行即时挂载。
2. **重载客户端 bundle**：Host 在组合时**快照**每个 `client.js`；改过插件代码后，只刷新页面不一定拿得到新文件。
   - 有把握的一步：`侧边栏 →「插件」` 把 `dsh-balance-badge` 关再开（会重新组合并替换 bundle），然后刷新页面。
   - 或者直接重启 DSH。
3. 只想换文案/参数时，上面任意一种都行；`link:` 依赖让改动无需重装。

验证 Host 侧是否真的挂上了（不需要打开页面）：

```powershell
node scripts/check-composition.mjs        # 组合层：未被跳过 + insert 行存在 + 解析目录
npm run check                             # locales + 宿主路由 + 客户端渲染（离线）
```

Host 日志里出现下面这行就说明插件已挂载：

```
[dsh-balance-badge] badge mounted; client bundle served from ./client
```


## 卸载

```powershell
# 从 dsh.profile.bundles 与 dependencies 里删掉 dsh-balance-badge，然后
pnpm install
```

也可以只在 侧边栏 →「插件」/ `设置 → 插件` 里把 `dsh-balance-badge` 组合包停用：胶囊立即消失，依赖保留。

## 可调参数

集中在 `client.js` 顶部的 `constants` 区：

| 常量 | 默认 | 含义 |
| --- | --- | --- |
| `POLL_MS` | `60000` | 可见状态下的后台轮询间隔 |
| `FRESH_MS` | `20000` | 焦点/挂载时判定「数据还新鲜」的窗口 |
| `LOW_BALANCE` | `1` | 低于该总额时胶囊转为琥珀色 |
| `CLIENT_VERSION` | `0.2.1-rc.2` | 上报给 Platform 的客户端版本（跟随 DSH 版本） |
| `SAMPLES_KEY` | `dsh-balance-badge:samples:v1` | 曲线历史的 localStorage 键 |
| `HEARTBEAT_MS` | `600000`（10 分钟） | 数值没变也记一个点的时间间隔 |
| `RETENTION_MS` | `259200000`（3 天） | 采样保留时长 |
| `MAX_SAMPLES` | `900` | 采样点数上限 |
| `SESSIONS_KEY` | `dsh-balance-badge:sessions:v1` | 每会话消耗的 localStorage 键 |
| `MAX_SESSIONS` | `200` | 会话消耗记录上限 |
| `RANGE_KEY` | `dsh-balance-badge:range:v1` | 记住上次选的时间范围 |
| `CHART_W` / `CHART_H` | `268` / `84` | 曲线画布尺寸 |
| `CHART_INSET` | `4` | 折线左右留白，保证端点圆点不被 viewBox 裁掉 |

`index.js` 顶部另有 `OPEN_ROUTE`（`/dsh-balance-badge/open`）与 `MAX_URL_LENGTH`。

## 结构

```
package.json      # dsh.bundle.patch + dsh.client.platform=web
index.js          # 宿主侧：Loader 挂载点 + 把「充值」交给系统浏览器的本地路由
client.js         # 浏览器 bundle：window.__ModuleLoader__ 工厂，注册两个 slot + 浮窗
cordis.patch.yml  # 组合包补丁：insert 一行 dsh-balance-badge
scripts/smoke-test.mjs        # 客户端冒烟测试（假模块系统 + 假 ctx + 假 localStorage）
scripts/check-host-route.mjs  # 宿主路由测试（只跑拒绝路径，不会真的开浏览器）
scripts/check-composition.mjs # 用 app-boot 的组合读取器核对 profile 层
```

`client.js` 是手写的模块加载器 bundle，不经打包即可直接用。它只依赖外壳的静态模块表：

| 模块 | 用途 |
| --- | --- |
| `react` | 组件、`useSyncExternalStore` |
| `react-dom` | `createPortal`，把浮窗挂到 `document.body` |
| `@deepseek-ai/dsh-client-ui-primitives` | `MenuSurface`（菜单材质 + macOS 背景衬底）、`useAnchoredPosition`（锚点定位/视口夹取/滚动跟随）、`useDismissOnOutsidePointer`（点外部关闭）、`SegmentedControl`、`Button` |

这三项都在 `@deepseek-ai/dsh-web-frontend` 的静态模块表里，所以 `dsh.client.inject` 不需要额外声明。

## 自测

```powershell
npm run check                        # locales + 宿主路由 + 客户端渲染，全离线
node scripts/smoke-test.mjs          # SHOW=history-panel 可打印浮窗 HTML
node scripts/check-composition.mjs   # profile 组合层（要本机装好 DSH）
```

`smoke-test.mjs` 用假的模块系统 + 假 ctx + 假 localStorage + 假 primitives 跑 `apply()`，再用 `react-dom/server` 渲染七个场景：正常、带历史曲线（含会话消耗）的浮窗、充值曲线（区间增加）、低余额、未登录、读取失败（历史都在范围外）、一直刷新中。断言两个 slot 都注册、胶囊文案与 `data-tone` 正确、浮窗是 `role="dialog"`、画出 `<svg>` 路径与统计数字、本会话消耗行存在、空态文案分得清。它不连真实 Host。

`check-locales.mjs` 从 bundle 里抽出 `zh`/`en` 两个字面量，收集代码里所有 `t("…")` 与区间表的 key，双向比对（缺 key、多余 key、两种语言不一致）——现在是 45 个 key 全对齐。

`check-host-route.mjs` 用假 Cordis 上下文挂载 `index.js`，确认路由以 `prefix /dsh-balance-badge/open` 注册、effect 作用域正确，并驱动 6 条拒绝路径（跨站、缺参、`javascript:`、非回环 http、带凭据、超长）。有效地址会真的拉起浏览器，所以测试不碰。

`smoke-test.mjs` 找 React 的顺序：本包 `node_modules` → `$DSH_PROFILE_DIR` → `~/.dsh-beta/profiles/desktop` → `~/.dsh/profiles/desktop`；CI 就是先 `npm install react react-dom` 走第一条。`check-composition.mjs` 认 `DSH_APP_PACKAGE` / `DSH_PROFILE_DIR`，或命令行参数。

`.github/workflows/checks.yml` 在 push / PR 时跑前三个离线检查。

## 排错

- **胶囊没出现**：确认组合包里 `dsh-balance-badge` 是启用状态；确认 Host 日志有 `[dsh-balance-badge] badge mounted`；然后关/开一次组合包并刷新页面。
- **点了没有浮窗**：浮窗挂在 `document.body` 上、`z-index:100`；若被其它全屏遮罩盖住，先关掉那个遮罩。胶囊上应能看到 `aria-expanded="true"`。
- **「充值」按钮没出现**：只有读到 `credential-stored` 才会拿到 `links.topUpUrl`；未登录或读失败时不显示。
- **「充值」点了没反应**：先看浮窗左下角的提示。要是 Host 路由没生效（例如组合里没有 `webServer`），会退回 `window.open`；仍然没反应就直接去 `设置 → 账号`。
- **「本会话消耗」一直是 ¥0.00**：只统计「一轮开始 → 结束」的余额差；模型没跑过轮次、或那一轮刷新失败，都不会记账。
- **浮窗里一直是「还没有采样点」**：曲线只能由插件自己采样。确认页面处于可见状态（后台标签页不轮询），或点浮窗里的「立即刷新」。
- **曲线断了/只有直线**：长时间没开页面就没有采样，两点之间会画成直线，属预期。
- **浮窗说「该时间范围没有采样点」**：历史还在，只是不在当前档位里（比如最小档 1 时里没有最近一小时的记录）；换一档更大的范围即可。
- **一直显示「未登录」**：账号登录走 `设置 → 账号`。API Key 模式没有账号钱包，读到 `signed-out` 属预期。
- **一直显示「读取失败」**：悬停看具体错误码，多为网络不可达或登录态过期；重新登录或等待下一轮刷新。
- **数字不更新**：点胶囊打开浮窗并按「立即刷新」；`POLL_MS` 只在页面可见时生效。
- **想从零重画**：浮窗里点「清空记录」，或清掉 `localStorage["dsh-balance-badge:samples:v1"]` 与 `localStorage["dsh-balance-badge:sessions:v1"]`。

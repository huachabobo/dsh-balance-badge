window.__ModuleLoader__.load({
	id: "dsh-balance-badge",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const react = require("react");
		const { createPortal } = require("react-dom");
		const primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		const h = react.createElement;

		//#region styles
		const STYLE_TAG_ID = "dsh-balance-badge/BalanceBadge.module.css";
		const CSS = [
			'.dbb_root{display:inline-flex;align-items:center}',
			'.dbb_chip{box-sizing:border-box;display:inline-flex;align-items:center;gap:6px;min-width:0;max-width:100%;height:24px;margin:0;padding:0 9px;border:none;border-radius:999px;background:transparent;color:var(--dsw-alias-label-tertiary);font-family:inherit;font-size:12px;line-height:20px;font-weight:400;white-space:nowrap;cursor:pointer;transition:background-color .12s ease,color .12s ease;font-variant-numeric:tabular-nums}',
			'.dbb_chip:hover,.dbb_chip[aria-expanded="true"]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}',
			'.dbb_chip:active{background:var(--dsw-alias-interactive-bg-hover-solid)}',
			'.dbb_chip:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}',
			'.dbb_chip[data-tone="warn"]{color:var(--dsw-alias-state-warn-primary)}',
			'.dbb_chip[data-tone="error"]{color:var(--dsw-alias-state-error-primary)}',
			'.dbb_label{opacity:.85}',
			'.dbb_value{min-width:0;overflow:hidden;text-overflow:ellipsis;color:var(--dsw-alias-label-secondary);font-weight:500}',
			'.dbb_bonus{color:var(--dsw-alias-label-tertiary);font-weight:400}',
			'.dbb_rate{display:inline-flex;align-items:center;gap:3px;flex:none;height:18px;padding:0 6px;border-radius:999px;background:var(--dsw-alias-interactive-bg-hover);font-size:10px;line-height:18px;font-weight:500;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary)}',
			'.dbb_rate[data-mode="peak"]{color:var(--dsw-alias-state-warn-primary)}',
			'.dbb_rate[data-mode="off"]{color:var(--dsw-alias-state-success-primary)}',
			'.dbb_rateMode{font-weight:600}',
			'.dbb_price{margin-top:2px;padding-top:8px;border-top:.5px solid var(--dsw-alias-border-l1);display:flex;flex-direction:column;gap:5px;font-variant-numeric:tabular-nums}',
			'.dbb_priceHead{display:flex;align-items:baseline;justify-content:space-between;gap:8px}',
			'.dbb_priceTitle{color:var(--dsw-alias-label-tertiary);font-size:11px}',
			'.dbb_priceMode{font-size:11px;font-weight:600}',
			'.dbb_priceMode[data-mode="peak"]{color:var(--dsw-alias-state-warn-primary)}',
			'.dbb_priceMode[data-mode="off"]{color:var(--dsw-alias-state-success-primary)}',
			'.dbb_priceUntil{color:var(--dsw-alias-label-caption);font-size:10px;line-height:14px}',
			'.dbb_priceGrid{display:grid;grid-template-columns:1fr 64px 64px;gap:2px 6px;align-items:baseline;font-size:11px;line-height:16px}',
			'.dbb_priceGrid>span{color:var(--dsw-alias-label-tertiary)}',
			'.dbb_priceGrid>b{text-align:right;color:var(--dsw-alias-label-tertiary);font-weight:400}',
			'.dbb_priceGrid>b[data-active="true"]{color:var(--dsw-alias-label-primary);font-weight:600}',
			'.dbb_priceCol{text-align:right;color:var(--dsw-alias-label-caption);font-size:10px;font-weight:400}',
			'.dbb_priceNote{color:var(--dsw-alias-label-caption);font-size:10px;line-height:14px}',
			'.dbb_chip[data-tone="warn"] .dbb_value,.dbb_chip[data-tone="error"] .dbb_value{color:inherit}',
			'.dbb_dot{width:6px;height:6px;flex:none;border-radius:50%;background:currentColor;opacity:.45}',
			'.dbb_chip[data-busy="true"] .dbb_dot{animation:dbb_pulse .9s ease-in-out infinite alternate}',
			'@keyframes dbb_pulse{from{opacity:.15}to{opacity:.95}}',
			'@media (prefers-reduced-motion:reduce){.dbb_chip[data-busy="true"] .dbb_dot{animation:none;opacity:.55}}',
			'.dbb_panel{z-index:100;box-sizing:border-box;position:fixed;display:flex;flex-direction:column;width:292px;max-width:calc(100vw - 24px);max-height:calc(100vh - 24px);padding:12px;overflow:hidden;--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);box-shadow:var(--dsw-elevation-prominent);font-family:inherit;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}',
			'.dbb_body{display:flex;flex-direction:column;gap:10px;min-width:0;min-height:0;overflow-x:hidden;overflow-y:auto;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2)}',
			'.dbb_head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}',
			'.dbb_headLabel{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:16px}',
			'.dbb_headValue{margin-top:2px;color:var(--dsw-alias-label-primary);font-size:20px;line-height:26px;font-weight:600;font-variant-numeric:tabular-nums}',
			'.dbb_headDelta{flex:none;margin-top:2px;padding:0 6px;height:20px;display:inline-flex;align-items:center;border-radius:999px;background:var(--dsw-alias-interactive-bg-hover);font-size:11px;line-height:16px;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary)}',
			'.dbb_headDelta[data-dir="up"]{color:var(--dsw-alias-state-success-primary)}',
			'.dbb_break{display:flex;flex-wrap:wrap;gap:10px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;font-variant-numeric:tabular-nums}',
			'.dbb_break b{font-weight:500;color:var(--dsw-alias-label-secondary)}',
			'.dbb_session{display:flex;align-items:baseline;gap:6px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;font-variant-numeric:tabular-nums}',
			'.dbb_session b{font-weight:500;color:var(--dsw-alias-label-secondary)}',
			'.dbb_sessionMeta{color:var(--dsw-alias-label-caption)}',
			'.dbb_seg{box-sizing:border-box;width:100%;grid-auto-columns:minmax(0,1fr)}',
			'.dbb_seg>button{padding:0 8px}',
			'.dbb_chart{display:block;width:100%;height:84px;margin-top:2px}',
			'.dbb_chartEmpty{display:flex;flex-direction:column;gap:4px;align-items:center;justify-content:center;height:84px;margin-top:2px;padding:0 8px;border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-tertiary);text-align:center;font-size:11px;line-height:16px}',
			'.dbb_chartEmpty b{color:var(--dsw-alias-label-secondary);font-weight:500}',
			'.dbb_axis{display:flex;justify-content:space-between;margin-top:-4px;color:var(--dsw-alias-label-caption);font-size:10px;line-height:14px;font-variant-numeric:tabular-nums}',
			'.dbb_stats{display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;font-variant-numeric:tabular-nums}',
			'.dbb_stat{display:flex;align-items:baseline;gap:4px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
			'.dbb_stats b{font-weight:500;color:var(--dsw-alias-label-secondary)}',
			'.dbb_footer{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px 8px;border-top:.5px solid var(--dsw-alias-border-l1);padding-top:8px}',
			'.dbb_footerNote{color:var(--dsw-alias-label-caption);font-size:10px;line-height:14px;font-variant-numeric:tabular-nums}',
			'.dbb_actions{display:flex;align-items:center;gap:4px;margin-left:auto}'
		].join("");
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(STYLE_TAG_ID) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-balance-badge";
			tag.dataset.pluginCss = STYLE_TAG_ID;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}
		//#endregion

		//#region constants
		const NS = "dsh-balance-badge";
		/** Build identity reported to the Platform as the calling client. */
		const CLIENT_VERSION = "0.2.1-rc.2";
		/** Re-read on mount / focus only when the last read is older than this. */
		const FRESH_MS = 20000;
		/** Background poll while the page is visible. */
		const POLL_MS = 60000;
		/** Below this total the badge turns amber. */
		const LOW_BALANCE = 1;
		const SYMBOLS = { CNY: "\u00a5", USD: "$" };
		const EMPTY = [];
		/** localStorage slot for the balance history the panel draws. */
		const SAMPLES_KEY = "dsh-balance-badge:samples:v1";
		/** localStorage slot for per-session spend attributed from turn deltas. */
		const SESSIONS_KEY = "dsh-balance-badge:sessions:v1";
		/** localStorage slot remembering the last selected range tab. */
		const RANGE_KEY = "dsh-balance-badge:range:v1";
		/** How many sessions keep a spend record. */
		const MAX_SESSIONS = 200;
		/** How long a sample stays drawable. */
		const RETENTION_MS = 3 * 86400000;
		/** Hard cap so a long-lived page cannot grow localStorage without bound. */
		const MAX_SAMPLES = 900;
		/** Record a point even without a change this often, to keep the time axis honest. */
		const HEARTBEAT_MS = 10 * 60000;
		/** Amounts below this are treated as unchanged. */
		const EPSILON = 0.0001;
		const CHART_W = 268;
		const CHART_H = 84;
		const MEASURE_STYLE = {
			visibility: "hidden",
			left: 0,
			top: 0
		};
		const RANGES = [
			{ value: "1h", ms: 3600000, key: "panel.range.1h" },
			{ value: "6h", ms: 21600000, key: "panel.range.6h" },
			{ value: "24h", ms: 86400000, key: "panel.range.24h" },
			{ value: "3d", ms: 259200000, key: "panel.range.3d" }
		];
		//#endregion

		//#region pricing
		/**
		 * Model prices in CNY per 1M tokens, taken from the official pricing page
		 * (https://api-docs.deepseek.com/zh-cn/quick_start/pricing/). Off-peak is
		 * exactly half of peak, which is how DeepSeek bills it.
		 */
		const MODEL_PRICING = {
			"deepseek-flash": {
				label: "DeepSeek-V4.1-Flash",
				peak: { cacheHit: 0.04, cacheMiss: 2, output: 8 },
				off: { cacheHit: 0.02, cacheMiss: 1, output: 4 }
			},
			"deepseek-v4-pro": {
				label: "DeepSeek-V4-Pro",
				peak: { cacheHit: 0.3, cacheMiss: 9, output: 27 },
				off: { cacheHit: 0.15, cacheMiss: 4.5, output: 13.5 }
			}
		};
		/** Model the badge prices: the desktop profile's default DeepSeek route. */
		const PRICE_MODEL = "deepseek-flash";
		/** Beijing time is the billing timezone, whatever the machine's zone is. */
		const BEIJING_OFFSET_MS = 8 * 3600000;
		/** Peak: Beijing Mon–Fri, minutes-of-day ranges. Everything else is off-peak. */
		const PEAK_WINDOWS = [[9 * 60, 12 * 60], [14 * 60, 18 * 60]];
		const PEAK_WEEKDAYS = new Set([1, 2, 3, 4, 5]);
		/**
		 * Chinese statutory holidays are off-peak all day. Add `"YYYY-MM-DD"` (Beijing
		 * date) entries here — the badge cannot know the State Council calendar offline.
		 */
		const HOLIDAYS = new Set([]);
		/** How far ahead the next billing switch is searched. */
		const PRICE_LOOKAHEAD_MINUTES = 4 * 1440;
		//#endregion

		//#region dictionaries
		const zh = {
			"label": "余额",
			"loading": "同步中",
			"signedOut": "未登录",
			"failed": "读取失败",
			"empty": "无钱包",
			"bonus": "＋赠金 {amount}",
			"tooltip.title": "DeepSeek 账号余额",
			"tooltip.recharge": "充值余额",
			"tooltip.bonus": "赠金余额",
			"tooltip.session": "本会话消耗",
			"tooltip.updated": "更新时间",
			"tooltip.error": "上次刷新失败",
			"tooltip.hint": "点击查看余额变化",
			"tooltip.signedOut": "没有可用的账号登录状态，请到 设置 → 账号 完成登录",
			"rate.peak": "峰",
			"rate.off": "谷",
			"rate.tooltip": "当前 {model} 输出价 {price}/百万 tokens（{mode}时段）",
			"duration.d": "{days} 天 {hours} 小时",
			"duration.hm": "{hours} 小时 {minutes} 分",
			"duration.m": "{minutes} 分钟",
			"aria": "DeepSeek 账号余额：{value}，点击查看余额变化",
			"panel.aria": "余额变化",
			"panel.title": "余额变化",
			"panel.total": "合计",
			"panel.recharge": "充值",
			"panel.bonus": "赠金",
			"panel.rangeLabel": "时间范围",
			"panel.range.1h": "1时",
			"panel.range.6h": "6时",
			"panel.range.24h": "24时",
			"panel.range.3d": "3天",
			"panel.spent": "区间消耗",
			"panel.gained": "区间增加",
			"panel.topUp": "充值",
			"panel.sessionSpend": "本会话消耗",
			"panel.sessionTurns": "{count} 轮",
			"panel.price.title": "模型价格",
			"panel.price.peak": "高峰",
			"panel.price.off": "空闲",
			"panel.price.until": "距调价 {duration}",
			"panel.price.cacheHit": "输入·命中",
			"panel.price.cacheMiss": "输入·未命中",
			"panel.price.output": "输出",
			"panel.price.unit": "元 / 百万 tokens",
			"panel.price.windows": "高峰＝北京时间 周一至周五 9:00–12:00、14:00–18:00；其余时段（含周末与法定节假日）空闲，空闲价 = 高峰价的一半。",
			"panel.price.other": "另一模型 {model}：高峰 {peak} · 空闲 {off}",
			"panel.price.source": "价格来源：DeepSeek 官方定价页（2026-10）",
			"panel.maxDrop": "最大单次",
			"panel.high": "最高",
			"panel.low": "最低",
			"panel.samples": "{count} 个采样点",
			"panel.updated": "最近更新 {time}",
			"panel.refresh": "立即刷新",
			"panel.clear": "清空记录",
			"panel.refreshing": "刷新中",
			"panel.topUpBlocked": "无法打开充值页，请到 设置 → 账号 打开",
			"panel.empty": "还没有采样点",
			"panel.emptyRange": "该时间范围没有采样点",
			"panel.emptyHint": "插件会在后台轮询余额。点「立即刷新」或等下一次自动刷新，这里就会开始记录曲线。",
			"panel.needMore": "再记录 1 个采样点就能画曲线",
			"panel.chartAria": "余额变化曲线：{from} 至 {to}",
			"panel.cleared": "已清空记录"
		};
		const en = {
			"label": "Balance",
			"loading": "syncing",
			"signedOut": "signed out",
			"failed": "unavailable",
			"empty": "no wallet",
			"bonus": "+ bonus {amount}",
			"tooltip.title": "DeepSeek account balance",
			"tooltip.recharge": "Recharge balance",
			"tooltip.bonus": "Bonus wallets",
			"tooltip.session": "This session",
			"tooltip.updated": "Updated",
			"tooltip.error": "Last refresh failed",
			"tooltip.hint": "Click for the balance history",
			"tooltip.signedOut": "No account credential is available; sign in under Settings \u2192 Account",
			"rate.peak": "Peak",
			"rate.off": "Off",
			"rate.tooltip": "Current {model} output price: {price} per 1M tokens ({mode} hours)",
			"duration.d": "{days}d {hours}h",
			"duration.hm": "{hours}h {minutes}m",
			"duration.m": "{minutes}m",
			"aria": "DeepSeek account balance: {value}. Click for the balance history.",
			"panel.aria": "Balance history",
			"panel.title": "Balance history",
			"panel.total": "Total",
			"panel.recharge": "Recharge",
			"panel.bonus": "Bonus",
			"panel.rangeLabel": "Time range",
			"panel.range.1h": "1h",
			"panel.range.6h": "6h",
			"panel.range.24h": "24h",
			"panel.range.3d": "3d",
			"panel.spent": "Spent",
			"panel.gained": "Added",
			"panel.topUp": "Top up",
			"panel.sessionSpend": "This session",
			"panel.sessionTurns": "{count} turns",
			"panel.price.title": "Model price",
			"panel.price.peak": "Peak",
			"panel.price.off": "Off-peak",
			"panel.price.until": "Changes in {duration}",
			"panel.price.cacheHit": "Input · cache hit",
			"panel.price.cacheMiss": "Input · cache miss",
			"panel.price.output": "Output",
			"panel.price.unit": "CNY / 1M tokens",
			"panel.price.windows": "Peak = Beijing time Mon\u2013Fri 09:00\u201312:00 and 14:00\u201318:00; every other hour, weekends and statutory holidays included, is off-peak at half the peak price.",
			"panel.price.other": "Other model {model}: peak {peak} \u00b7 off-peak {off}",
			"panel.price.source": "Source: DeepSeek official pricing page (2026-10)",
			"panel.maxDrop": "Largest drop",
			"panel.high": "High",
			"panel.low": "Low",
			"panel.samples": "{count} samples",
			"panel.updated": "Updated {time}",
			"panel.refresh": "Refresh",
			"panel.clear": "Clear",
			"panel.refreshing": "refreshing",
			"panel.topUpBlocked": "Could not open the top-up page; use Settings \u2192 Account",
			"panel.empty": "No samples yet",
			"panel.emptyRange": "No samples in this range",
			"panel.emptyHint": "The badge polls the balance in the background. Refresh now or wait for the next poll and the curve starts here.",
			"panel.needMore": "One more sample and the curve appears",
			"panel.chartAria": "Balance history from {from} to {to}",
			"panel.cleared": "Cleared"
		};
		//#endregion

		//#region helpers
		/** Render one decimal amount with its currency mark; non-numeric input is shown verbatim. */
		function money(currency, raw) {
			const symbol = SYMBOLS[currency] ?? currency + " ";
			const value = Number(raw);
			if (!Number.isFinite(value)) return symbol + String(raw);
			return symbol + value.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		}
		/** Join wallets of every currency into one display string. */
		function walletsText(wallets) {
			return wallets.map((wallet) => money(wallet.currency, wallet.balance)).join(" / ");
		}
		/** Sum wallet amounts, ignoring unparsable entries. */
		function sumOf(wallets) {
			return wallets.reduce((total, wallet) => {
				const value = Number(wallet.balance);
				return Number.isFinite(value) ? total + value : total;
			}, 0);
		}
		/** Split wallets into the primary currency's recharge, bonus, and spendable total. */
		function walletTotals(wallets, bonus) {
			const currency = wallets[0]?.currency ?? bonus[0]?.currency ?? "CNY";
			const recharge = sumOf(wallets.filter((wallet) => wallet.currency === currency));
			const bonusTotal = sumOf(bonus.filter((wallet) => wallet.currency === currency));
			return {
				currency,
				recharge,
				bonus: bonusTotal,
				total: recharge + bonusTotal
			};
		}
		/** Turn any remote/bridge failure into one short line for the tooltip. */
		function describeError(cause, stage) {
			if (cause instanceof Error) return cause.message || stage;
			if (typeof cause === "string" && cause !== "") return cause;
			if (cause && typeof cause === "object") {
				if (typeof cause.message === "string" && cause.message !== "") return cause.message;
				if (typeof cause.code === "string" && cause.code !== "") return cause.code;
			}
			return stage;
		}
		/** Stand-in for a missing selector hook: no subscription, no hooks called. */
		function noopHook() {
			return void 0;
		}
		/** `HH:mm` for one timestamp. */
		function clockText(timestamp) {
			try {
				return new Date(timestamp).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
			} catch (_error) {
				return "";
			}
		}
		/** Full local clock time for the footer. */
		function stampText(timestamp) {
			try {
				return new Date(timestamp).toLocaleTimeString();
			} catch (_error) {
				return "";
			}
		}
		/** Axis label: `MM-DD HH:mm` for multi-day windows, `HH:mm` otherwise. */
		function axisText(timestamp, spanMs) {
			if (spanMs <= 86400000) return clockText(timestamp);
			try {
				const date = new Date(timestamp);
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				return `${month}-${day} ${clockText(timestamp)}`;
			} catch (_error) {
				return clockText(timestamp);
			}
		}
		/** Signed amount text where `+` means the wallet grew. */
		function signedMoney(currency, delta) {
			const sign = delta > 0 ? "+" : delta < 0 ? "\u2212" : "";
			return sign + money(currency, Math.abs(delta));
		}
		/** Wall-clock parts in Beijing time, independent of the machine's zone. */
		function beijingClock(nowMs) {
			const shifted = new Date(nowMs + new Date(nowMs).getTimezoneOffset() * 60000 + BEIJING_OFFSET_MS);
			const pad = (value) => String(value).padStart(2, "0");
			return {
				weekday: shifted.getDay(),
				minutes: shifted.getHours() * 60 + shifted.getMinutes(),
				dateKey: `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}-${pad(shifted.getDate())}`
			};
		}
		/** Whether DeepSeek bills peak rates at that instant. */
		function isPeakAt(nowMs) {
			const clock = beijingClock(nowMs);
			if (!PEAK_WEEKDAYS.has(clock.weekday) || HOLIDAYS.has(clock.dateKey)) return false;
			return PEAK_WINDOWS.some(([start, end]) => clock.minutes >= start && clock.minutes < end);
		}
		/** First minute at which the billing tier flips, searched forward. */
		function nextChangeAt(nowMs) {
			const peak = isPeakAt(nowMs);
			for (let step = 1; step <= PRICE_LOOKAHEAD_MINUTES; step += 1) {
				const candidate = nowMs + step * 60000;
				if (isPeakAt(candidate) !== peak) return candidate;
			}
			return nowMs + 86400000;
		}
		/** Billing state for one minute bucket; memoised so a render pass is cheap. */
		let priceStateCache = {
			bucket: -1,
			value: null
		};
		function pricingNow(nowMs) {
			const bucket = Math.floor(nowMs / 60000);
			if (priceStateCache.bucket === bucket && priceStateCache.value !== null) return priceStateCache.value;
			const value = {
				peak: isPeakAt(nowMs),
				nextChangeAt: nextChangeAt(nowMs)
			};
			priceStateCache = {
				bucket,
				value
			};
			return value;
		}
		/** `¥0.02` / `¥4.5` / `¥8` — the shortest honest form of a per-million price. */
		function rateText(value) {
			const symbol = SYMBOLS.CNY;
			return symbol + String(value);
		}
		/** "3 小时 12 分" / "45 分钟" / "2 天 3 小时" for the countdown to the next tier. */
		function durationText(t, ms) {
			const total = Math.max(1, Math.round(ms / 60000));
			const days = Math.floor(total / 1440);
			const hours = Math.floor((total % 1440) / 60);
			const minutes = total % 60;
			if (days > 0) return t("duration.d", { days, hours });
			if (hours > 0) return t("duration.hm", { hours, minutes });
			return t("duration.m", { minutes });
		}
		//#endregion

		//#region samples
		/**
		 * Bounded, persisted balance history. The Platform has no history API, so
		 * the badge is the sampler: one point per change, plus a heartbeat so the
		 * time axis stays honest while nothing is being spent.
		 * @param key - localStorage key.
		 * @returns read/record/clear over the stored series.
		 */
		function createSampleBook(key) {
			const read = () => {
				try {
					const raw = globalThis.localStorage?.getItem(key);
					if (!raw) return { currency: void 0, points: EMPTY };
					const parsed = JSON.parse(raw);
					if (!parsed || !Array.isArray(parsed.points)) return { currency: void 0, points: EMPTY };
					const points = parsed.points.filter((point) => Array.isArray(point) && point.length === 2 && Number.isFinite(point[0]) && Number.isFinite(point[1]));
					return {
						currency: typeof parsed.currency === "string" ? parsed.currency : void 0,
						points
					};
				} catch (_error) {
					return { currency: void 0, points: EMPTY };
				}
			};
			let state = read();
			const write = () => {
				try {
					globalThis.localStorage?.setItem(key, JSON.stringify({
						version: 1,
						currency: state.currency,
						points: state.points
					}));
				} catch (_error) {
					/* storage full or unavailable: the in-memory series still draws */
				}
			};
			const prune = (now) => {
				const cutoff = now - RETENTION_MS;
				let points = state.points.filter((point) => point[0] >= cutoff);
				if (points.length > MAX_SAMPLES) points = points.slice(points.length - MAX_SAMPLES);
				state = {
					currency: state.currency,
					points
				};
			};
			return {
				currency: () => state.currency,
				points: () => state.points,
				/** Append when the amount changed or the heartbeat is due; returns whether a point landed. */
				record(now, value, currency) {
					if (!Number.isFinite(value)) return false;
					if (state.currency !== void 0 && state.currency !== currency) {
						state = { currency, points: EMPTY };
					}
					const last = state.points[state.points.length - 1];
					const changed = last === void 0 || Math.abs(last[1] - value) >= EPSILON;
					const stale = last === void 0 || now - last[0] >= HEARTBEAT_MS;
					if (!changed && !stale) return false;
					state = {
						currency,
						points: [...state.points, [now, value]]
					};
					prune(now);
					write();
					return true;
				},
				clear() {
					state = { currency: state.currency, points: EMPTY };
					write();
					return true;
				}
			};
		}
		//#endregion

		//#region sessions
		/**
		 * Per-session spend attributed from turn boundaries: a turn starts, the
		 * badge remembers the total, the turn settles, the badge re-reads and books
		 * the difference against that session. Bounded and persisted so switching
		 * sessions shows each one's own number.
		 * @param key - localStorage key.
		 * @returns read/record/clear over the session ledger.
		 */
		function createSessionBook(key) {
			const read = () => {
				try {
					const raw = globalThis.localStorage?.getItem(key);
					if (!raw) return {};
					const parsed = JSON.parse(raw);
					if (!parsed || typeof parsed.entries !== "object" || parsed.entries === null) return {};
					const entries = {};
					for (const [id, entry] of Object.entries(parsed.entries)) {
						if (typeof id !== "string" || entry === null || typeof entry !== "object") continue;
						const spent = Number(entry.spent);
						const turns = Number(entry.turns);
						if (!Number.isFinite(spent) || spent < 0 || !Number.isFinite(turns) || turns < 0) continue;
						entries[id] = {
							spent,
							turns,
							updatedAt: Number.isFinite(Number(entry.updatedAt)) ? Number(entry.updatedAt) : 0,
							currency: typeof entry.currency === "string" ? entry.currency : void 0
						};
					}
					return entries;
				} catch (_error) {
					return {};
				}
			};
			let state = read();
			const write = () => {
				try {
					globalThis.localStorage?.setItem(key, JSON.stringify({
						version: 1,
						entries: state
					}));
				} catch (_error) {
					/* storage unavailable: the in-memory ledger still answers */
				}
			};
			const prune = () => {
				const ids = Object.keys(state);
				if (ids.length <= MAX_SESSIONS) return;
				ids.sort((left, right) => state[left].updatedAt - state[right].updatedAt);
				const keep = {};
				for (const id of ids.slice(ids.length - MAX_SESSIONS)) keep[id] = state[id];
				state = keep;
			};
			return {
				/** The session's spent total and settled turns, or a zero record. */
				get(id) {
					if (typeof id !== "string") return { spent: 0, turns: 0, updatedAt: 0 };
					const entry = state[id];
					return entry === undefined ? { spent: 0, turns: 0, updatedAt: 0 } : entry;
				},
				/** Book one settled turn's spend; returns whether anything was written. */
				add(id, amount, currency) {
					if (typeof id !== "string" || !Number.isFinite(amount) || amount <= 0) return false;
					const previous = state[id] ?? { spent: 0, turns: 0, updatedAt: 0 };
					state[id] = {
						spent: previous.spent + amount,
						turns: previous.turns + 1,
						updatedAt: Date.now(),
						currency
					};
					prune();
					write();
					return true;
				},
				clear(id) {
					if (typeof id !== "string" || state[id] === undefined) return false;
					delete state[id];
					write();
					return true;
				}
			};
		}
		//#endregion

		//#region store
		/**
		 * One shared balance reader: the Host never caches getBalance, so the badge
		 * owns freshness, in-flight de-duplication, the last known numbers, and the
		 * sampled history the panel draws.
		 * @param ctx - client plugin context carrying locale and account remotes.
		 * @param book - history sampler.
		 * @param sessions - per-session spend ledger.
		 * @returns snapshot source plus refresh/touch/clear entry points.
		 */
		function createStore(ctx, book, sessions) {
			let state = {
				phase: "idle",
				wallets: EMPTY,
				bonus: EMPTY,
				updatedAt: 0,
				error: null,
				refreshing: false,
				revision: 0,
				links: null
			};
			const listeners = new Set();
			let inFlight = null;
			const publish = (next) => {
				state = next;
				for (const listener of [...listeners]) listener();
			};
			const fail = (cause, stage) => {
				publish({
					...state,
					phase: state.wallets.length > 0 ? "ready" : "error",
					error: describeError(cause, stage)
				});
			};
			const client = () => {
				let locale = "en";
				try {
					locale = ctx.locale.getSnapshot().active || "en";
				} catch (_error) {
					locale = "en";
				}
				return {
					version: CLIENT_VERSION,
					locale,
					timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60
				};
			};
			const read = async () => {
				let account;
				try {
					account = await ctx.remote.account.getState();
				} catch (error) {
					fail(error, "state");
					return;
				}
				if (!account || account.ok !== true) {
					fail(account && account.error, "state");
					return;
				}
				if (!account.value || account.value.status !== "credential-stored") {
					publish({ phase: "signed-out", wallets: EMPTY, bonus: EMPTY, updatedAt: Date.now(), error: null, refreshing: false, revision: state.revision, links: null });
					return;
				}
				const links = account.value.links ?? null;
				let result;
				try {
					result = await ctx.remote.account.getBalance(client());
				} catch (error) {
					fail(error, "balance");
					return;
				}
				if (!result || result.ok !== true) {
					fail(result && result.error, "balance");
					return;
				}
				const details = result.value;
				if (details === null) {
					publish({ phase: "signed-out", wallets: EMPTY, bonus: EMPTY, updatedAt: Date.now(), error: null, refreshing: false, revision: state.revision, links: null });
					return;
				}
				if (details.status !== "ready") {
					fail("balance query failed", "balance");
					return;
				}
				const wallets = Array.isArray(details.value) ? details.value.slice() : EMPTY;
				const bonus = Array.isArray(details.bonusWallets) ? details.bonusWallets.slice() : EMPTY;
				const totals = walletTotals(wallets, bonus);
				const recorded = book.record(Date.now(), totals.total, totals.currency);
				publish({
					phase: "ready",
					wallets,
					bonus,
					updatedAt: Date.now(),
					error: null,
					refreshing: false,
					revision: state.revision + (recorded ? 1 : 0),
					links
				});
			};
			const refresh = (options) => {
				if (inFlight !== null) return inFlight;
				const force = options !== void 0 && options.force === true;
				if (!force && state.updatedAt !== 0 && Date.now() - state.updatedAt < FRESH_MS) return Promise.resolve();
				publish({ ...state, phase: state.phase === "idle" ? "loading" : state.phase, refreshing: true });
				inFlight = read().catch((error) => {
					fail(error, "balance");
				}).finally(() => {
					inFlight = null;
					if (state.refreshing) publish({ ...state, refreshing: false });
				});
				return inFlight;
			};
			/**
			 * Force a read that starts after any read already in flight, so a caller
			 * measuring a change (a settled turn) never reads a pre-change number.
			 * @returns promise settling after the fresh read landed.
			 */
			const refreshSettled = async () => {
				const pending = inFlight;
				if (pending !== null) {
					try {
						await pending;
					} catch (_error) {
						/* the forced read below reports its own failure */
					}
				}
				return refresh({ force: true });
			};
			const subscribe = (listener) => {
				listeners.add(listener);
				return () => {
					listeners.delete(listener);
				};
			};
			return {
				getSnapshot: () => state,
				subscribe,
				refresh,
				refreshSettled,
				book,
				/** Spendable total of the last successful read, or null before one lands. */
				total() {
					if (state.phase !== "ready") return null;
					const totals = walletTotals(state.wallets, state.bonus);
					return {
						currency: totals.currency,
						total: totals.total
					};
				},
				/** Booked spend and settled turns for one session. */
				sessionSpend(sessionId) {
					return sessions.get(sessionId);
				},
				/** Attribute one settled turn's spend to its session and repaint. */
				addSessionSpend(sessionId, amount, currency) {
					if (!sessions.add(sessionId, amount, currency)) return false;
					publish({ ...state, revision: state.revision + 1 });
					return true;
				},
				clearSamples() {
					book.clear();
					publish({ ...state, revision: state.revision + 1 });
				},
				/** Forget one session's spend and repaint. */
				clearSessionSpend(sessionId) {
					if (!sessions.clear(sessionId)) return false;
					publish({ ...state, revision: state.revision + 1 });
					return true;
				}
			};
		}
		/** Poll while the page stays visible; focus and tab return re-read when stale. */
		function startPolling(store) {
			const tick = () => {
				if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
				store.refresh();
			};
			const timer = setInterval(tick, POLL_MS);
			const kick = setTimeout(tick, 1500);
			const onFocus = () => {
				store.refresh();
			};
			const onVisibility = () => {
				if (document.visibilityState === "visible") store.refresh();
			};
			if (typeof window !== "undefined") window.addEventListener("focus", onFocus);
			if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisibility);
			return () => {
				clearInterval(timer);
				clearTimeout(kick);
				if (typeof window !== "undefined") window.removeEventListener("focus", onFocus);
				if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisibility);
			};
		}
		//#endregion

		//#region chart
		/** Horizontal breathing room so the end markers never touch the viewBox edge. */
		const CHART_INSET = 4;
		/** Map samples onto the fixed chart box; a flat series still gets a readable band. */
		function project(points) {
			const values = points.map((point) => point[1]);
			let low = Math.min.apply(null, values);
			let high = Math.max.apply(null, values);
			const span = high - low;
			if (span < 0.005) {
				const bump = Math.max(0.5, Math.abs(high) * 0.02);
				low -= bump;
				high += bump;
			} else {
				const pad = span * 0.18;
				low -= pad;
				high += pad;
			}
			const first = points[0][0];
			const last = points[points.length - 1][0];
			const x = (timestamp) => last === first ? CHART_W / 2 : CHART_INSET + ((timestamp - first) / (last - first)) * (CHART_W - 2 * CHART_INSET);
			const y = (value) => {
				const raw = 6 + (1 - (value - low) / (high - low)) * (CHART_H - 12);
				return Math.min(Math.max(raw, CHART_INSET), CHART_H - CHART_INSET);
			};
			return { x, y, low, high, first, last };
		}
		/** Largest single decrease between two neighbouring samples. */
		function largestDrop(points) {
			let worst = 0;
			for (let index = 1; index < points.length; index += 1) {
				const drop = points[index - 1][1] - points[index][1];
				if (drop > worst) worst = drop;
			}
			return worst;
		}
		/** Line + area + endpoint for one sample window. */
		function BalanceChart({ points, label }) {
			const geometry = project(points);
			const path = points.map((point, index) => {
				const command = index === 0 ? "M" : "L";
				return command + geometry.x(point[0]).toFixed(2) + "," + geometry.y(point[1]).toFixed(2);
			}).join(" ");
			const area = path + " L" + geometry.x(geometry.last).toFixed(2) + "," + CHART_H + " L" + geometry.x(geometry.first).toFixed(2) + "," + CHART_H + " Z";
			const last = points[points.length - 1];
			const drop = largestDrop(points);
			let dropIndex = -1;
			if (drop > 0) {
				for (let index = 1; index < points.length; index += 1) {
					if (points[index - 1][1] - points[index][1] === drop) {
						dropIndex = index;
						break;
					}
				}
			}
			const gridlines = [0.25, 0.5, 0.75].map((fraction) => h("line", {
				key: "grid-" + fraction,
				x1: 0,
				x2: CHART_W,
				y1: (6 + fraction * (CHART_H - 12)).toFixed(2),
				y2: (6 + fraction * (CHART_H - 12)).toFixed(2)
			}));
			return h("svg", {
				className: "dbb_chart",
				viewBox: "0 0 " + CHART_W + " " + CHART_H,
				width: CHART_W,
				height: CHART_H,
				role: "img",
				"aria-label": label,
				preserveAspectRatio: "xMidYMid meet"
			}, [
				h("title", { key: "title" }, label),
				h("g", { key: "grid", stroke: "var(--dsw-alias-border-l2)", strokeDasharray: "2 3", strokeWidth: 1 }, gridlines),
				h("path", { key: "area", d: area, fill: "var(--dsw-alias-state-business-primary)", fillOpacity: 0.12, stroke: "none" }),
				h("path", {
					key: "line",
					d: path,
					fill: "none",
					stroke: "var(--dsw-alias-state-business-primary)",
					strokeWidth: 1.5,
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}),
				dropIndex > 0 && dropIndex < points.length - 1 ? h("circle", {
					key: "drop",
					cx: geometry.x(points[dropIndex][0]).toFixed(2),
					cy: geometry.y(points[dropIndex][1]).toFixed(2),
					r: 2.4,
					fill: "var(--dsw-alias-state-warn-primary)",
					stroke: "none"
				}) : null,
				h("circle", {
					key: "now",
					cx: geometry.x(last[0]).toFixed(2),
					cy: geometry.y(last[1]).toFixed(2),
					r: 2.8,
					fill: "var(--dsw-alias-state-business-primary)",
					stroke: "none"
				})
			]);
		}
		//#endregion

		//#region panel
		/** Range the panel opens with: the last one this browser picked, else 6h. */
		function readRange() {
			try {
				const stored = globalThis.localStorage?.getItem(RANGE_KEY);
				const entry = RANGES.find((candidate) => candidate.value === stored);
				return entry === undefined ? RANGES[1].ms : entry.ms;
			} catch (_error) {
				return RANGES[1].ms;
			}
		}
		/** Remember the picked range so reopening the panel keeps the view. */
		function writeRange(ms) {
			try {
				const entry = RANGES.find((candidate) => candidate.ms === ms);
				if (entry !== undefined) globalThis.localStorage?.setItem(RANGE_KEY, entry.value);
			} catch (_error) {
				/* storage unavailable: the panel just opens on the default range */
			}
		}
		/**
		 * Render the model price block: the live billing tier, the countdown to the
		 * next switch, both tiers' prices, and where the numbers come from.
		 * @param t - namespace translator.
		 * @param pricing - current tier plus the instant it flips.
		 * @returns the price section of the panel.
		 */
		function buildPriceBlock(t, pricing) {
			const model = MODEL_PRICING[PRICE_MODEL] ?? MODEL_PRICING[Object.keys(MODEL_PRICING)[0]];
			const other = Object.entries(MODEL_PRICING).find(([id]) => id !== PRICE_MODEL);
			const summary = (config) => [config.cacheHit, config.cacheMiss, config.output].map(rateText).join(" / ");
			const rows = [
				["cacheHit", "panel.price.cacheHit"],
				["cacheMiss", "panel.price.cacheMiss"],
				["output", "panel.price.output"]
			].flatMap(([field, key]) => [
				h("span", { key: field }, t(key)),
				h("b", { key: field + "-peak", "data-active": String(pricing.peak) }, rateText(model.peak[field])),
				h("b", { key: field + "-off", "data-active": String(!pricing.peak) }, rateText(model.off[field]))
			]);
			return h("div", { key: "price", className: "dbb_price", "data-price-block": "" }, [
				h("div", { key: "head", className: "dbb_priceHead" }, [
					h("span", { key: "title", className: "dbb_priceTitle" }, t("panel.price.title") + " · " + model.label),
					h("span", { key: "mode", className: "dbb_priceMode", "data-mode": pricing.peak ? "peak" : "off" }, t(pricing.peak ? "panel.price.peak" : "panel.price.off"))
				]),
				h("div", { key: "until", className: "dbb_priceUntil" }, t("panel.price.until", {
					duration: durationText(t, pricing.nextChangeAt - Date.now())
				})),
				h("div", { key: "grid", className: "dbb_priceGrid" }, [
					h("span", { key: "corner", className: "dbb_priceCol", style: { textAlign: "left" } }, t("panel.price.unit")),
					h("span", { key: "col-peak", className: "dbb_priceCol" }, t("panel.price.peak")),
					h("span", { key: "col-off", className: "dbb_priceCol" }, t("panel.price.off")),
					...rows
				]),
				other === void 0 ? null : h("div", { key: "other", className: "dbb_priceNote" }, t("panel.price.other", {
					model: other[1].label,
					peak: summary(other[1].peak),
					off: summary(other[1].off)
				})),
				h("div", { key: "windows", className: "dbb_priceNote" }, t("panel.price.windows")),
				h("div", { key: "source", className: "dbb_priceNote" }, t("panel.price.source"))
			]);
		}
		/**
		 * Build the floating history panel: current split, range tabs, curve, and
		 * the spend statistics for the selected window.
		 * @param store - shared balance reader.
		 * @param open - opens a Platform page (top-up) through the composed shell.
		 * @returns the panel component.
		 */
		function createPanel(store, open) {
			return function BalancePanel({ t, snapshot, sessionId }) {
				const [range, setRange] = react.useState(readRange);
				const [note, setNote] = react.useState(null);
				const book = store.book;
				const wallets = snapshot.wallets;
				const bonus = snapshot.bonus;
				const totals = walletTotals(wallets, bonus);
				const currency = totals.currency;
				const all = book.points();
				const cutoff = Date.now() - range;
				const points = all.filter((point) => point[0] >= cutoff);
				const span = points.length >= 2 ? points[points.length - 1][0] - points[0][0] : range;
				/** Positive when the wallet grew, negative when money was spent. */
				const change = points.length >= 2 ? points[points.length - 1][1] - points[0][1] : 0;
				const drop = largestDrop(points);
				const values = points.map((point) => point[1]);
				const high = values.length > 0 ? Math.max.apply(null, values) : totals.total;
				const low = values.length > 0 ? Math.min.apply(null, values) : totals.total;
				const topUp = typeof snapshot.links?.topUpUrl === "string" && snapshot.links.topUpUrl !== "" ? snapshot.links.topUpUrl : null;
				const sessionSpend = store.sessionSpend(sessionId);
				const sessionCurrency = sessionSpend.currency ?? currency;
				const ranges = RANGES.map((entry) => ({
					value: entry.value,
					label: t(entry.key)
				}));
				const chartLabel = points.length >= 2 ? t("panel.chartAria", {
					from: axisText(points[0][0], span),
					to: axisText(points[points.length - 1][0], span)
				}) : t("panel.aria");
				const clear = () => {
					store.clearSamples();
					if (sessionId !== void 0) store.clearSessionSpend(sessionId);
					setNote(t("panel.cleared"));
				};
				const stats = [];
				if (points.length >= 2) {
					stats.push(h("span", { key: "change", className: "dbb_stat" }, (change < 0 ? t("panel.spent") : change > 0 ? t("panel.gained") : t("panel.spent")) + " ", h("b", null, signedMoney(currency, change))));
					if (drop > 0) stats.push(h("span", { key: "drop", className: "dbb_stat" }, t("panel.maxDrop") + " ", h("b", null, "\u2212" + money(currency, drop))));
					stats.push(h("span", { key: "high", className: "dbb_stat" }, t("panel.high") + " ", h("b", null, money(currency, high))));
					stats.push(h("span", { key: "low", className: "dbb_stat" }, t("panel.low") + " ", h("b", null, money(currency, low))));
				}
				const samplesText = t("panel.samples", { count: points.length });
				const baseNote = note ?? (snapshot.updatedAt > 0 ? t("panel.updated", { time: stampText(snapshot.updatedAt) }) + " · " + samplesText : samplesText);
				const footerNote = snapshot.refreshing ? baseNote + " · " + t("panel.refreshing") : baseNote;
				const priceBlock = buildPriceBlock(t, pricingNow(Date.now()));
				return h("div", { className: "dbb_body" }, [
					h("div", { key: "head", className: "dbb_head" }, [
						h("div", { key: "headText" }, [
							h("div", { key: "label", className: "dbb_headLabel" }, t("panel.title")),
							h("div", { key: "value", className: "dbb_headValue" }, wallets.length === 0 && bonus.length === 0 ? t("empty") : money(currency, totals.total))
						]),
						points.length >= 2 ? h("span", {
							key: "delta",
							className: "dbb_headDelta",
							"data-dir": change > 0 ? "up" : change < 0 ? "down" : "flat"
						}, signedMoney(currency, change)) : null
					]),
					h("div", { key: "break", className: "dbb_break" }, [
						h("span", { key: "recharge" }, t("panel.recharge") + " ", h("b", null, money(currency, totals.recharge))),
						totals.bonus > 0 ? h("span", { key: "bonus" }, t("panel.bonus") + " ", h("b", null, money(currency, totals.bonus))) : null,
						totals.bonus > 0 ? h("span", { key: "total" }, t("panel.total") + " ", h("b", null, money(currency, totals.total))) : null
					]),
					sessionId === void 0 ? null : h("div", { key: "session", className: "dbb_session", "data-session-spend": "" }, [
						h("span", { key: "label" }, t("panel.sessionSpend")),
						h("b", { key: "value" }, money(sessionCurrency, sessionSpend.spent)),
						h("span", { key: "meta", className: "dbb_sessionMeta" }, "· " + t("panel.sessionTurns", { count: sessionSpend.turns }))
					]),
					h(primitives.SegmentedControl, {
						key: "range",
						id: "dbb-range",
						value: RANGES.find((entry) => entry.ms === range)?.value ?? "6h",
						options: ranges,
						onChange: (value) => {
							const next = RANGES.find((entry) => entry.value === value);
							if (next === undefined) return;
							setRange(next.ms);
							writeRange(next.ms);
						},
						label: t("panel.rangeLabel"),
						className: "dbb_seg"
					}),
					points.length >= 2 ? h("div", { key: "chart" }, [
						h(BalanceChart, { key: "svg", points, label: chartLabel }),
						h("div", { key: "axis", className: "dbb_axis" }, [
							h("span", { key: "from" }, axisText(points[0][0], span)),
							h("span", { key: "to" }, axisText(points[points.length - 1][0], span))
						])
					]) : h("div", { key: "empty", className: "dbb_chartEmpty" }, [
						h("b", { key: "title" }, points.length === 1 ? t("panel.needMore") : all.length > 0 ? t("panel.emptyRange") : t("panel.empty")),
						h("span", { key: "hint" }, t("panel.emptyHint"))
					]),
					stats.length > 0 ? h("div", { key: "stats", className: "dbb_stats" }, stats) : null,
					priceBlock,
					h("div", { key: "footer", className: "dbb_footer" }, [
						h("span", { key: "note", className: "dbb_footerNote" }, footerNote),
						h("div", { key: "actions", className: "dbb_actions" }, [
							topUp !== null ? h(primitives.Button, {
								key: "topup",
								variant: "primary",
								size: "sm",
								title: topUp,
								onClick: () => {
									Promise.resolve(open(topUp)).then((opened) => {
										if (!opened) setNote(t("panel.topUpBlocked"));
									}).catch(() => {
										setNote(t("panel.topUpBlocked"));
									});
								}
							}, t("panel.topUp")) : null,
							h(primitives.Button, {
								key: "refresh",
								variant: "ghost",
								size: "sm",
								disabled: snapshot.refreshing === true,
								onClick: () => {
									setNote(null);
									store.refresh({ force: true });
								}
							}, t("panel.refresh")),
							h(primitives.Button, {
								key: "clear",
								variant: "ghost",
								size: "sm",
								onClick: clear
							}, t("panel.clear"))
						])
					])
				]);
			};
		}
		//#endregion

		//#region component
		/**
		 * Build one badge: a pill trigger plus the portaled history panel.
		 * @param store - shared balance reader.
		 * @param openPage - opens a Platform page through the composed shell.
		 * @param options - `turnEnd` re-reads once after a running turn settles.
		 * @returns the Slot component.
		 */
		function createBadge(store, openPage, options) {
			const turnEnd = options.turnEnd === true;
			const Panel = createPanel(store, openPage);
			return function BalanceBadge(props) {
				const t = typeof props.t === "function" ? props.t : (key) => key;
				const sessionId = typeof props.sessionId === "string" ? props.sessionId : void 0;
				const useSession = typeof props.useSession === "function" ? props.useSession : noopHook;
				const snapshot = react.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
				const running = useSession((session) => session !== void 0 && session.running === true);
				const turn = react.useRef(null);
				const turnSeq = react.useRef(0);
				const [open, setOpen] = react.useState(props.defaultOpen === true);
				const rootRef = react.useRef(null);
				const panelRef = react.useRef(null);
				const position = primitives.useAnchoredPosition({
					open,
					anchorRef: rootRef,
					panelRef,
					side: "top",
					align: "start",
					gap: 8,
					margin: 12
				});
				primitives.useDismissOnOutsidePointer(rootRef, open, setOpen, panelRef);
				react.useEffect(() => {
					store.refresh();
				}, []);
				react.useEffect(() => {
					if (!turnEnd) return;
					if (running) {
						// Remember the wallet this turn starts from. The immediate read may be
						// a poll older than the turn, so refine the baseline once a fresh one lands.
						const token = turnSeq.current + 1;
						turnSeq.current = token;
						turn.current = {
							token,
							baseline: store.total()
						};
						store.refreshSettled().then(() => {
							const current = turn.current;
							if (current === null || current.token !== token) return;
							current.baseline = store.total();
						});
						return;
					}
					const current = turn.current;
					turn.current = null;
					if (current === null || current.baseline === null) return;
					if (sessionId === void 0) return;
					store.refreshSettled().then(() => {
						const after = store.total();
						if (after === null) return;
						const spentAmount = current.baseline.total - after.total;
						if (spentAmount > EPSILON) store.addSessionSpend(sessionId, spentAmount, after.currency);
					});
				}, [running]);
				react.useEffect(() => {
					if (!open) return;
					store.refresh({ force: true });
					const onKeyDown = (event) => {
						if (event.key === "Escape") setOpen(false);
					};
					document.addEventListener("keydown", onKeyDown);
					return () => document.removeEventListener("keydown", onKeyDown);
				}, [open]);
				const wallets = snapshot.wallets;
				const bonus = snapshot.bonus;
				const totals = walletTotals(wallets, bonus);
				let tone = "normal";
				let valueText;
				if (snapshot.phase === "idle" || snapshot.phase === "loading") valueText = t("loading");
				else if (snapshot.phase === "signed-out") valueText = t("signedOut");
				else if (snapshot.phase === "error") {
					valueText = t("failed");
					tone = "error";
				} else {
					valueText = wallets.length === 0 ? t("empty") : walletsText(wallets);
					if (totals.total < LOW_BALANCE) tone = "warn";
				}
				if (snapshot.error !== null && snapshot.phase === "ready") tone = "warn";
				const pricing = pricingNow(Date.now());
				const priceModel = MODEL_PRICING[PRICE_MODEL] ?? MODEL_PRICING[Object.keys(MODEL_PRICING)[0]];
				const priceTier = pricing.peak ? priceModel.peak : priceModel.off;
				const rateMode = t(pricing.peak ? "rate.peak" : "rate.off");
				const children = [
					h("span", {
						key: "rate",
						className: "dbb_rate",
						"data-mode": pricing.peak ? "peak" : "off",
						"aria-hidden": "true"
					}, [
						h("span", { key: "mode", className: "dbb_rateMode" }, rateMode),
						h("span", { key: "value" }, rateText(priceTier.output) + "/M")
					]),
					h("span", { key: "dot", className: "dbb_dot", "aria-hidden": "true" }),
					h("span", { key: "label", className: "dbb_label" }, t("label")),
					h("span", { key: "value", className: "dbb_value" }, valueText)
				];
				if (snapshot.phase === "ready" && totals.bonus > 0) {
					children.push(h("span", { key: "bonus", className: "dbb_bonus" }, t("bonus", { amount: walletsText(bonus) })));
				}
				const lines = [t("tooltip.title")];
				lines.push(t("rate.tooltip", {
					model: priceModel.label,
					price: rateText(priceTier.output),
					mode: rateMode
				}));
				if (wallets.length > 0) lines.push(t("tooltip.recharge") + ": " + walletsText(wallets));
				if (totals.bonus > 0) lines.push(t("tooltip.bonus") + ": " + walletsText(bonus));
				if (sessionId !== void 0) {
					const sessionSpendInfo = store.sessionSpend(sessionId);
					if (sessionSpendInfo.spent > 0) {
						lines.push(t("tooltip.session") + ": " + money(sessionSpendInfo.currency ?? totals.currency, sessionSpendInfo.spent));
					}
				}
				if (snapshot.updatedAt > 0) lines.push(t("tooltip.updated") + ": " + new Date(snapshot.updatedAt).toLocaleTimeString());
				if (snapshot.error !== null) lines.push(t("tooltip.error") + ": " + snapshot.error);
				lines.push(snapshot.phase === "signed-out" ? t("tooltip.signedOut") : t("tooltip.hint"));
				const trigger = h("button", {
					type: "button",
					className: "dbb_chip",
					"data-balance-badge": "",
					"data-phase": snapshot.phase,
					"data-tone": tone,
					"data-busy": snapshot.refreshing ? "true" : void 0,
					"aria-haspopup": "dialog",
					"aria-expanded": open ? "true" : "false",
					title: lines.join("\n"),
					"aria-label": t("aria", { value: valueText }),
					onClick: (event) => {
						event.preventDefault();
						event.stopPropagation();
						setOpen(!open);
					}
				}, children);
				if (!open) return h("span", { className: "dbb_root", ref: rootRef }, trigger);
				const panel = h(primitives.MenuSurface, {
					ref: panelRef,
					className: "dbb_panel",
					role: "dialog",
					"aria-label": t("panel.aria"),
					"data-balance-panel": "",
					style: position ?? MEASURE_STYLE
				}, h(Panel, {
					t,
					snapshot,
					sessionId
				}));
				const host = typeof document !== "undefined" ? document.body : null;
				return h("span", { className: "dbb_root", ref: rootRef }, trigger, host === null ? panel : createPortal(panel, host));
			};
		}
		//#endregion

		//#region plugin
		/** Services the badge needs before it can read the account. */
		const inject = ["slots", "locale", "remote", "remote.account"];
		/**
		 * Open one Platform page in the system browser.
		 *
		 * The renderer has no Electron shell API, `window.open` stays inside the
		 * app, and the sidebar browser renders the Platform pages blank — so the
		 * Host half owns a small loopback route that hands the URL to the OS
		 * default browser. Browser-only deployments fall back to a new tab.
		 * @returns an opener resolving to whether anything was dispatched.
		 */
		function createOpener() {
			return async (url) => {
				if (typeof url !== "string" || url === "") return false;
				try {
					const response = await fetch("/dsh-balance-badge/open?url=" + encodeURIComponent(url), {
						method: "GET",
						mode: "same-origin",
						credentials: "same-origin",
						cache: "no-store"
					});
					if (response.ok) return true;
				} catch (_error) {
					/* no Host route (plain web page, file://): fall through */
				}
				try {
					if (typeof globalThis.open === "function") {
						const opened = globalThis.open(url, "_blank", "noopener,noreferrer");
						if (opened !== null && opened !== void 0) return true;
					}
				} catch (_error) {
					/* fall through to the anchor route */
				}
				try {
					const anchor = typeof document !== "undefined" ? document.createElement("a") : null;
					if (anchor !== null && typeof anchor.click === "function") {
						anchor.href = url;
						anchor.rel = "noreferrer";
						anchor.click();
						return true;
					}
				} catch (_error) {
					/* nothing left to try */
				}
				return false;
			};
		}
		/**
		 * Put one balance badge directly under the composer card and one on the
		 * new-session hero row; both read the same store and open the same panel.
		 * @param ctx - client plugin context.
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "balance badge: dictionaries");
			const book = createSampleBook(SAMPLES_KEY);
			const sessions = createSessionBook(SESSIONS_KEY);
			const store = createStore(ctx, book, sessions);
			const openPage = createOpener();
			ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register({
				name: "conversation.composer.dock",
				id: "balance",
				order: 0,
				locale: NS
			}, createBadge(store, openPage, { turnEnd: true })));
			ctx.slots.inject("conversation.hero.options", () => ctx.slots.register({
				name: "conversation.hero.options",
				id: "balance",
				order: 0,
				locale: NS
			}, createBadge(store, openPage, { turnEnd: false })));
			ctx.effect(() => startPolling(store), "balance badge: polling");
		}
		//#endregion

		exports.name = "dsh-balance-badge";
		exports.inject = inject;
		exports.apply = apply;
		/** Pure pricing math, exported for the offline test (no React involved). */
		exports.__test = {
			isPeakAt,
			nextChangeAt,
			pricingNow,
			rateText,
			durationText
		};
		return module.exports;
	}
});

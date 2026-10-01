export const BtcEurRate = () => {
  const [state, setState] = useState({
    status: "loading",
    rates: null,
    updatedAt: null,
    error: null,
  })
  const [history, setHistory] = useState({
    status: "loading",
    // candles: [{ time, close }] oldest-first
    candles: null,
    error: null,
  })
  const [range, setRange] = useState("30D")
  const [now, setNow] = useState(Date.now())

  const RANGES = {
    "1D": { days: 1, granularity: 3600 },
    "7D": { days: 7, granularity: 3600 * 6 },
    "14D": { days: 14, granularity: 3600 * 12 },
    "30D": { days: 30, granularity: 3600 * 24 },
  }

  useEffect(() => {
    let isMounted = true

    const loadRates = async ({ preserveRate } = { preserveRate: false }) => {
      try {
        const response = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=BTC")

        if (!response.ok) {
          throw new Error(`Coinbase request failed with ${response.status}`)
        }

        const payload = await response.json()
        const usdRate = payload?.data?.rates?.USD
        const eurRate = payload?.data?.rates?.EUR
        const parsedRates = {
          USD: Number(usdRate),
          EUR: Number(eurRate),
        }

        if (!Number.isFinite(parsedRates.USD) || !Number.isFinite(parsedRates.EUR)) {
          throw new Error("Coinbase response did not include valid USD and EUR rates")
        }

        if (!isMounted) {
          return
        }

        setState({
          status: "ready",
          rates: parsedRates,
          updatedAt: new Date(),
          error: null,
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        setState((currentState) => ({
          status: preserveRate && currentState.rates ? "stale" : "error",
          rates: preserveRate ? currentState.rates : null,
          updatedAt: preserveRate ? currentState.updatedAt : null,
          error: error instanceof Error ? error.message : "Unable to load BTC/USD and BTC/EUR rates",
        }))
      }
    }

    loadRates()

    const intervalId = setInterval(() => {
      loadRates({ preserveRate: true })
    }, 5 * 60 * 1000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadHistory = async () => {
      const { days, granularity } = RANGES[range]
      setHistory((h) => ({ ...h, status: h.candles ? "refreshing" : "loading" }))
      try {
        // Coinbase Exchange candles: array of [time, low, high, open, close, volume], newest first
        const end = new Date()
        const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
        const url =
          `https://api.exchange.coinbase.com/products/BTC-USD/candles` +
          `?granularity=${granularity}&start=${start.toISOString()}&end=${end.toISOString()}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Candles request failed with ${response.status}`)
        }
        const rows = await response.json()
        if (!Array.isArray(rows) || rows.length < 2) {
          throw new Error("Candles response was empty")
        }
        const candles = rows
          .map((row) => ({ time: row[0] * 1000, close: row[4] }))
          .sort((a, b) => a.time - b.time)

        if (!isMounted) {
          return
        }

        setHistory({ status: "ready", candles, error: null })
      } catch (error) {
        if (!isMounted) {
          return
        }
        setHistory((h) => ({
          ...h,
          status: h.candles ? "stale" : "error",
          error: error instanceof Error ? error.message : "Unable to load BTC price history",
        }))
      }
    }

    loadHistory()

    const intervalId = setInterval(loadHistory, 5 * 60 * 1000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [range])

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now())
    }, 60 * 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  const formattedRates = state.rates
    ? [
        {
          label: "BTC/USD",
          description: "1 BTC quoted in USD",
          value: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
          }).format(state.rates.USD),
        },
        {
          label: "BTC/EUR",
          description: "1 BTC quoted in EUR",
          value: new Intl.NumberFormat("en-IE", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 2,
          }).format(state.rates.EUR),
        },
      ]
    : []

  const minutesSinceUpdate = state.updatedAt
    ? Math.max(0, Math.floor((now - state.updatedAt.getTime()) / (60 * 1000)))
    : null

  // chart data
  const candles = history.candles
  const chartW = 800
  const chartH = 260
  const pathRef = React.useRef(null)

  const chart = candles
    ? (() => {
        const closes = candles.map((c) => c.close)
        const min = Math.min(...closes)
        const max = Math.max(...closes)
        const span = max - min || 1
        const pad = 8
        const x = (i) => pad + (i / (candles.length - 1)) * (chartW - pad * 2)
        const y = (v) => chartH - pad - ((v - min) / span) * (chartH - pad * 2)
        const line = candles.map((c, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(c.close).toFixed(2)}`).join("")
        const area = `${line} L${x(candles.length - 1).toFixed(2)},${chartH} L${x(0).toFixed(2)},${chartH} Z`
        // change over the window: first open vs last close
        const first = candles[0].close
        const last = candles[candles.length - 1].close
        const diff = last - first
        const pct = (diff / first) * 100
        // x-axis labels: 4 dates spread across the range
        const labels = [0, 0.33, 0.66, 0.99].map((f) => {
          const d = new Date(candles[Math.floor(f * (candles.length - 1))].time)
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        })
        return { line, area, min, max, change: { diff, pct, up: diff >= 0 }, labels, x, y }
      })()
    : null

  const gradientId = "btc-chart-fill"
  const strokeColor = chart?.change.up ? "#16a34a" : "#dc2626"

  return (
    <div className="not-prose my-6 rounded-2xl border border-zinc-950/10 bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm dark:border-white/10 dark:from-zinc-900 dark:to-zinc-950">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Price Reference
          </p>
          <div aria-live="polite" className="space-y-5">
            {formattedRates.length > 0 ? (
              formattedRates.map((rate) => (
                <div key={rate.label} className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                    {rate.label}
                  </p>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                    <p className="text-2xl font-semibold leading-none text-zinc-950 dark:text-white md:text-[2rem]">
                      {rate.value}
                    </p>
                    <p className="text-sm leading-tight text-zinc-600 dark:text-zinc-300">
                      {rate.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                    BTC/USD
                  </p>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                    <p className="text-2xl font-semibold leading-none text-zinc-500 dark:text-zinc-400 md:text-[2rem]">
                      Loading rate...
                    </p>
                    <p className="text-sm leading-tight text-zinc-600 dark:text-zinc-300">
                      1 BTC quoted in USD
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                    BTC/EUR
                  </p>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                    <p className="text-2xl font-semibold leading-none text-zinc-500 dark:text-zinc-400 md:text-[2rem]">
                      Loading rate...
                    </p>
                    <p className="text-sm leading-tight text-zinc-600 dark:text-zinc-300">
                      1 BTC quoted in EUR
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="text-sm text-zinc-600 dark:text-zinc-300 md:text-right">
          <p>{minutesSinceUpdate !== null ? `last updated: ${minutesSinceUpdate} min ago` : "Waiting for first update"}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-950/10 pt-5 dark:border-white/10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            BTC/USD history
          </p>
          <div className="flex items-center gap-1" role="tablist" aria-label="Chart range">
            {Object.keys(RANGES).map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={range === key}
                onClick={() => setRange(key)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  range === key
                    ? "border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {chart && history.status !== "error" ? (
          <div className="mt-4">
            <p
              className={`text-sm font-medium ${
                chart.change.up ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {chart.change.up ? "▲" : "▼"}{" "}
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
                Math.abs(chart.change.diff)
              )}{" "}
              ({chart.change.pct >= 0 ? "+" : ""}
              {chart.change.pct.toFixed(2)}%) over {range}
            </p>
            <svg
              ref={pathRef}
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="mt-2 h-56 w-full"
              preserveAspectRatio="none"
              role="img"
              aria-label={`BTC/USD price chart, last ${range}`}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={chart.area} fill={`url(#${gradientId})`} />
              <path d={chart.line} fill="none" stroke={strokeColor} strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              {chart.labels.map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            {history.status === "loading"
              ? "Loading price history..."
              : "Price history is unavailable right now. The live quotes above are still up to date."}
          </p>
        )}
      </div>

      {state.status === "stale" ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Live refresh failed. Showing the last successfully loaded Coinbase rates.
        </p>
      ) : null}

      {state.status === "error" ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          Unable to load the Coinbase BTC/USD and BTC/EUR rates right now. Try refreshing the page.
        </p>
      ) : null}
    </div>
  )
}

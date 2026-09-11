"use client"

import { useEffect, useState } from "react"

export const BtcEurRate = () => {
  const [state, setState] = useState({
    status: "loading",
    rates: null,
    updatedAt: null,
    error: null,
  })
  const [now, setNow] = useState(Date.now())

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

'use client'

import { useState } from 'react'

type Props = {
  slug: string
  title?: string
  price?: number
  target?: number
  contributed?: number
  className?: string
}

export default function BuyButton({
  slug,
  title,
  price,
  target,
  contributed = 0,
  className = '',
}: Props) {
  const [loading, setLoading] = useState(false)

  const isContribution = target !== undefined
  // For contribution flows, default the amount to the Stripe minimum so users
  // don't have to type the smallest allowed contribution.
  const [contributionAmount, setContributionAmount] = useState(
    isContribution ? '0.50' : '',
  )

  async function handleBuy() {
    try {
      setLoading(true)

      // sanitize contribution input (allow comma or dot) and parse to two decimals
      const sanitize = (s: string) =>
        Number((Number.parseFloat(s.replace(',', '.')) || 0).toFixed(2))
      const amount = isContribution ? sanitize(contributionAmount) : price

      if (!amount || amount < 0.5) {
        window.alert('Please enter an amount of at least $0.50')
        return
      }

      if (isContribution && amount > target - contributed) {
        window.alert(
          `Maximum contribution allowed is $${(target - contributed).toFixed(2)}`,
        )
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          amount,
          origin: window.location.origin,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Checkout session error:', data)
        window.alert(data?.error || 'Failed to create checkout session')
        return
      }

      if (data?.url) {
        window.location.href = data.url
      } else {
        window.alert(
          'Failed to create checkout session — no redirect URL returned',
        )
      }
    } catch (err) {
      console.error(err)
      window.alert(
        'Error creating checkout session — check console for details',
      )
    } finally {
      setLoading(false)
    }
  }

  if (isContribution && contributed >= (target || 0)) {
    return (
      <div className="w-full text-center py-4 px-6 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold rounded-lg">
        🎉 Goal reached! Thank you for your contributions.
      </div>
    )
  }

  const parseAmount = (s: string) => {
    if (!s) return Number.NaN
    return Number(Number.parseFloat(s.replace(',', '.'))?.toFixed(2))
  }

  const step = 0.5
  const maxAvailable = isContribution
    ? Number((target || 0) - contributed)
    : undefined

  const increment = () => {
    const current = parseAmount(contributionAmount) || 0
    const next = Math.min(current + step, maxAvailable ?? current + step)
    setContributionAmount(next.toFixed(2))
  }

  const decrement = () => {
    const current = parseAmount(contributionAmount) || 0
    const next = Math.max(current - step, 0.5)
    setContributionAmount(next.toFixed(2))
  }

  return (
    <div className="space-y-4">
      {isContribution && (
        <div>
          <label
            htmlFor="contribution-amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Contribution Amount ($)
          </label>
          <div className="relative">
            <input
              id="contribution-amount"
              type="text"
              inputMode="decimal"
              pattern="[0-9]+([.,][0-9]{1,2})?"
              max={(target - contributed).toFixed(2)}
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full pr-14 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black/55 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-green-500 focus:border-transparent ring-offset-0"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <button
                type="button"
                aria-label="increase amount"
                onClick={increment}
                className="h-6 w-6 flex items-center justify-center rounded-md bg-white/30 dark:bg-white/5 text-gray-800 dark:text-white hover:bg-white/50 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="decrease amount"
                onClick={decrement}
                className="h-6 w-6 flex items-center justify-center rounded-md bg-white/30 dark:bg-white/5 text-gray-800 dark:text-white hover:bg-white/50 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={handleBuy}
        disabled={
          loading ||
          (isContribution &&
            (Number.isNaN(parseAmount(contributionAmount)) ||
              parseAmount(contributionAmount) < 0.5))
        }
        className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-lg text-white bg-orange-500 dark:bg-green-500 hover:bg-orange-600 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title={
          title
            ? `${isContribution ? 'Contribute to' : 'Buy'} ${title}`
            : isContribution
              ? 'Contribute'
              : 'Buy'
        }
      >
        <span aria-hidden className="text-xl">
          {isContribution ? '🤝' : '☕'}
        </span>
        <span>
          {loading ? 'Redirecting…' : isContribution ? 'Contribute' : 'Buy'}
        </span>
      </button>
    </div>
  )
}

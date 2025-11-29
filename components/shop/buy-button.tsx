'use client'

import { useState } from 'react'

type Props = {
  slug: string
  title?: string
  price?: number
  className?: string
}

export default function BuyButton({
  slug,
  title,
  price,
  className = '',
}: Props) {
  const [loading, setLoading] = useState(false)

  async function handleBuy() {
    try {
      setLoading(true)

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // include the current origin so the server can construct correct
        // success/cancel urls in environments where SITE_URL may not be set
        body: JSON.stringify({ slug, origin: window.location.origin }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Checkout session error:', data)
        window.alert(data?.error || 'Failed to create checkout session')
        return
      }

      if (data?.url) {
        // redirect to Stripe-hosted checkout
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

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-lg text-white bg-orange-500 dark:bg-green-500 hover:bg-orange-600 dark:hover:bg-green-600 transition-colors ${className}`}
      title={title ? `Buy ${title}` : 'Buy'}
    >
      <span aria-hidden className="text-xl">
        ☕
      </span>
      <span>{loading ? 'Redirecting…' : 'Buy'}</span>
    </button>
  )
}

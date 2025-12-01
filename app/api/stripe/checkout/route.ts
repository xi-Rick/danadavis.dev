import Stripe from 'stripe'
import { getShopItemBySlug } from '~/db/queries'

type ShopItem = {
  id: string
  title: string
  slug: string
  price?: number
  target?: number
  contributed?: number
  currency: string
  summary: string
  description: string
  images?: string[]
}

async function loadShopBySlug(slug: string): Promise<ShopItem | null> {
  try {
    const item = await getShopItemBySlug(slug)
    if (!item) return null

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      // prefer explicit price (legacy fallback to contributed)
      price: item.target ? undefined : item.contributed,
      target: item.target || undefined,
      contributed: item.contributed,
      currency: item.currency,
      summary: item.summary,
      description: item.description,
      images: item.images,
    }
  } catch (error) {
    console.error('Error loading shop item by slug:', error)
    return null
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const slug = body?.slug
    const amount = body?.amount

    // prefer explicit origin from client, then request origin header
    const origin = req.headers.get('origin')
    let siteUrl =
      process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3434'
    if (origin) {
      try {
        const u = new URL(origin)
        if (u.protocol === 'https:' || u.protocol === 'http:') {
          siteUrl = u.origin
        }
      } catch {}
    }

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Missing slug' }), {
        status: 400,
      })
    }

    const item = await loadShopBySlug(String(slug))
    if (!item) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
      })
    }

    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) {
      console.error('STRIPE_SECRET_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Server misconfiguration' }),
        { status: 500 },
      )
    }

    const stripe = new Stripe(secret, { apiVersion: '2022-11-15' })

    // price in cents - use provided amount or item price
    const unitAmount = Math.round((amount || item.price || 0) * 100)

    if (unitAmount < 50) {
      return new Response(
        JSON.stringify({ error: 'Amount must be at least $0.50' }),
        {
          status: 400,
        },
      )
    }

    // (siteUrl already computed above using allowlist + env fallbacks)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: (item.currency || 'USD').toLowerCase(),
            unit_amount: unitAmount,
            product_data: {
              name: amount ? `${item.title} - Contribution` : item.title,
              description: amount
                ? `Contribution of $${amount} towards ${item.title}`
                : item.summary,
              images:
                item.images && item.images.length > 0
                  ? [new URL(item.images[0], siteUrl).toString()]
                  : undefined,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/shop?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop/${item.slug}?checkout=cancel`,
      metadata: {
        shop_item_id: item.id,
        shop_item_slug: item.slug,
        is_contribution: amount ? 'true' : 'false',
      },
    })

    return new Response(JSON.stringify({ url: session.url }), { status: 200 })
  } catch (err) {
    console.error('stripe checkout failed', err)
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { status: 500 },
    )
  }
}

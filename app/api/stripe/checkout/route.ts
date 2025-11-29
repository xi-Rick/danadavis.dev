import { promises as fs } from 'node:fs'
import path from 'node:path'
import Stripe from 'stripe'

type ShopItem = {
  id: string
  title: string
  slug: string
  price: number
  currency: string
  summary: string
  description: string
  images?: string[]
}

async function loadShopBySlug(slug: string): Promise<ShopItem | null> {
  try {
    const filePath = path.join(process.cwd(), 'json', 'shop.json')
    const data = JSON.parse(await fs.readFile(filePath, 'utf8')) as ShopItem[]
    return data.find((p) => p.slug === slug) ?? null
  } catch (err) {
    console.error('error loading shop json for stripe route', err)
    return null
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const slug = body?.slug

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

    // price in cents
    const unitAmount = Math.round((item.price || 0) * 100)

    const siteUrl =
      process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3434'

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: (item.currency || 'USD').toLowerCase(),
              unit_amount: unitAmount,
              product_data: {
                name: item.title,
                description: item.summary,
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
        },
      },
      { apiVersion: '2025-11-17.clover' },
    )

    return new Response(JSON.stringify({ url: session.url }), { status: 200 })
  } catch (err) {
    console.error('stripe checkout failed', err)
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { status: 500 },
    )
  }
}

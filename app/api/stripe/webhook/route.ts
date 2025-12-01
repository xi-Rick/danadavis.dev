import { headers } from 'next/headers'
import Stripe from 'stripe'
import {
  createContribution,
  getShopItemBySlug,
  updateShopItemContributed,
} from '~/db/queries'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const sig = (await headers()).get('stripe-signature')

    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return new Response('Webhook secret not configured', { status: 500 })
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY
    if (!stripeSecret) {
      console.error('STRIPE_SECRET_KEY not configured')
      return new Response('Stripe secret not configured', { status: 500 })
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' })

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig!, secret)
    } catch (err) {
      const error = err as Error & { message?: string }
      console.error('Webhook signature verification failed:', error.message)
      return new Response(
        `Webhook Error: ${error.message ?? 'Unknown error'}`,
        { status: 400 },
      )
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const shopItemSlug = session.metadata?.shop_item_slug
      const isContribution = session.metadata?.is_contribution === 'true'

      if (!shopItemSlug) {
        console.error('No shop item slug in session metadata')
        return new Response('Missing shop item metadata', { status: 400 })
      }

      // Get the shop item to verify it exists
      const shopItem = await getShopItemBySlug(shopItemSlug)
      if (!shopItem) {
        console.error('Shop item not found:', shopItemSlug)
        return new Response('Shop item not found', { status: 404 })
      }

      if (!isContribution) {
        // This is a regular purchase, not a contribution
        console.log('Regular purchase completed for:', shopItem.title)
        return new Response('OK', { status: 200 })
      }

      // Calculate the contribution amount
      const amountPaid = (session.amount_total || 0) / 100 // Convert from cents

      // Update contributed amount
      await updateShopItemContributed(shopItemSlug, amountPaid)

      // Create contribution record
      await createContribution(
        shopItem.id,
        amountPaid,
        session.id,
        session.customer_details?.email || undefined,
      )

      console.log(`Contribution of $${amountPaid} added to ${shopItem.title}`)
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response('Webhook handler failed', { status: 500 })
  }
}

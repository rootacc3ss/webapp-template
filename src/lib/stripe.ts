import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim()
const stripeCheckoutEndpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT?.trim()
const stripePortalEndpoint = import.meta.env.VITE_STRIPE_PORTAL_ENDPOINT?.trim()

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Payment features will be disabled.')
}

// Keep Stripe optional so the starter can run before payment setup exists.
export const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : null

type StripeSessionPayload = Record<string, string | undefined>

// Use explicit endpoints so payments do not silently assume a missing local /api server.
async function postStripeSession(
  endpoint: string | undefined,
  payload: StripeSessionPayload,
  actionLabel: string,
  envVarName: string
) {
  if (!endpoint) {
    throw new Error(
      `Stripe ${actionLabel} is not configured. Set ${envVarName} in .env before using the Stripe helpers.`
    )
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to create Stripe ${actionLabel}. Make sure ${envVarName} points to a working API route or Edge Function.`
    )
  }

  return response.json()
} 

async function createCheckoutSession(priceId: string, customerId?: string) {
  return postStripeSession(
    stripeCheckoutEndpoint,
    { priceId, customerId },
    'checkout session',
    'VITE_STRIPE_CHECKOUT_ENDPOINT'
  )
}

async function createBillingPortalSession(customerId: string) {
  return postStripeSession(
    stripePortalEndpoint,
    { customerId },
    'billing portal session',
    'VITE_STRIPE_PORTAL_ENDPOINT'
  )
}

// Keep the legacy helper name for compatibility while exposing a clearer Stripe-specific name.
export const stripe = {
  createCheckoutSession,
  createBillingPortalSession,
  createPortalSession: createBillingPortalSession,
}
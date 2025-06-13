import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Payment features will be disabled.')
}

// Initialize Stripe
export const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : null

// Stripe helper functions
export const stripe = {
  createCheckoutSession: async (priceId: string, customerId?: string) => {
    // This would typically call your backend API
    // which creates a Stripe checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerId,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }
    
    return response.json()
  },

  createPortalSession: async (customerId: string) => {
    // This would typically call your backend API
    // which creates a Stripe customer portal session
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create portal session')
    }
    
    return response.json()
  },
} 
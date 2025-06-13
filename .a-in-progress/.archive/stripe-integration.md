# Stripe Integration Documentation

## Overview

This document outlines the Stripe payment integration within our webapp template, covering payment processing, subscription management, and security best practices.

## Setup and Configuration

### Environment Variables

```
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_SECRET_KEY=your_stripe_secret_key (for server-side only)
VITE_STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret (for server-side only)
```

These should be added to your `.env` file (use `env.example` as a template). Never commit actual keys to your repository.

### Required Dependencies

Our template uses the following Stripe-related packages:

```json
{
  "dependencies": {
    "@stripe/react-stripe-js": "^2.8.0",
    "@stripe/stripe-js": "^4.7.0"
  }
}
```

## Frontend Implementation

### Stripe Provider Setup

In our webapp template, we've implemented a Stripe initialization in `src/lib/stripe.ts`:

```typescript
import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Payment features will be disabled.')
}

// Initialize Stripe
export const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : null
```

### Payment Component Integration

To use Stripe Elements in your components:

```tsx
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import PaymentForm from './PaymentForm'

const CheckoutPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      ) : (
        <div className="text-red-500">
          Stripe is not configured. Please add your publishable key.
        </div>
      )}
    </div>
  )
}
```

### Payment Form Implementation

```tsx
import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const PaymentForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2000, // $20.00
          currency: 'usd',
        }),
      })
      
      const { clientSecret } = await response.json()
      
      // Confirm the payment with Stripe.js
      const cardElement = elements.getElement(CardElement)
      
      if (!cardElement) {
        throw new Error('Card element not found')
      }
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Test User',
          },
        },
      })
      
      if (error) {
        throw new Error(error.message)
      }
      
      if (paymentIntent.status === 'succeeded') {
        // Payment successful
        console.log('Payment successful!')
        // Navigate to success page or update UI
      }
    } catch (err) {
      setError(err.message || 'An error occurred with your payment')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Card Details
        </label>
        <div className="p-3 border rounded-md bg-white">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} />
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay $20.00'}
      </button>
    </form>
  )
}
```

## Stripe Checkout Sessions

For a simpler checkout experience, use Stripe Checkout:

```typescript
// Frontend: Redirect to Stripe Checkout
const handleCheckout = async () => {
  try {
    // Call your backend to create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_1234567890', // Your Stripe Price ID
      }),
    })
    
    const { sessionId } = await response.json()
    
    // Redirect to Stripe Checkout
    const stripe = await stripePromise
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })
      
      if (error) {
        console.error('Error redirecting to checkout:', error)
      }
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
  }
}
```

## Subscriptions Management

### Customer Portal

Allow users to manage their subscriptions with the Stripe Customer Portal:

```typescript
// Frontend: Redirect to Customer Portal
const handleManageSubscription = async () => {
  try {
    // Call your backend to create a portal session
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: 'cus_1234567890', // Customer ID from your database
      }),
    })
    
    const { url } = await response.json()
    
    // Redirect to the portal
    window.location.href = url
  } catch (error) {
    console.error('Error redirecting to customer portal:', error)
  }
}
```

## Backend Implementation with Supabase Edge Functions

### Create Payment Intent

```typescript
// supabase/functions/create-payment-intent/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@11.18.0"

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { amount, currency = 'usd' } = await req.json()
    
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })
    
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Create Checkout Session

```typescript
// supabase/functions/create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@11.18.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const { priceId, customerId } = await req.json()
    
    // Get the user's authentication token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/payment-cancelled`,
      metadata: {
        userId: user.id,
      },
    })
    
    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Create Customer Portal Session

```typescript
// supabase/functions/create-portal-session/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@11.18.0"

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { customerId } = await req.json()
    
    // Create a portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.get('origin')}/account`,
    })
    
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Webhook Handler

```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@11.18.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('Missing stripe-signature header')
    }
    
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret
    )
    
    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        
        // Update user's subscription status in your database
        if (session.metadata?.userId) {
          await supabase
            .from('subscriptions')
            .upsert({
              user_id: session.metadata.userId,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              status: 'active',
              price_id: session.line_items?.data[0]?.price?.id,
              updated_at: new Date().toISOString(),
            })
        }
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        
        // Find user by Stripe customer ID
        const { data: users } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer)
          .single()
        
        if (users) {
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', users.user_id)
        }
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        // Find user by Stripe customer ID
        const { data: users } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer)
          .single()
        
        if (users) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', users.user_id)
        }
        break
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

## Database Schema for Subscriptions

```sql
-- Create a subscriptions table
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  price_id text,
  quantity integer default 1,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  
  constraint user_unique unique (user_id)
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Set up RLS policies
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Admin users can manage all subscriptions
create policy "Admin users can manage all subscriptions"
  on public.subscriptions
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );
```

## Testing Stripe Integration

### Test Mode

Always develop and test using Stripe's test mode and test cards:

- `4242 4242 4242 4242` - Successful payment
- `4000 0000 0000 0002` - Declined payment
- `4000 0000 0000 3220` - 3D Secure authentication required

### Local Testing with Stripe CLI

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Log in and forward events to your local webhook:
   ```bash
   stripe login
   stripe listen --forward-to http://localhost:8000/api/stripe-webhook
   ```
3. Use the webhook signing secret provided by the CLI in your local environment

## Best Practices

1. **Security**:
   - Never log full card details
   - Always use HTTPS
   - Keep Stripe.js up to date
   - Store API keys securely (environment variables)
   - Validate all inputs
   
2. **Error Handling**:
   - Display user-friendly error messages
   - Log detailed errors for debugging
   - Handle declined payments gracefully
   
3. **UX Best Practices**:
   - Show clear pricing information
   - Display loading states during payment processing
   - Provide clear success/error feedback
   - Implement responsive design for payment forms
   
4. **Testing**:
   - Test with various card types and error scenarios
   - Verify webhook handling for subscription events
   - Test on multiple devices and browsers

5. **Compliance**:
   - Ensure your checkout flow complies with SCA (Strong Customer Authentication)
   - Display clear terms and conditions
   - Implement proper refund policies
   - Consider GDPR requirements for user data

## Troubleshooting

1. **Common Errors**:
   - `Authentication error`: Check API keys and environment variables
   - `Invalid request errors`: Verify payload format and required fields
   - Webhook errors: Check signature verification and event handling
   
2. **Payment Failures**:
   - Check card details are correct
   - Ensure test mode is using test cards
   - Verify currency is supported
   - Check for duplicate payment attempts

3. **Integration Issues**:
   - Verify frontend and backend versions are compatible
   - Check network requests in browser console
   - Ensure webhook events are being received and processed

## Support Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [Stripe Testing](https://stripe.com/docs/testing)
- [React Stripe.js](https://github.com/stripe/react-stripe-js)

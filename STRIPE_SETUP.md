# AutoSOAP AI - Stripe Integration Setup Guide

To make the Stripe payment integration fully functional, you need to complete these steps:

## 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Navigate to the Stripe Dashboard

## 2. Get Your API Keys

1. In the Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)

## 3. Create Products and Prices

You need to create two products with monthly pricing:

### Individual Provider Plan

1. Go to **Products** → **Add Product**
2. Name: "Individual Provider"
3. Create a recurring price: $99/month
4. Copy the Price ID (starts with `price_`)

### Clinic Team Plan

1. Go to **Products** → **Add Product**
2. Name: "Clinic Team"
3. Create a recurring price: $399/month
4. Copy the Price ID (starts with `price_`)

### Trial Periods (Optional)

- Stripe handles free trials automatically with the `trial_period_days: 7` setting
- You can use the same Price IDs for both trial and regular subscriptions

## 4. Set Up Environment Variables

Create a `.env` file in your project root with these values:

```env
# Stripe API Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Stripe Price IDs (replace with your actual Price IDs)
VITE_STRIPE_PRICE_INDIVIDUAL_MONTHLY=price_1234567890abcdef
VITE_STRIPE_PRICE_INDIVIDUAL_TRIAL=price_1234567890abcdef
VITE_STRIPE_PRICE_CLINIC_MONTHLY=price_1234567890abcdef
VITE_STRIPE_PRICE_CLINIC_TRIAL=price_1234567890abcdef

# Webhook Secret (for production - see step 5)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 5. Set Up Webhooks (For Production)

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe-webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** and add it to your `.env` file

## 6. Test the Integration

1. Restart your development server: `npm run dev`
2. Click any "Start Free Trial" button
3. You should be redirected to Stripe Checkout
4. Use Stripe's test credit card: `4242 4242 4242 4242`
5. After successful payment, you'll be redirected to the success page

## Test Credit Card Numbers

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Use any future expiration date and any 3-digit CVC

## 7. Going Live

When ready for production:

1. Switch to Live mode in Stripe Dashboard
2. Get your live API keys (starting with `pk_live_` and `sk_live_`)
3. Update your environment variables
4. Set up webhooks with your production domain
5. Complete Stripe's business verification process

## Support

- Stripe Documentation: [https://stripe.com/docs](https://stripe.com/docs)
- Test your integration: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

## Current Implementation Features

✅ 7-day free trial for both plans
✅ Automatic subscription management
✅ Success page with onboarding
✅ Webhook handlers for subscription events
✅ Error handling and loading states
✅ Mobile-responsive checkout flow

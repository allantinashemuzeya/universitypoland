# Stripe Production Configuration

## IMPORTANT: The system is currently using TEST Stripe keys

To enable real payment processing, you need to update the Stripe keys in production.

### Steps to Configure Stripe for Production:

1. **Get your Live Stripe Keys**:
   - Log in to your Stripe Dashboard: https://dashboard.stripe.com
   - Switch to "Live mode" (toggle in the dashboard)
   - Go to Developers > API keys
   - Copy your Live publishable key and Live secret key

2. **Update the Production Environment**:
   SSH into the server and update `/var/www/universitypoland.net/.env`:
   ```
   STRIPE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
   STRIPE_SECRET=sk_live_YOUR_LIVE_SECRET_KEY
   ```

3. **Set up Webhook (Optional but Recommended)**:
   - In Stripe Dashboard, go to Developers > Webhooks
   - Add endpoint: `https://universitypoland.net/stripe/webhook`
   - Select events to listen for (at minimum: `payment_intent.succeeded`)
   - Copy the webhook signing secret
   - Update in `.env`:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
     ```

4. **Clear Configuration Cache**:
   ```bash
   cd /var/www/universitypoland.net
   php artisan config:cache
   ```

5. **Test the Payment Flow**:
   - Create a test student account
   - Submit an application
   - Try to make a payment
   - Verify the payment appears in your Stripe Dashboard (Live mode)

### Current Fee Configuration:
- Application Fee: €50
- Commitment Fee: €350

These can be updated in the Admin panel under Settings.

### Security Notes:
- Never commit live Stripe keys to version control
- Ensure the `.env` file has proper permissions (should be 644)
- Consider using Stripe's restricted keys for additional security
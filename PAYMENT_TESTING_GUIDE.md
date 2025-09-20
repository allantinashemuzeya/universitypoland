# Payment Testing Guide for UITM Recruitment System

## Overview
This guide provides comprehensive testing steps for the Stripe payment integration in the UITM recruitment system.

## Stripe Test Environment Setup

### Test API Keys (Already Configured)
- **Publishable Key**: pk_test_[YOUR_TEST_KEY]
- **Secret Key**: sk_test_[YOUR_TEST_SECRET_KEY]

### Test URLs
- **Application**: http://localhost:8000
- **Student Login**: http://localhost:8000/login
- **Admin Login**: http://localhost:8000/login

### Test Credentials
**Student Accounts:**
- Email: john.mukamuri@example.com / Password: password
- Email: sarah.chigumba@example.com / Password: password

**Admin Accounts:**
- Email: admin@nexusstudy.com / Password: password
- Email: admissions@nexusstudy.com / Password: password

## Stripe Test Cards

### Successful Payment Cards
1. **Basic Success Card**
   - Number: 4242 4242 4242 4242
   - CVC: Any 3 digits
   - Expiry: Any future date
   - Result: Payment succeeds

2. **3D Secure Authentication Required**
   - Number: 4000 0025 0000 3155
   - CVC: Any 3 digits
   - Expiry: Any future date
   - Result: Requires authentication, then succeeds

3. **International Card (EUR)**
   - Number: 4000 0025 0000 0003
   - CVC: Any 3 digits
   - Expiry: Any future date
   - Result: Payment succeeds (good for testing EUR payments)

### Failed Payment Cards
1. **Card Declined**
   - Number: 4000 0000 0000 9995
   - CVC: Any 3 digits
   - Expiry: Any future date
   - Result: Card declined

2. **Insufficient Funds**
   - Number: 4000 0000 0000 9995
   - CVC: Any 3 digits
   - Expiry: Any future date
   - Result: Card declined due to insufficient funds

3. **Incorrect CVC**
   - Number: 4000 0000 0000 0127
   - CVC: Any 3 digits
   - Expiry: Any future date
   - Result: CVC check fails

4. **Expired Card**
   - Number: 4000 0000 0000 0069
   - CVC: Any 3 digits
   - Expiry: Any future date
   - Result: Card expired error

## Testing Scenarios

### Scenario 1: Application Fee Payment (€50)
1. Login as student
2. Create a new application or go to a draft application
3. Click "Pay Application Fee"
4. Enter test card details
5. Submit payment
6. Verify:
   - Payment confirmation message appears
   - Application shows "Application Fee Paid" status
   - Payment record created in database
   - Can now submit application

### Scenario 2: Commitment Fee Payment (€200)
1. Login as admin
2. Approve a student application that has paid application fee
3. Login as the student
4. Go to the approved application
5. Click "Pay Commitment Fee"
6. Enter test card details
7. Submit payment
8. Verify:
   - Payment confirmation message appears
   - Application shows "Commitment Fee Paid" status
   - Payment record created in database

### Scenario 3: Failed Payment Handling
1. Use a declined test card
2. Verify:
   - Error message displayed
   - No payment record created
   - Application status unchanged
   - Can retry payment

### Scenario 4: Network Error Simulation
1. Start payment process
2. Before submitting, disconnect internet
3. Submit payment
4. Verify:
   - Appropriate error message
   - Can retry when connection restored

## Database Verification Commands

### Check Payment Records
```bash
php artisan tinker
>>> App\\Models\\Payment::latest()->take(5)->get()
>>> App\\Models\\Payment::where('type', 'application_fee')->where('status', 'succeeded')->count()
>>> App\\Models\\Payment::where('type', 'commitment_fee')->where('status', 'succeeded')->count()
```

### Check Application Payment Status
```bash
php artisan tinker
>>> $app = App\\Models\\Application::find(1);
>>> $app->hasApplicationFeePaid()
>>> $app->hasCommitmentFeePaid()
>>> $app->payments
```

## Common Issues and Solutions

### Issue: "No API key provided" error
**Solution**: Clear config cache
```bash
php artisan config:clear
php artisan cache:clear
```

### Issue: Payment page not loading
**Solution**: Ensure Vite is running
```bash
npm run dev
```

### Issue: CORS errors
**Solution**: Check that you're accessing via http://localhost:8000, not http://127.0.0.1:8000

### Issue: Payment succeeds but status not updated
**Solution**: Check webhook configuration or manually confirm payment
```bash
php artisan tinker
>>> $payment = App\\Models\\Payment::where('stripe_payment_intent_id', 'pi_xxx')->first();
>>> $payment->update(['status' => 'succeeded', 'paid_at' => now()]);
```

## Testing Checklist

- [ ] Application fee payment with basic test card
- [ ] Application fee payment with 3D Secure card
- [ ] Application fee payment with declined card
- [ ] Verify application can be submitted after fee payment
- [ ] Commitment fee payment for approved application
- [ ] Commitment fee payment attempt for non-approved application (should fail)
- [ ] Payment history shows correctly
- [ ] Admin can see payment status in application details
- [ ] Duplicate payment prevention works
- [ ] Error messages display correctly
- [ ] Payment amounts show correctly (€50 and €200)
- [ ] Currency displays as EUR

## Monitoring Payments

### In Stripe Dashboard
1. Go to https://dashboard.stripe.com/test/payments
2. View all test payments
3. Check payment intents
4. View logs for debugging

### In Application
1. Admin Dashboard shows payment statistics
2. Application details show payment status
3. Student can view payment history

## Production Considerations

Before going to production:
1. Replace test keys with live keys
2. Set up webhook endpoints for payment confirmations
3. Implement receipt generation
4. Add payment failure notifications
5. Set up monitoring and alerts
6. Test with real cards in test mode first
7. Ensure PCI compliance

# Email Configuration Guide for UITM Recruitment System

This guide helps configure email sending on the production server for the UITM recruitment system.

## Email Service Options

### Option 1: Gmail SMTP (Quick Setup)

Add these settings to your `.env` file on the server:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD="your-app-password"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@universitypoland.net
MAIL_FROM_NAME="UITM Poland Admissions"
```

**Important:** For Gmail, you need to:
1. Enable 2-factor authentication on your Google account
2. Generate an app-specific password at https://myaccount.google.com/apppasswords
3. Use the app password (not your regular Gmail password)

### Option 2: SendGrid (Recommended for Production)

1. Sign up for SendGrid: https://sendgrid.com
2. Create an API key
3. Configure in `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD="your-sendgrid-api-key"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@universitypoland.net
MAIL_FROM_NAME="UITM Poland Admissions"
```

### Option 3: Mailgun

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@your-domain.mailgun.org
MAIL_PASSWORD="your-mailgun-password"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@universitypoland.net
MAIL_FROM_NAME="UITM Poland Admissions"
```

### Option 4: Local Mail Server (Postfix)

If you have Postfix installed on your server:

```env
MAIL_MAILER=sendmail
MAIL_FROM_ADDRESS=noreply@universitypoland.net
MAIL_FROM_NAME="UITM Poland Admissions"
```

## Testing Email Configuration

After configuring email settings:

1. SSH into your server and navigate to project directory:
   ```bash
   cd /var/www/universitypoland.net
   ```

2. Clear configuration cache:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

3. Test email sending using tinker:
   ```bash
   php artisan tinker
   ```

   Then in tinker:
   ```php
   Mail::raw('Test email from UITM Recruitment System', function($message) {
       $message->to('your-test-email@example.com')
               ->subject('Test Email');
   });
   ```

4. Check Laravel logs for any errors:
   ```bash
   tail -f storage/logs/laravel.log
   ```

## Email Templates Used in the System

The system sends emails for:

1. **Welcome Email** - When a new student registers
2. **Application Submitted** - Confirmation when application is submitted
3. **Application Status Update** - When admin changes application status
4. **Document Verification** - Updates on document verification
5. **Payment Confirmation** - After successful payment
6. **Password Reset** - For forgot password functionality

## Troubleshooting

### Common Issues:

1. **Connection timeout**
   - Check if your server can reach the SMTP host
   - Verify firewall rules allow outbound connections on port 587

2. **Authentication failed**
   - Double-check username and password
   - For Gmail, ensure you're using an app password

3. **From address rejected**
   - Some providers require the FROM address to be verified
   - Use an email address you control or have verified

4. **Rate limiting**
   - Most providers have sending limits
   - Consider upgrading your plan or using a dedicated email service

## Production Recommendations

1. **Use a professional email service** (SendGrid, Mailgun, Amazon SES)
2. **Set up SPF, DKIM, and DMARC records** for better deliverability
3. **Monitor bounce rates and complaints**
4. **Implement email queuing** for better performance:
   ```env
   QUEUE_CONNECTION=database
   ```
   Then run a queue worker.

5. **Test thoroughly** before going live

## Quick Setup Script

Save this as `setup-email.sh` on your server:

```bash
#!/bin/bash
echo "Email Configuration Setup"
echo "========================"
echo ""
echo "Choose email service:"
echo "1) Gmail SMTP"
echo "2) SendGrid"
echo "3) Mailgun"
echo "4) Local sendmail"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        read -p "Enter Gmail address: " email
        read -sp "Enter Gmail app password: " password
        echo ""
        
        # Update .env file
        sed -i "s/MAIL_MAILER=.*/MAIL_MAILER=smtp/" .env
        sed -i "s/MAIL_HOST=.*/MAIL_HOST=smtp.gmail.com/" .env
        sed -i "s/MAIL_PORT=.*/MAIL_PORT=587/" .env
        sed -i "s/MAIL_USERNAME=.*/MAIL_USERNAME=$email/" .env
        sed -i "s/MAIL_PASSWORD=.*/MAIL_PASSWORD=\"$password\"/" .env
        sed -i "s/MAIL_ENCRYPTION=.*/MAIL_ENCRYPTION=tls/" .env
        ;;
    # Add other cases...
esac

# Clear cache and test
php artisan config:clear
echo "Email configuration updated!"
```
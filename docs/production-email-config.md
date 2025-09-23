# Production Email Configuration

The email is currently set to `log` driver which means emails will be written to the log files instead of being sent.

To configure real email sending on the server, update the following in `/var/www/universitypoland.net/.env`:

## Option 1: Gmail (Quick Setup)
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD="your-app-specific-password"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@universitypoland.net
MAIL_FROM_NAME="UITM Poland Admissions"
```

## Option 2: Local Postfix
```
MAIL_MAILER=sendmail
MAIL_FROM_ADDRESS=noreply@universitypoland.net
MAIL_FROM_NAME="UITM Poland Admissions"
```

After updating, run:
```bash
cd /var/www/universitypoland.net
php artisan config:cache
```

See `docs/email-setup-guide.md` for detailed instructions.
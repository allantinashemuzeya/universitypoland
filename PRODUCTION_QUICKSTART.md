# UITM Recruitment System - Production Quick Start Guide

## 🚀 Production Deployment in 10 Steps

### Prerequisites
- Server with PHP 8.1+, Composer, Node.js 18+
- SSL certificate configured
- Domain pointing to your server

### Step 1: Clone and Setup
```bash
git clone [your-repo]
cd uitm-recruitment
```

### Step 2: Configure Environment
```bash
cp .env.production .env
# Edit .env with your production values:
# - APP_URL=https://yourdomain.com
# - Database credentials
# - Stripe LIVE keys
# - SMTP settings
```

### Step 3: Generate App Key
```bash
php artisan key:generate
```

### Step 4: Run Deployment Script
```bash
./deploy_production.sh
```

### Step 5: Set Up Cron Job
Add to crontab:
```bash
* * * * * cd /path/to/uitm-recruitment && php artisan schedule:run >> /dev/null 2>&1
```

### Step 6: Configure Stripe Webhook
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### Step 7: Set Up Queue Worker (if needed)
```bash
# Using Supervisor
[program:uitm-queue]
command=php /path/to/uitm-recruitment/artisan queue:work --sleep=3
autostart=true
autorestart=true
```

### Step 8: Configure Web Server

#### Nginx Example:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    root /path/to/uitm-recruitment/public;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Step 9: Test Critical Functions
1. Visit: https://yourdomain.com
2. Test user registration
3. Test application creation
4. Test payment with Stripe test card (then switch to live)
5. Check health endpoint: https://yourdomain.com/api/health

### Step 10: Monitor
- Check logs: `storage/logs/laravel.log`
- Monitor health endpoint
- Set up uptime monitoring (UptimeRobot, Pingdom, etc.)

## 🔥 Emergency Fixes

### If payments aren't working:
```bash
php artisan config:clear
php artisan cache:clear
# Check Stripe keys in .env
```

### If site shows 500 error:
```bash
# Check permissions
chmod -R 755 storage bootstrap/cache
# Check logs
tail -f storage/logs/laravel.log
```

### If emails aren't sending:
- Verify SMTP settings in `.env`
- Check mail log: `storage/logs/laravel.log`
- Test with: `php artisan tinker` then `Mail::raw('Test', fn($m) => $m->to('test@example.com')->subject('Test'));`

## 📱 Support Contacts
- Technical Issues: [your-email]
- Stripe Support: support@stripe.com
- Server Issues: [hosting-provider]

---
Last updated: September 20, 2024
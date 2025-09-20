#!/bin/bash

# UITM Recruitment System - Production Deployment Script
# Usage: ./deploy_production.sh

set -e

echo "=== UITM Recruitment System Production Deployment ==="
echo "Starting deployment at $(date)"

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "ERROR: .env.production file not found!"
    echo "Please create .env.production with your production configuration"
    exit 1
fi

# Backup current .env if exists
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
fi

# Use production environment
cp .env.production .env

# Install/update dependencies
echo "Installing dependencies..."
composer install --optimize-autoloader --no-dev

# Clear and cache configurations
echo "Optimizing application..."
php artisan config:clear
php artisan cache:clear
php artisan route:cache
php artisan view:cache
php artisan config:cache

# Run migrations
echo "Running database migrations..."
php artisan migrate --force

# Build frontend assets
echo "Building frontend assets..."
npm install --production
npm run build

# Set correct permissions
echo "Setting permissions..."
chmod -R 755 storage bootstrap/cache
chmod -R 644 storage/logs/*

# Create storage link
php artisan storage:link

# Optimize for production
php artisan optimize

# Queue restart (if using queues)
php artisan queue:restart

echo "=== Deployment completed at $(date) ==="
echo ""
echo "IMPORTANT POST-DEPLOYMENT CHECKLIST:"
echo "1. [ ] Update Stripe webhook URL to: https://yourdomain.com/api/stripe/webhook"
echo "2. [ ] Configure SSL certificate"
echo "3. [ ] Set up cron job for Laravel scheduler"
echo "4. [ ] Configure email service (SMTP settings)"
echo "5. [ ] Set up monitoring/alerts"
echo "6. [ ] Test payment flow with live Stripe keys"
echo "7. [ ] Verify all error pages load correctly"
echo "8. [ ] Check logs directory is writable"
echo ""
echo "Remember to:"
echo "- Keep production keys secure"
echo "- Set up automated backups"
echo "- Monitor error logs regularly"
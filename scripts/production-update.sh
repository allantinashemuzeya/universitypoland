#!/bin/bash

# Production Update Script for Nexus Study Platform
# This script deploys the latest changes including:
# - Document requirement updates
# - Commitment fee change to €300
# - Phone number update to +48 794 961 019

set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the correct directory
if [ ! -f "artisan" ]; then
    print_error "artisan file not found. Make sure you're in the Laravel root directory."
    exit 1
fi

# Pull latest changes
print_info "Pulling latest changes from repository..."
git pull origin main
print_status "Code updated successfully"

# Install/update dependencies
print_info "Updating composer dependencies..."
composer install --optimize-autoloader --no-dev
print_status "Composer dependencies updated"

print_info "Updating npm dependencies..."
npm ci
print_status "NPM dependencies updated"

# Build frontend assets
print_info "Building frontend assets..."
npm run build
print_status "Frontend assets built successfully"

# Update database settings
print_info "Updating database settings..."

# Update commitment fee to €300 (30000 cents)
php artisan tinker --execute="
\App\Models\Setting::updateOrCreate(
    ['key' => 'commitment_fee_amount'],
    ['value' => '30000', 'description' => 'Commitment fee in cents (€300)']
);
echo 'Commitment fee updated to €300' . PHP_EOL;
"

print_status "Database settings updated"

# Clear all caches
print_info "Clearing application caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
print_status "Caches cleared"

# Optimize for production
print_info "Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
print_status "Application optimized for production"

# Fix file permissions
print_info "Fixing file permissions..."
sudo chown -R www-data:www-data storage bootstrap/cache public/build
sudo chmod -R 775 storage bootstrap/cache
print_status "File permissions updated"

# Restart services if running
print_info "Restarting services..."
if command -v supervisorctl &> /dev/null; then
    sudo supervisorctl restart all 2>/dev/null || print_warning "No supervisor processes to restart"
fi

# Restart web server if nginx
if systemctl is-active --quiet nginx; then
    sudo systemctl reload nginx
    print_status "Nginx reloaded"
fi

# Test application
print_info "Testing application health..."
if curl -f -s http://localhost > /dev/null; then
    print_status "Application is responding correctly"
else
    print_warning "Application health check failed - please verify manually"
fi

echo ""
echo "🎉 Production deployment completed successfully!"
echo ""
echo "📋 Summary of changes deployed:"
echo "  • Updated document requirements to include:"
echo "    - Birth Certificate (translated to English)"
echo "    - Medical Certificate" 
echo "    - Eligibility Certificate"
echo "  • Changed commitment fee from €350 to €300"
echo "  • Updated contact phone number to +48 794 961 019"
echo "  • Updated all branding to use red color scheme"
echo ""
echo "📞 Contact Information:"
echo "  Phone/WhatsApp: +48 794 961 019"
echo "  Email: admissions@nexusstudy.com"
echo ""
echo "💳 Current Fee Structure:"
echo "  Application Fee: €50"
echo "  Commitment Fee: €300"
echo ""
#!/bin/bash

# Nexus Study - Production Cache Clear and Update Script
# Run this on your production server to clear all caches and update settings

set -e

echo "🚀 Starting comprehensive cache clearing and update..."

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

# Step 1: Pull latest changes from git
print_info "Step 1: Pulling latest changes from repository..."
git pull origin main
print_status "Latest code pulled"

# Step 2: Update dependencies
print_info "Step 2: Updating dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction
npm ci
print_status "Dependencies updated"

# Step 3: Build frontend assets (CRITICAL - ALWAYS REQUIRED FOR FRONTEND CHANGES)
print_info "Step 3: Building frontend assets..."
print_warning "This step is CRITICAL - Frontend changes won't show without rebuilding!"
npm run build
print_status "Frontend assets rebuilt with new hashes"

# Step 4: Clear ALL Laravel caches
print_info "Step 4: Clearing all Laravel caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan event:clear
php artisan queue:clear
print_status "All Laravel caches cleared"

# Step 5: Clear OPcache if available
print_info "Step 5: Clearing OPcache..."
if command -v php >/dev/null 2>&1; then
    php -r "if (function_exists('opcache_reset')) { opcache_reset(); echo 'OPcache cleared' . PHP_EOL; } else { echo 'OPcache not available' . PHP_EOL; }"
fi

# Step 6: Update database settings (CRITICAL for commitment fee)
print_info "Step 6: Updating database settings..."

# Update commitment fee to €300 (30000 cents)
php artisan tinker --execute="
use App\Models\Setting;
Setting::updateOrCreate(
    ['key' => 'commitment_fee_amount'],
    [
        'value' => '30000',
        'type' => 'integer', 
        'group' => 'fees',
        'description' => 'Commitment fee amount in cents (€300)'
    ]
);
echo 'Commitment fee updated to €300 (30000 cents)' . PHP_EOL;

Setting::updateOrCreate(
    ['key' => 'application_fee_amount'],
    [
        'value' => '5000',
        'type' => 'integer',
        'group' => 'fees', 
        'description' => 'Application fee amount in cents (€50)'
    ]
);
echo 'Application fee confirmed as €50 (5000 cents)' . PHP_EOL;

echo 'Current settings:' . PHP_EOL;
Setting::whereIn('key', ['commitment_fee_amount', 'application_fee_amount'])->get()->each(function(\$setting) {
    echo \$setting->key . ': ' . \$setting->value . ' cents (€' . (\$setting->value / 100) . ')' . PHP_EOL;
});
"

print_status "Database settings updated"

# Step 7: Run database migrations (in case there are any new document fields)
print_info "Step 7: Running database migrations..."
php artisan migrate --force
print_status "Database migrations completed"

# Step 8: Rebuild all production caches
print_info "Step 8: Rebuilding production caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
print_status "Production caches rebuilt"

# Step 9: Fix file permissions
print_info "Step 9: Fixing file permissions..."
sudo chown -R www-data:www-data storage bootstrap/cache public/build 2>/dev/null || chown -R $(whoami):$(whoami) storage bootstrap/cache public/build
sudo chmod -R 775 storage bootstrap/cache 2>/dev/null || chmod -R 775 storage bootstrap/cache
print_status "File permissions fixed"

# Step 10: Restart queue workers
print_info "Step 10: Restarting queue workers..."
php artisan queue:restart
print_status "Queue workers restarted"

# Step 11: Restart web server services
print_info "Step 11: Restarting web server..."

# Restart PHP-FPM
if systemctl is-active --quiet php8.2-fpm 2>/dev/null; then
    sudo systemctl restart php8.2-fpm
    print_status "PHP-FPM restarted"
elif systemctl is-active --quiet php8.1-fpm 2>/dev/null; then
    sudo systemctl restart php8.1-fpm
    print_status "PHP-FPM restarted"
elif systemctl is-active --quiet php-fpm 2>/dev/null; then
    sudo systemctl restart php-fpm
    print_status "PHP-FPM restarted"
fi

# Restart Nginx
if systemctl is-active --quiet nginx 2>/dev/null; then
    sudo systemctl reload nginx
    print_status "Nginx reloaded"
fi

# Restart Apache if running
if systemctl is-active --quiet apache2 2>/dev/null; then
    sudo systemctl reload apache2
    print_status "Apache reloaded"
fi

# Step 12: Clear browser cache hint
print_info "Step 12: Browser cache clearing..."
print_warning "Don't forget to hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)"
print_warning "Or open an incognito/private window to see the changes"

# Step 13: Verify settings
print_info "Step 13: Verifying current fee settings..."
php artisan tinker --execute="
use App\Models\Setting;
echo '=== CURRENT FEE SETTINGS ===' . PHP_EOL;
\$appFee = Setting::where('key', 'application_fee_amount')->first();
\$commitFee = Setting::where('key', 'commitment_fee_amount')->first();

if (\$appFee) {
    echo 'Application Fee: ' . \$appFee->value . ' cents (€' . (\$appFee->value / 100) . ')' . PHP_EOL;
} else {
    echo 'Application Fee: NOT SET' . PHP_EOL;
}

if (\$commitFee) {
    echo 'Commitment Fee: ' . \$commitFee->value . ' cents (€' . (\$commitFee->value / 100) . ')' . PHP_EOL;
} else {
    echo 'Commitment Fee: NOT SET' . PHP_EOL;
}
"

echo ""
print_status "🎉 Cache clearing and updates completed!"
echo ""
echo "📋 What was updated:"
echo "  • All Laravel caches cleared (config, routes, views, events, queue)"
echo "  • OPcache cleared (if available)"
echo "  • ⚡ Frontend assets rebuilt (CRITICAL - new hashes generated)"
echo "  • New document fields now visible (Birth, Medical, Eligibility certificates)"
echo "  • Database settings updated:"
echo "    - Application Fee: €50"
echo "    - Commitment Fee: €300"
echo "  • Database migrations run"
echo "  • All caches rebuilt for production"
echo "  • Web server services restarted"
echo ""
echo "🔍 If you still don't see changes:"
echo "  1. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)"
echo "  2. Try incognito/private window"
echo "  3. Check browser developer tools > Network tab > Disable cache"
echo ""
echo "📞 New contact information should now show:"
echo "  Email: admin@nexus-enterprise.pl"
echo "  Phone: +48 794 961 019"
echo ""
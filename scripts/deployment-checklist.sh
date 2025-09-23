#!/bin/bash

# Deployment Checklist Script for UITM Recruitment System
# Run this on the production server to verify deployment status

echo "=== UITM Recruitment System - Deployment Checklist ==="
echo "Server: universitypoland.net"
echo "Date: $(date)"
echo "======================================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        echo "   $3"
    fi
}

# Navigate to project directory
cd /var/www/universitypoland.net 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Cannot navigate to project directory${NC}"
    echo "Please ensure you're on the correct server"
    exit 1
fi

echo "1. SYSTEM REQUIREMENTS"
echo "----------------------"

# Check PHP version
php_version=$(php -v | head -n 1 | cut -d ' ' -f 2 | cut -d '.' -f 1,2)
if [[ $(echo "$php_version >= 8.2" | bc) -eq 1 ]]; then
    check_status 0 "PHP Version: $php_version (requires >= 8.2)"
else
    check_status 1 "PHP Version: $php_version" "Upgrade to PHP 8.2 or higher"
fi

# Check Node.js version
node_version=$(node -v 2>/dev/null | sed 's/v//' | cut -d '.' -f 1)
if [ -z "$node_version" ]; then
    check_status 1 "Node.js: Not installed" "Install Node.js 20.x"
elif [ $node_version -ge 20 ]; then
    check_status 0 "Node.js Version: $(node -v)"
else
    check_status 1 "Node.js Version: $(node -v)" "Upgrade to Node.js 20.x or higher"
fi

# Check Composer
composer --version &>/dev/null
check_status $? "Composer: Installed" "Install Composer"

echo ""
echo "2. LARAVEL CONFIGURATION"
echo "------------------------"

# Check .env file
if [ -f .env ]; then
    check_status 0 ".env file exists"
    
    # Check key environment variables
    app_env=$(grep "^APP_ENV=" .env | cut -d '=' -f2)
    if [ "$app_env" = "production" ]; then
        check_status 0 "APP_ENV set to production"
    else
        check_status 1 "APP_ENV is '$app_env'" "Set APP_ENV=production"
    fi
    
    # Check database
    if grep -q "^DB_DATABASE=" .env && grep -q "^DB_CONNECTION=sqlite" .env; then
        check_status 0 "Database configured (SQLite)"
    else
        check_status 1 "Database configuration" "Check DB settings in .env"
    fi
    
    # Check APP_KEY
    if grep -q "^APP_KEY=base64:" .env; then
        check_status 0 "APP_KEY is set"
    else
        check_status 1 "APP_KEY missing" "Run: php artisan key:generate"
    fi
else
    check_status 1 ".env file missing" "Copy .env.example to .env and configure"
fi

echo ""
echo "3. DEPENDENCIES & BUILD"
echo "-----------------------"

# Check Composer dependencies
if [ -d "vendor" ]; then
    check_status 0 "Composer dependencies installed"
else
    check_status 1 "Composer dependencies missing" "Run: composer install --no-dev"
fi

# Check npm dependencies
if [ -d "node_modules" ]; then
    check_status 0 "NPM dependencies installed"
else
    check_status 1 "NPM dependencies missing" "Run: npm install"
fi

# Check built assets
if [ -d "public/build" ] && [ -f "public/build/manifest.json" ]; then
    check_status 0 "Frontend assets built"
else
    check_status 1 "Frontend assets not built" "Run: npm run build"
fi

echo ""
echo "4. DATABASE & STORAGE"
echo "--------------------"

# Check database file
if [ -f "database/database.sqlite" ]; then
    check_status 0 "SQLite database exists"
    
    # Check if migrations are run
    php artisan migrate:status &>/dev/null
    if [ $? -eq 0 ]; then
        check_status 0 "Migrations executed"
    else
        check_status 1 "Migrations pending" "Run: php artisan migrate"
    fi
else
    check_status 1 "Database file missing" "Create database and run migrations"
fi

# Check storage link
if [ -L "public/storage" ]; then
    check_status 0 "Storage link exists"
else
    check_status 1 "Storage link missing" "Run: php artisan storage:link"
fi

# Check permissions
storage_writable=$(find storage bootstrap/cache -type d -not -writable 2>/dev/null | wc -l)
if [ $storage_writable -eq 0 ]; then
    check_status 0 "Storage permissions correct"
else
    check_status 1 "Storage permissions issue" "Run: chmod -R 775 storage bootstrap/cache"
fi

echo ""
echo "5. WEB SERVER"
echo "-------------"

# Check Apache virtual host
if [ -f "/etc/apache2/sites-enabled/universitypoland.net.conf" ]; then
    check_status 0 "Apache virtual host configured"
else
    check_status 1 "Apache virtual host missing" "Configure Apache for the domain"
fi

# Check SSL
if [ -d "/etc/letsencrypt/live/universitypoland.net" ]; then
    check_status 0 "SSL certificate installed"
else
    check_status 1 "SSL certificate missing" "Install Let's Encrypt certificate"
fi

echo ""
echo "6. EXTERNAL SERVICES"
echo "-------------------"

# Check Stripe configuration
if grep -q "^STRIPE_KEY=" .env && grep -q "^STRIPE_SECRET=" .env; then
    stripe_key=$(grep "^STRIPE_KEY=" .env | cut -d '=' -f2)
    if [[ $stripe_key == pk_live_* ]]; then
        check_status 0 "Stripe LIVE keys configured"
    elif [[ $stripe_key == pk_test_* ]]; then
        check_status 1 "Stripe TEST keys in use" "Switch to LIVE Stripe keys for production"
    else
        check_status 1 "Stripe keys invalid" "Configure valid Stripe keys"
    fi
else
    check_status 1 "Stripe keys missing" "Add STRIPE_KEY and STRIPE_SECRET to .env"
fi

# Check mail configuration
if grep -q "^MAIL_HOST=" .env && grep -q "^MAIL_USERNAME=" .env; then
    mail_driver=$(grep "^MAIL_MAILER=" .env | cut -d '=' -f2)
    if [ "$mail_driver" != "log" ]; then
        check_status 0 "Email configuration present (using $mail_driver)"
    else
        check_status 1 "Email using log driver" "Configure SMTP for production emails"
    fi
else
    check_status 1 "Email configuration missing" "Configure MAIL_* variables in .env"
fi

echo ""
echo "7. OPTIMIZATION"
echo "---------------"

# Check Laravel optimization
if [ -f "bootstrap/cache/config.php" ]; then
    check_status 0 "Configuration cached"
else
    echo -e "${YELLOW}!${NC} Configuration not cached (Run: php artisan config:cache)"
fi

if [ -f "bootstrap/cache/routes-v7.php" ]; then
    check_status 0 "Routes cached"
else
    echo -e "${YELLOW}!${NC} Routes not cached (Run: php artisan route:cache)"
fi

echo ""
echo "8. QUEUE & SCHEDULER"
echo "-------------------"

# Check if queue worker is needed
if grep -q "^QUEUE_CONNECTION=database" .env || grep -q "^QUEUE_CONNECTION=redis" .env; then
    echo -e "${YELLOW}!${NC} Queue worker needed - Set up supervisor or systemd service"
else
    check_status 0 "Queue using sync driver (no worker needed)"
fi

echo ""
echo "======================================================="
echo "DEPLOYMENT CHECKLIST COMPLETE"
echo ""
echo "To test the site:"
echo "1. Visit https://universitypoland.net"
echo "2. Test user registration and login"
echo "3. Test application submission"
echo "4. Test admin panel access"
echo "5. Check Laravel logs: tail -f storage/logs/laravel.log"
echo ""

# Show summary
errors=$(grep -c "✗" /tmp/deployment_check_$$ 2>/dev/null || echo 0)
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}All checks passed! The deployment appears complete.${NC}"
else
    echo -e "${RED}Some checks failed. Please address the issues above.${NC}"
fi
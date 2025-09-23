#!/bin/bash

# Script to fix Faker package and run database seeding on production
# Run this on the production server after navigating to project directory

echo "=== Fixing Faker Package for Production Seeding ==="
echo ""

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "Error: This script must be run from the Laravel project root directory"
    echo "Please navigate to /var/www/universitypoland.net first"
    exit 1
fi

# Option 1: Install Faker temporarily for seeding
echo "Installing Faker package temporarily for seeding..."
composer require fakerphp/faker --dev

# Clear composer cache and optimize
echo "Optimizing composer autoload..."
composer dump-autoload

# Run the database seeding
echo ""
echo "Running database seeder..."
php artisan db:seed

# Option 2: If you want to remove Faker after seeding (for production)
echo ""
read -p "Do you want to remove Faker package after seeding? (y/n): " remove_faker
if [ "$remove_faker" = "y" ]; then
    echo "Removing Faker package..."
    composer remove fakerphp/faker --dev
    composer install --no-dev --optimize-autoloader
    echo "Faker removed and composer optimized for production"
else
    echo "Keeping Faker package installed"
fi

# Clear caches
echo ""
echo "Clearing caches..."
php artisan config:clear
php artisan cache:clear

echo ""
echo "Database seeding completed!"
echo ""
echo "Note: In production, you might want to create specific seeders that don't"
echo "rely on Faker for essential data like admin users and settings."
#!/bin/bash

# Script to upgrade Node.js to version 20 on Ubuntu server
# Run this on the production server

echo "=== Node.js Upgrade Script ==="
echo "This script will upgrade Node.js to version 20.x LTS"
echo ""

# Check current Node.js version
echo "Current Node.js version:"
node --version 2>/dev/null || echo "Node.js not found"
echo ""

# Remove any existing Node.js repositories
echo "Removing old Node.js repositories..."
sudo rm -f /etc/apt/sources.list.d/nodesource.list*

# Add NodeSource repository for Node.js 20.x
echo "Adding NodeSource repository for Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Update package list
echo "Updating package list..."
sudo apt-get update

# Install Node.js 20.x
echo "Installing Node.js 20.x..."
sudo apt-get install -y nodejs

# Verify installation
echo ""
echo "New Node.js version:"
node --version

echo "New npm version:"
npm --version

echo ""
echo "Node.js upgrade completed!"
echo ""

# Reminder about next steps
echo "Next steps:"
echo "1. Navigate to the project directory: cd /var/www/universitypoland.net"
echo "2. Install npm dependencies: npm install"
echo "3. Build production assets: npm run build"
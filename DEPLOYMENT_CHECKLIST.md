# Deployment Checklist

## 🚨 **CRITICAL DEPLOYMENT STEPS**

### Before Every Deployment:

1. **✅ Code Changes**: Commit and push all code changes
2. **✅ Pull Latest**: `git pull origin main` on server
3. **✅ Dependencies**: Update if needed (`composer install`, `npm ci`)
4. **⚡ BUILD FRONTEND**: `npm run build` ← **CRITICAL - Frontend changes won't show without this!**
5. **✅ Clear Caches**: Laravel config, route, view caches
6. **✅ Database**: Run migrations if needed
7. **✅ Restart Services**: PHP-FPM, Apache/Nginx
8. **✅ Test**: Verify site loads and changes are visible

### 🔧 **One-Line Deployment Command:**

```bash
# Run on server in project directory:
bash clear-server-cache.sh
```

### 📝 **Manual Steps (if needed):**

```bash
# 1. Navigate to project
cd /var/www/universitypoland.net

# 2. Pull latest changes  
git pull origin main

# 3. Update dependencies
composer install --optimize-autoloader --no-dev
npm ci

# 4. 🚨 CRITICAL: Build frontend assets
npm run build

# 5. Clear all caches
php artisan config:clear
php artisan route:clear  
php artisan view:clear
php artisan cache:clear

# 6. Rebuild production caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Restart services
sudo systemctl reload apache2
```

## ⚠️ **Common Issues & Solutions:**

### **Blank Page / JavaScript Errors:**
- **Cause**: Frontend assets not rebuilt after code changes
- **Solution**: Always run `npm run build` after frontend changes

### **Cached Old Content:**
- **Cause**: Browser cache or server cache
- **Solution**: Hard refresh (Ctrl+F5) or incognito window

### **€200 Still Shows Instead of €300:**
- **Cause**: Frontend using hardcoded values or cache
- **Solution**: Verify controller passes `feeSettings`, rebuild frontend

### **Missing Document Fields:**
- **Cause**: Frontend component not updated or not rebuilt
- **Solution**: Check document types array, rebuild frontend

## 🎯 **Remember:**
- **Frontend changes** = `npm run build` is MANDATORY
- **Backend changes** = Clear Laravel caches
- **Database changes** = Run migrations
- **Always test** after deployment

## 📞 **Contact Info Updates:**
- Email: admin@nexus-enterprise.pl  
- Phone: +48 794 961 019
- Academic Year: 2025/2026
- Commitment Fee: €300
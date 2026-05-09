# 🚀 Deployment Guide - AETHER SPACE

Complete guide for deploying your site to production.

## 📋 Pre-Deployment Checklist

- [ ] All content updated
- [ ] Site tested on desktop, tablet, mobile
- [ ] All animations smooth (60fps)
- [ ] 3D scenes loading correctly
- [ ] No console errors
- [ ] Performance optimized
- [ ] Meta tags updated
- [ ] Favicon added

## 🛠️ Production Build

### 1. Build the Project

```bash
npm run build
```

This creates an optimized `/dist/` folder with:
- Minified CSS and JavaScript
- Optimized assets
- Production-ready files

### 2. Test Production Build

```bash
npm run preview
```

Visit `http://localhost:4173` to test the production build locally.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Best for**: Speed, ease, automatic deployments

#### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/site-spatial.git
git push -u origin main
```

#### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Sign up / Log in
3. Click "New Project"
4. Import your GitHub repository
5. Leave settings as default (Vite auto-detected)
6. Click "Deploy"

**That's it!** 🎉

Your site is now live at: `https://your-project-name.vercel.app`

#### Auto-Deploy

- Every push to `main` branch auto-deploys
- Each push gets a unique URL for previewing
- Production URL updates when changes are ready

#### Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update domain nameservers with your registrar

### Option 2: GitHub Pages

**Best for**: Static sites, free hosting

#### Step 1: Update vite.config.js

```javascript
export default defineConfig({
  base: '/site-spatial/',  // Replace with your repo name
  // ... rest of config
});
```

#### Step 2: Build and Deploy

```bash
npm run build
git add dist/
git commit -m "Deploy"
git push origin main
```

#### Step 3: Enable GitHub Pages

1. Go to GitHub repository
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: main, folder: /dist/
5. Save

Your site is live at: `https://YOUR_USERNAME.github.io/site-spatial/`

### Option 3: Netlify

**Best for**: Easy deployment, great UI

#### Step 1: Push to GitHub (same as Vercel)

#### Step 2: Deploy

1. Go to https://netlify.com
2. Click "Add new site"
3. Connect to Git
4. Select repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Click "Deploy"

**Features:**
- Automatic deployments on push
- Preview URLs for each commit
- Custom domain support
- Free SSL certificate

### Option 4: Traditional Hosting (Shared/VPS)

**Best for**: Full control, advanced features

#### Via FTP/SFTP

```bash
# Build the project
npm run build

# Upload /dist/ folder contents via FTP to your host
# Using FileZilla or similar:
# - Local: dist/
# - Remote: /public_html/
```

#### Via SSH

```bash
# Build locally
npm run build

# Connect to server
ssh user@yourdomain.com

# Upload files
scp -r dist/* user@yourdomain.com:/var/www/yourdomain.com/

# Or use git on server
cd /var/www/yourdomain.com
git pull origin main
npm install --production
npm run build
```

## ⚙️ Configuration for Different Hosts

### Nginx Configuration

Create `/etc/nginx/sites-available/aether-space`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/yourdomain.com/dist;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - send all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache Configuration

Create `.htaccess` in root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache headers
<FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

## 🔍 SEO Optimization

### Update Meta Tags

In `index.html` `<head>`:

```html
<meta name="description" content="Premium spatial/sci-fi immersive experience">
<meta name="keywords" content="3D, animation, sci-fi, interactive">
<meta name="author" content="Your Name">

<!-- Open Graph for Social Sharing -->
<meta property="og:title" content="AETHER SPACE">
<meta property="og:description" content="Premium spatial/sci-fi landing page">
<meta property="og:image" content="https://yourdomain.com/og-image.jpg">
<meta property="og:url" content="https://yourdomain.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="AETHER SPACE">
<meta name="twitter:description" content="Premium spatial/sci-fi landing page">
<meta name="twitter:image" content="https://yourdomain.com/twitter-image.jpg">

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">

<!-- Google Site Verification -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE">
```

### Add Sitemap

Create `sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com</loc>
    <lastmod>2026-05-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Add robots.txt

```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

## 📊 Performance Monitoring

### Google Analytics

Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Sentry Error Tracking

```bash
npm install @sentry/browser
```

In `main.js`:

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://YOUR_DSN@sentry.io/YOUR_PROJECT_ID",
  environment: "production",
});
```

## 🔒 Security

### Enable HTTPS

- Vercel/Netlify: Automatic SSL
- Traditional hosting: Use Let's Encrypt
  ```bash
  sudo certbot certonly --standalone -d yourdomain.com
  ```

### Security Headers

Add to Netlify `netlify.toml` or server config:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 📈 Analytics & Monitoring

### Performance Metrics

Tools to monitor:
- **Google PageSpeed**: https://pagespeed.web.dev
- **GTmetrix**: https://gtmetrix.com
- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: https://www.webpagetest.org

Target metrics:
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.8s

### Uptime Monitoring

- **UptimeRobot**: https://uptimerobot.com (free)
- **StatusPage.io**: Status dashboard
- **PagerDuty**: Alerts and incidents

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🐛 Troubleshooting

### Site shows 404 on page reload

**Solution**: Ensure SPA routing is configured (see Nginx/Apache configs above)

### Assets not loading

**Solution**: Check base path in `vite.config.js`:
```javascript
base: '/',  // or '/site-spatial/' if in subdirectory
```

### Slow loading

**Solutions**:
- Enable gzip compression on server
- Optimize images
- Use CDN for static assets
- Reduce 3D model file sizes

### CORS errors

**Solution**: Add CORS headers:
```nginx
add_header Access-Control-Allow-Origin "*";
```

## 📝 Post-Deployment

### Update DNS Records

For custom domain:
1. Get nameservers from hosting provider
2. Update domain registrar DNS settings
3. Wait 24-48 hours for propagation

### Monitor Performance

- Check Google Analytics
- Monitor error tracking (Sentry)
- Use Chrome DevTools Performance tab
- Check server logs

### Regular Maintenance

- Update dependencies monthly
- Monitor security updates
- Backup important data
- Review analytics

## 🎉 Launch Checklist

- [ ] Site is live and accessible
- [ ] All pages load correctly
- [ ] Mobile responsive verified
- [ ] 3D scenes render properly
- [ ] Animations run smoothly
- [ ] No console errors
- [ ] Analytics tracking installed
- [ ] SEO meta tags added
- [ ] Sitemap submitted to Google Search Console
- [ ] Twitter/Facebook links updated
- [ ] Performance acceptable (PageSpeed > 80)

---

**Deployment Complete!** 🚀

Your AETHER SPACE is now live to the world! 🌌

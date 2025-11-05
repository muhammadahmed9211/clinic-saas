# Deployment Guide - Ahmed Clinic SaaS

Complete step-by-step guide to deploy your clinic management system to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase database tables created
- [ ] Google Apps Script deployed
- [ ] Paymob account verified and configured
- [ ] Custom domain purchased (optional)
- [ ] SSL certificate ready (auto with Vercel/Netlify)

## Deployment Options

### 1. Vercel (Recommended) ⭐

**Advantages:**
- Automatic HTTPS
- Global CDN
- Automatic deployments from Git
- Serverless functions support
- Free tier available

**Steps:**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
cd clinic-saas
vercel
```

4. **Configure Environment Variables:**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add all variables from your `.env` file

5. **Set Custom Domain:**
- Go to Domains section
- Add your domain
- Update DNS records as shown

6. **Production Deploy:**
```bash
vercel --prod
```

**Vercel Config (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### 2. Netlify

**Advantages:**
- Simple drag-and-drop deploy
- Automatic HTTPS
- Form handling
- Split testing

**Steps:**

1. **Build the Project:**
```bash
npm run build
```

2. **Deploy via Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

3. **Or Deploy via Web Interface:**
- Go to [netlify.com](https://netlify.com)
- Drag and drop the `dist` folder
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`

4. **Configure Redirects:**
Create `dist/_redirects`:
```
/*    /index.html   200
```

5. **Add Environment Variables:**
- Site settings → Build & deploy → Environment
- Add all `.env` variables

---

### 3. Traditional Web Hosting (cPanel/DirectAdmin)

**Steps:**

1. **Build the Project:**
```bash
npm run build
```

2. **Upload Files:**
- Upload contents of `dist` folder to `public_html` or `www`
- Use FTP client (FileZilla) or hosting file manager

3. **Configure .htaccess:**
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
```

4. **SSL Setup:**
- Use hosting panel to enable SSL
- Or use Let's Encrypt (free)

---

## Custom Domain Configuration

### DNS Records Setup

Add these records at your domain registrar (Namecheap, Google Domains, etc.):

```
Type    Name    Value
A       @       [Your hosting IP or 76.76.21.21 for Vercel]
CNAME   www     [Your Vercel/Netlify subdomain]
```

**For Vercel:**
```
ahmedclinic.com → Add to Vercel
www.ahmedclinic.com → CNAME to cname.vercel-dns.com
```

**For Netlify:**
```
ahmedclinic.com → Add to Netlify
www.ahmedclinic.com → CNAME to [your-site].netlify.app
```

### SSL Certificate

- **Vercel/Netlify:** Automatic (Let's Encrypt)
- **cPanel:** Use AutoSSL or Let's Encrypt
- **Manual:** Purchase from SSL provider

---

## Post-Deployment Configuration

### 1. Update Environment Variables

Update these URLs in production `.env`:

```env
VITE_APP_URL=https://ahmedclinic.com
VITE_PAYMENT_SUCCESS_URL=https://ahmedclinic.com/payment-success
VITE_PAYMENT_CANCEL_URL=https://ahmedclinic.com/payment-cancel
```

### 2. Update Supabase Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:
```
Site URL: https://ahmedclinic.com
Redirect URLs:
  - https://ahmedclinic.com/**
  - http://localhost:3000/** (for development)
```

### 3. Update Paymob Webhook

In Paymob Dashboard:
```
Webhook URL: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?webhook=payment
```

### 4. Test Payment Flow

1. Complete a test transaction
2. Verify webhook is received
3. Check payment status updates
4. Confirm email notifications

---

## Performance Optimization

### 1. Enable Caching

**Vercel Headers (`vercel.json`):**
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Image Optimization

- Use WebP format
- Compress images before upload
- Use lazy loading

### 3. Code Splitting

Already handled by Vite - no action needed

---

## Monitoring & Analytics

### 1. Add Google Analytics

In `index.html` before `</head>`:
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

### 2. Error Tracking (Sentry)

```bash
npm install @sentry/react
```

In `main.jsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

### 3. Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

---

## Backup Strategy

### 1. Database Backups

**Supabase:**
- Automatic daily backups on paid plans
- Manual export via Dashboard → Database → Export

### 2. Code Backups

- Push to GitHub/GitLab
- Use Git tags for releases
```bash
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

### 3. Environment Variables

- Keep secure backup of `.env` file
- Use password manager or encrypted storage

---

## Scaling Considerations

### When to Scale

- **> 1000 daily users:** Upgrade Supabase plan
- **> 10,000 daily users:** Consider dedicated backend
- **High traffic:** Use CDN, optimize queries

### Scaling Options

1. **Supabase:** Upgrade to Pro ($25/month)
2. **Apps Script:** Multiple deployments for load balancing
3. **Frontend:** Already auto-scales on Vercel/Netlify
4. **Database:** Add read replicas, connection pooling

---

## Security Hardening

### 1. Rate Limiting

Add to Apps Script:
```javascript
// Track requests per IP
const cache = CacheService.getScriptCache();
const key = 'rate_' + request.parameter.ip;
const requests = parseInt(cache.get(key) || '0');

if (requests > 100) {
  throw new Error('Rate limit exceeded');
}

cache.put(key, requests + 1, 3600);
```

### 2. API Key Rotation

- Rotate Supabase keys every 90 days
- Update Paymob credentials regularly

### 3. Security Headers

Add to deployment config:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## Rollback Procedure

If deployment fails:

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
- Dashboard → Deploys → Click on previous deploy → Publish

**Traditional:**
- Restore from backup
- Replace files with previous version

---

## Launch Checklist

- [ ] Production environment variables set
- [ ] Domain configured and SSL active
- [ ] Supabase redirect URLs updated
- [ ] Paymob webhook configured
- [ ] Test payment flow working
- [ ] Email notifications working
- [ ] Analytics installed
- [ ] Error monitoring active
- [ ] Backup system in place
- [ ] Documentation updated
- [ ] Team trained on system

---

## Support & Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check payment status

**Weekly:**
- Review user feedback
- Check system performance
- Update content if needed

**Monthly:**
- Update dependencies
- Security audit
- Backup verification
- Performance review

---

## Need Help?

- Check logs in Vercel/Netlify dashboard
- Review Apps Script execution logs
- Check Supabase logs
- Verify webhook delivery in Paymob

---

**Congratulations!** 🎉 Your clinic is now live and ready to serve patients!
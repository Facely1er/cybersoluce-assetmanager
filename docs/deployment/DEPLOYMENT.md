# Production Deployment Guide

This guide covers deploying ERMITS CyberSoluce® to production environments.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Netlify account (for hosting)

## Environment Setup

### 1. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your Project URL and anon key
4. Run the database migration in the SQL editor:
   ```sql
   -- Copy and paste the entire content from supabase/migrations/initial_schema.sql
   ```

### 2. Environment Variables

Create a `.env.local` file with your production values:

```bash
# Required - Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional - Enhanced Features
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Deployment Options

### Option 1: Netlify (Recommended)

1. **Connect Repository**
   ```bash
   # Fork the repository or use your own
   git clone <your-repo-url>
   cd ermits-cybersoluce
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Build settings are already configured in `netlify.toml`

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add your Supabase credentials:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Netlify will automatically build and deploy
   - Your site will be available at `https://your-site-name.netlify.app`

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

### Option 3: AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your Git repository

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

## Production Checklist

### 🔒 Security

- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Configure proper CORS settings
- [ ] Set up CSP headers (already configured)
- [ ] Enable HTTPS redirect
- [ ] Configure rate limiting
- [ ] Set up proper backup procedures

### 📊 Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring
- [ ] Set up log aggregation

### 🔧 Performance

- [ ] Enable CDN (automatic with Netlify)
- [ ] Configure caching headers
- [ ] Optimize images and assets
- [ ] Enable service worker caching
- [ ] Set up bundle analysis

### 🗄️ Database

- [ ] Run database migrations
- [ ] Set up automated backups
- [ ] Configure monitoring and alerts
- [ ] Set up read replicas (if needed)
- [ ] Optimize query performance

### 📧 Email & Notifications

- [ ] Configure SMTP settings in Supabase
- [ ] Set up email templates
- [ ] Configure webhook endpoints
- [ ] Test notification delivery
- [ ] Set up bounce handling

## Domain Configuration

### Custom Domain Setup

1. **Add Domain to Netlify**
   - Go to Site settings → Domain management
   - Add your custom domain

2. **Configure DNS**
   ```
   CNAME www your-site-name.netlify.app
   A @ 75.2.60.5
   ```

3. **Enable HTTPS**
   - Netlify automatically provides SSL certificates
   - Force HTTPS redirect is enabled in `netlify.toml`

## Database Migration

### Initial Setup

1. **Copy Migration SQL**
   ```bash
   # Copy content from supabase/migrations/initial_schema.sql
   ```

2. **Run in Supabase SQL Editor**
   - Go to Supabase Dashboard → SQL Editor
   - Paste and run the migration
   - Verify all tables and policies are created

3. **Test Authentication**
   - Create a test user account
   - Verify user can sign up and sign in
   - Check that RLS policies work correctly

## Environment-Specific Configuration

### Production
```bash
NODE_ENV=production
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_ERROR_REPORTING=true
```

### Staging
```bash
NODE_ENV=production
VITE_APP_ENV=staging
VITE_DEBUG_MODE=true
VITE_ENABLE_ERROR_REPORTING=true
```

### Development
```bash
NODE_ENV=development
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
VITE_ENABLE_ERROR_REPORTING=false
```

## Performance Optimization

### Bundle Analysis
```bash
npm run build
npx vite-bundle-analyzer dist
```

### Lighthouse Audit
```bash
npm install -g lighthouse
lighthouse https://your-domain.com --output html --output-path ./lighthouse-report.html
```

## Monitoring & Maintenance

### Health Checks
- Application health: `https://your-domain.com/api/health`
- Database health: Monitor in Supabase Dashboard
- CDN health: Monitor in Netlify Dashboard

### Regular Tasks
- [ ] Weekly: Review error logs and performance metrics
- [ ] Monthly: Update dependencies and security patches
- [ ] Quarterly: Review and optimize database performance
- [ ] Annually: Security audit and penetration testing

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

2. **Database Connection**
   - Verify Supabase URL and key
   - Check CORS settings
   - Verify RLS policies

3. **Authentication Issues**
   - Check email confirmation settings
   - Verify redirect URLs
   - Check Supabase auth configuration

4. **Performance Issues**
   - Review bundle size
   - Check for memory leaks
   - Optimize database queries
   - Review caching strategy

## Support

For deployment support:
- Check the troubleshooting section above
- Review Netlify/Vercel documentation
- Contact the development team

For application support:
- Review the user manual
- Check the GitHub issues
- Contact technical support
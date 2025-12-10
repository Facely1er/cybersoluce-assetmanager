# Configure Supabase Authentication

**Date**: December 2025  
**Estimated Time**: 10 minutes  
**Prerequisites**: Deployment URL from Step 3

## Overview

After deploying to Netlify/Vercel, you need to configure Supabase authentication to allow your deployed application to authenticate users.

## Step 1: Configure Redirect URLs

### 1.1 Access Supabase Auth Settings

1. Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/url-configuration
2. You'll see two sections:
   - **Site URL**
   - **Redirect URLs**

### 1.2 Set Site URL

1. In the **Site URL** field, enter your deployment URL:
   ```
   https://your-project-name.vercel.app
   ```
   (Replace `your-project-name` with your actual Vercel project name)

2. Click **"Save"**

### 1.3 Add Redirect URLs

1. In the **Redirect URLs** section, click **"Add URL"**
2. Add each of these URLs (one at a time):

   ```
   https://your-site-name.netlify.app/**
   ```

   ```
   https://your-site-name.netlify.app/auth/callback
   ```

   ```
   https://your-site-name.netlify.app/*
   ```

3. Click **"Save"** after adding each URL

**Important**: Replace `your-project-name` with your actual Vercel deployment URL (e.g., `your-project.vercel.app`).

### 1.4 Verify Configuration

After saving, verify:
- ✅ Site URL is set correctly
- ✅ All 3 redirect URLs are added
- ✅ No typos in URLs

## Step 2: Configure Email Provider

### 2.1 Enable Email Provider

1. Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/providers
2. Find **"Email"** in the providers list
3. Ensure it's **enabled** (toggle should be ON)
4. If disabled, click the toggle to enable it

### 2.2 Configure SMTP (Optional - for custom email)

If you want to use your own SMTP server:

1. Scroll to **"SMTP Settings"** section
2. Click **"Configure SMTP"**
3. Enter your SMTP details:
   - Host
   - Port
   - Username
   - Password
   - Sender email
   - Sender name

**Note**: If you don't configure SMTP, Supabase will use its built-in email service (limited to development/testing).

### 2.3 Test Email Delivery

1. Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/users
2. Create a test user or use an existing one
3. Try password reset or email confirmation
4. Verify email is received

## Step 3: Configure Email Templates

### 3.1 Access Email Templates

1. Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/templates
2. You'll see templates for:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password
   - Invite user

### 3.2 Customize Templates (Optional)

For each template, you can:
- Customize subject line
- Customize email body
- Add your branding
- Include custom variables

**Recommended**: At minimum, customize the subject lines to include your app name.

### 3.3 Test Templates

1. Use the **"Send test email"** button for each template
2. Verify emails are received
3. Check formatting looks correct

## Step 4: Verify Authentication Configuration

### 4.1 Test Authentication Flow

1. Go to your deployed site: `https://your-project-name.vercel.app`
2. Click **"Sign Up"** or **"Sign In"**
3. Try creating a new account
4. Check email for confirmation link
5. Click confirmation link
6. Verify you're redirected back to your site
7. Verify you're logged in

### 4.2 Verify Redirect URLs Work

1. Sign out
2. Sign in again
3. Verify you're redirected to: `https://your-project-name.vercel.app/auth/callback`
4. Verify you're then redirected to the dashboard

### 4.3 Check for Errors

1. Open browser console (F12)
2. Look for any authentication errors
3. Check Network tab for failed requests
4. Verify no CORS errors

## Troubleshooting

### Authentication Not Working

**Error: "Invalid redirect URL"**
- Solution: Verify redirect URLs are added correctly in Supabase
- Check for typos in URLs
- Ensure URLs match exactly (including https://)

**Error: "Email not sent"**
- Solution: Check email provider is enabled
- Verify SMTP settings (if using custom SMTP)
- Check Supabase email service limits

**Error: "Redirect loop"**
- Solution: Verify Site URL is set correctly
- Check redirect URLs don't conflict
- Clear browser cache and cookies

### Email Not Received

- Check spam folder
- Verify email provider is enabled
- Check SMTP settings (if using custom)
- Verify email address is correct
- Check Supabase email service status

### CORS Errors

- Verify Site URL is set in Supabase
- Check redirect URLs include your domain
- Verify environment variables are set correctly
- Check browser console for specific CORS errors

## Quick Reference

### Supabase Links
- **Auth URL Configuration**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/url-configuration
- **Auth Providers**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/providers
- **Email Templates**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/templates
- **Users**: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/auth/users

### Required URLs to Add
```
https://your-project-name.vercel.app/**
https://your-project-name.vercel.app/auth/callback
https://your-project-name.vercel.app/*
```

## Verification Checklist

After configuration, verify:

- [ ] Site URL is set in Supabase
- [ ] All 3 redirect URLs are added
- [ ] Email provider is enabled
- [ ] Email templates are configured
- [ ] Test signup works
- [ ] Test signin works
- [ ] Email confirmation works
- [ ] Password reset works
- [ ] Redirects work correctly
- [ ] No console errors

---

**Last Updated**: December 2025


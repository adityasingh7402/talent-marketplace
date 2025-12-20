# Environment Setup Guide

## Quick Start

### 1. Create Your Local Environment File

Copy the example file to create your local environment configuration:

```bash
cp .env.example .env.local
```

Or on Windows:
```cmd
copy .env.example .env.local
```

### 2. Fill in Required Values

Open `.env.local` and fill in the following **REQUIRED** values:

#### 🔴 Critical (Must Have)

1. **MongoDB Connection String**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talent-marketplace
   ```
   - Get from: https://cloud.mongodb.com
   - Create a free cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string

2. **NextAuth Secret**
   ```env
   NEXTAUTH_SECRET=your-secret-here
   ```
   - Generate with: `openssl rand -base64 32`
   - Or use: https://generate-secret.vercel.app/32

3. **Google OAuth Credentials**
   ```env
   GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
   ```
   - Get from: https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`

#### 🟡 Important (For Media Features)

4. **Mux Credentials** (for video streaming)
   ```env
   MUX_TOKEN_ID=xxxxx
   MUX_TOKEN_SECRET=xxxxx
   ```
   - Get from: https://dashboard.mux.com/settings/access-tokens
   - Create new access token with Video permissions

5. **Cloudinary Credentials** (for image hosting)
   ```env
   CLOUDINARY_CLOUD_NAME=xxxxx
   CLOUDINARY_API_KEY=xxxxx
   CLOUDINARY_API_SECRET=xxxxx
   ```
   - Get from: https://cloudinary.com/console
   - Sign up for free account
   - Copy from Dashboard

#### 🟢 Optional (For Email Features)

6. **SMTP Credentials** (for email verification)
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```
   - For Gmail: Enable 2FA and create App Password
   - Settings → Security → 2-Step Verification → App passwords

---

## Detailed Setup Instructions

### MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Database Access" → Add new user
5. Click "Network Access" → Add IP Address → Allow from anywhere (0.0.0.0/0)
6. Click "Database" → Connect → Connect your application
7. Copy connection string and replace `<password>` with your user password

### Google OAuth Setup

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API:
   - APIs & Services → Library → Search "Google+ API" → Enable
4. Create OAuth credentials:
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - Application type: Web application
   - Name: Talent Marketplace
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - For production, add: `https://yourdomain.com/api/auth/callback/google`
5. Copy Client ID and Client Secret

### Mux Setup

1. Go to https://mux.com and sign up
2. Navigate to Settings → Access Tokens
3. Click "Generate new token"
4. Select permissions: Mux Video (Read, Write)
5. Copy Token ID and Token Secret
6. For webhooks (optional):
   - Settings → Webhooks → Add new webhook
   - URL: `https://yourdomain.com/api/webhooks/mux`
   - Copy webhook secret

### Cloudinary Setup

1. Go to https://cloudinary.com and sign up
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret
4. (Optional) Create upload preset:
   - Settings → Upload → Upload presets
   - Add upload preset → Unsigned
   - Name: `talent-marketplace-preset`

### SMTP Setup (Gmail Example)

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Select app: Mail
5. Select device: Other (Custom name) → "Talent Marketplace"
6. Copy the 16-character password
7. Use this as `SMTP_PASS` in your `.env.local`

---

## Verification

After setting up your `.env.local`, verify your configuration:

### Check MongoDB Connection
```bash
npm run dev
```
Check console for "Connected to MongoDB" message

### Check Google OAuth
1. Start dev server: `npm run dev`
2. Go to: http://localhost:3000/api/auth/signin
3. You should see "Sign in with Google" button

### Check Mux (when implemented)
Upload a test video and check Mux dashboard for processing status

### Check Cloudinary (when implemented)
Upload a test image and check Cloudinary media library

---

## Environment Variables Reference

### Required for Development
- `MONGODB_URI` - Database connection
- `NEXTAUTH_SECRET` - Authentication security
- `GOOGLE_CLIENT_ID` - Google login
- `GOOGLE_CLIENT_SECRET` - Google login

### Required for Production
All of the above, plus:
- `MUX_TOKEN_ID` - Video streaming
- `MUX_TOKEN_SECRET` - Video streaming
- `CLOUDINARY_CLOUD_NAME` - Image hosting
- `CLOUDINARY_API_KEY` - Image hosting
- `CLOUDINARY_API_SECRET` - Image hosting
- `SMTP_USER` - Email sending
- `SMTP_PASS` - Email sending

### Optional
- `RESEND_API_KEY` - Alternative to SMTP
- `STRIPE_SECRET_KEY` - Payment processing
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Analytics
- `SENTRY_DSN` - Error tracking

---

## Security Best Practices

1. ✅ **Never commit `.env.local`** - It's already in `.gitignore`
2. ✅ **Use different secrets for dev/prod** - Generate new secrets for production
3. ✅ **Rotate secrets regularly** - Change passwords and API keys periodically
4. ✅ **Limit API key permissions** - Only grant necessary permissions
5. ✅ **Use environment-specific URLs** - Different OAuth redirect URIs for dev/prod
6. ✅ **Enable IP whitelisting** - Restrict MongoDB access to known IPs in production

---

## Troubleshooting

### "Invalid MongoDB URI"
- Check connection string format
- Ensure password doesn't contain special characters (URL encode if needed)
- Verify network access is allowed (0.0.0.0/0)

### "Google OAuth Error"
- Verify redirect URI matches exactly (including http/https)
- Check if Google+ API is enabled
- Ensure Client ID and Secret are correct

### "Mux Upload Failed"
- Verify token has Write permissions
- Check token is not expired
- Ensure file size is within limits

### "Cloudinary Upload Failed"
- Verify API credentials are correct
- Check upload preset exists (if using unsigned uploads)
- Ensure file type is allowed

---

## Next Steps

After setting up your environment:

1. ✅ Install dependencies: `npm install`
2. ✅ Start development server: `npm run dev`
3. ✅ Test authentication: http://localhost:3000/api/auth/signin
4. ✅ Check database connection in console logs
5. ✅ Begin development!

---

## Support

If you encounter issues:
- Check the [TECH_STACK.md](./TECH_STACK.md) for detailed architecture
- Review error messages in console
- Verify all required environment variables are set
- Ensure all external services are properly configured

---

**Last Updated:** December 20, 2025

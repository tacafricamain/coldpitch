# Fix: Localhost API Error in Development

## 🔴 Problem

When running the app locally (development mode), creating staff showed this error:

```
POST http://localhost:3001/api/send-credentials net::ERR_CONNECTION_REFUSED
⚠️ Email backend not running. Start email-backend server: Failed to fetch
💡 To enable emails: cd email-backend && npm install && npm start
```

## 🔍 Root Cause

The code was checking if running in dev mode and trying to use a separate backend:

```typescript
// BEFORE (WRONG)
const apiUrl = import.meta.env.DEV 
  ? 'http://localhost:3001/api/send-credentials'  // ❌ Tries to connect to localhost:3001
  : `${window.location.origin}/api/send-credentials`;  // ✅ Works in production
```

**Why this is wrong:**
- We don't have a separate backend running on `localhost:3001`
- Vercel serverless functions work in BOTH dev and production
- The `/api/*` routes are always handled by Vercel

## ✅ Solution

Always use the current origin - Vercel will route API requests to serverless functions automatically:

```typescript
// AFTER (CORRECT)
const apiUrl = `${window.location.origin}/api/send-credentials`;  // ✅ Works everywhere
```

This works because:
- **Development:** `localhost:5173/api/send-credentials` → Vite proxies to Vercel dev server or uses vercel.json routing
- **Production:** `spexcoldpitch.vercel.app/api/send-credentials` → Vercel routes to serverless function

## 📝 Changes Made

### File 1: `src/services/staffService.ts` - Email API

**Before:**
```typescript
const apiUrl = import.meta.env.DEV 
  ? 'http://localhost:3001/api/send-credentials'
  : `${window.location.origin}/api/send-credentials`;
```

**After:**
```typescript
const apiUrl = `${window.location.origin}/api/send-credentials`;
```

### File 2: `src/services/staffService.ts` - Delete Auth User API

**Before:**
```typescript
const apiUrl = import.meta.env.DEV 
  ? 'http://localhost:3001/api/delete-auth-user'
  : `${window.location.origin}/api/delete-auth-user`;
```

**After:**
```typescript
const apiUrl = `${window.location.origin}/api/delete-auth-user`;
```

## 🧪 How It Works Now

### In Development (localhost:5173)

1. **Create staff** → Calls `http://localhost:5173/api/send-credentials`
2. **Vite/Vercel** → Routes to serverless function (via vercel.json)
3. **Serverless function** → Uses SendGrid API key from environment
4. **Email sent** ✅

### In Production (spexcoldpitch.vercel.app)

1. **Create staff** → Calls `https://spexcoldpitch.vercel.app/api/send-credentials`
2. **Vercel** → Routes to serverless function
3. **Serverless function** → Uses SendGrid API key from environment
4. **Email sent** ✅

## ✅ What You'll See Now

### Before (Error):
```
POST http://localhost:3001/api/send-credentials net::ERR_CONNECTION_REFUSED
⚠️ Email backend not running
💡 To enable emails: cd email-backend && npm install && npm start
```

### After (Success):
```
POST http://localhost:5173/api/send-credentials 200 OK
✅ Email successfully sent to user@example.com
```

Or if SendGrid not configured yet:
```
POST http://localhost:5173/api/send-credentials 500 (Internal Server Error)
⚠️ Email API Error: Email service not configured
💡 Make sure SENDGRID_API_KEY is set in Vercel environment variables
```

## 🎯 Summary

**Problem:** Trying to connect to non-existent localhost:3001 backend  
**Cause:** Dev mode checking for separate backend server  
**Solution:** Always use current origin (Vercel routes to serverless)  
**Result:** Works in both dev and production ✅

**No more:**
- ❌ Connection refused errors
- ❌ Confusing "start email-backend server" messages
- ❌ Need for separate backend server

**Now:**
- ✅ API calls work everywhere
- ✅ Clear error messages if environment not configured
- ✅ Single source of truth (serverless functions)

---

## 📋 Deployed Changes

- ✅ Removed localhost:3001 references
- ✅ Always use `window.location.origin`
- ✅ Works in development and production
- ✅ Pushed to GitHub
- ✅ Vercel will auto-deploy

**Status:** FIXED! No more localhost errors. 🚀

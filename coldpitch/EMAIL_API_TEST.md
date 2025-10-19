# Quick Test Script for Email API

## Test the Vercel Serverless Function

### PowerShell Test Command

```powershell
# Test with your actual email
$body = @{
    to = "your-email@gmail.com"
    name = "Test User"
    password = "TestPass123!"
    loginUrl = "https://spexcoldpitch.vercel.app/login"
} | ConvertTo-Json

# Test Production API
$response = Invoke-RestMethod -Method Post `
  -Uri "https://spexcoldpitch.vercel.app/api/send-credentials" `
  -ContentType "application/json" `
  -Body $body

Write-Host "Response:" -ForegroundColor Green
$response | ConvertTo-Json
```

### Expected Responses

#### Success (200):
```json
{
  "success": true,
  "message": "Email sent to your-email@gmail.com"
}
```

#### Missing Env Var (500):
```json
{
  "error": "Email service not configured"
}
```

#### Invalid API Key (500):
```json
{
  "error": "Failed to send email",
  "message": "...",
  "details": [...]
}
```

#### Unverified Sender (500):
```json
{
  "error": "Failed to send email",
  "message": "The from address does not match a verified Sender Identity"
}
```

## Check Vercel Logs

```bash
# Install Vercel CLI if not already
npm i -g vercel

# Login
vercel login

# View logs
vercel logs https://spexcoldpitch.vercel.app --follow
```

Or visit: https://vercel.com/tacafrica016gmailcoms-projects/spexcoldpitch/logs

## Check Environment Variables

```bash
# List all environment variables (values hidden)
vercel env ls

# Check specific production variables
vercel env ls production
```

Or visit: https://vercel.com/tacafrica016gmailcoms-projects/spexcoldpitch/settings/environment-variables

## Test SendGrid API Key Directly

```powershell
# Replace with your actual SendGrid API key
$apiKey = "SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$senderEmail = "hi@spex.com.ng"
$recipientEmail = "your-email@gmail.com"

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

$body = @{
    personalizations = @(
        @{
            to = @(
                @{
                    email = $recipientEmail
                }
            )
            subject = "SendGrid Test"
        }
    )
    from = @{
        email = $senderEmail
    }
    content = @(
        @{
            type = "text/plain"
            value = "This is a test email from SendGrid API"
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Method Post `
      -Uri "https://api.sendgrid.com/v3/mail/send" `
      -Headers $headers `
      -Body $body
    
    Write-Host "✅ Email sent successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    $_.Exception.Response | ConvertTo-Json
}
```

## Most Likely Issues

### 1. SENDGRID_API_KEY Not Set
**Solution:**
1. Go to https://app.sendgrid.com/settings/api_keys
2. Create API Key with Full Access
3. Copy key (starts with "SG.")
4. Add to Vercel: https://vercel.com/tacafrica016gmailcoms-projects/spexcoldpitch/settings/environment-variables
5. Redeploy: `vercel --prod`

### 2. Sender Email Not Verified
**Solution:**
1. Go to https://app.sendgrid.com/settings/sender_auth
2. Verify Single Sender
3. Add `hi@spex.com.ng` (or your domain)
4. Check email and verify
5. Update SENDER_EMAIL in Vercel if needed
6. Redeploy: `vercel --prod`

### 3. API Function Not Deployed
**Solution:**
```powershell
cd c:\Users\jahs_\Documents\GitHub\lead\coldpitch
git add .
git commit -m "fix: email API error handling"
git push origin main
vercel --prod
```

### 4. Wrong API URL
Check in browser console - should show:
```
https://spexcoldpitch.vercel.app/api/send-credentials
```

NOT:
```
/api/send-credentials  (relative path - won't work)
```

## Debug in Production

1. Open browser console (F12)
2. Go to Network tab
3. Create a staff member
4. Look for request to `/api/send-credentials`
5. Check:
   - Status code (should be 200, not 500)
   - Response body (should be JSON)
   - Request payload (should have to, name, password, loginUrl)

## Quick Verification Steps

- [ ] SendGrid account active
- [ ] API key created and copied
- [ ] Sender email verified
- [ ] Environment variables set in Vercel:
  - [ ] `SENDGRID_API_KEY`
  - [ ] `SENDER_EMAIL`
- [ ] Redeployed after adding env vars
- [ ] Browser shows full URL (not relative path)
- [ ] Network tab shows 200 response (not 500)
- [ ] Email received in inbox

If all checked ✅ and still failing, copy the exact error from Vercel logs!

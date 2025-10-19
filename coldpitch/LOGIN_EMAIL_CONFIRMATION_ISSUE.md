# Login Issue - Email Confirmation Required

## 🔴 Problem

Staff members created via the app cannot login even with correct credentials from the email.

## Root Cause

When `supabase.auth.signUp()` is called, Supabase **requires email confirmation by default**. This means:

1. Auth user is created
2. Supabase sends a confirmation email
3. User MUST click the confirmation link
4. Only then can they login

But we're also sending our own credentials email, which is confusing!

## Solution Options

### Option 1: Disable Email Confirmation (Recommended)

**In Supabase Dashboard:**
1. Go to: Authentication → Email Templates
2. Enable "Disable email confirmations"
3. Users can login immediately without confirmation

**OR via Supabase Settings:**
1. Authentication → Settings
2. "Enable email confirmations" → Toggle OFF

### Option 2: Auto-Confirm on Signup (Code Fix)

We can use `emailRedirectTo` to skip confirmation or use Admin API to auto-confirm.

## Immediate Fix

Since we control the Supabase project, let's use the admin API to auto-confirm users when created by admin.

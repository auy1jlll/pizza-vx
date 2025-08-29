# Gmail SMTP Setup Guide

## Quick Setup Steps:

1. **Enable 2-Factor Authentication** on your Gmail account (if not already enabled)
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Or search "App passwords" in Google Account settings
   - Select "Mail" as the app
   - Generate the password
   - Copy the 16-character password (no spaces)

3. **Update the .env file**:
   - Replace `your-app-password-here` with the generated app password
   - Example: `SMTP_PASS="abcd efgh ijkl mnop"` (keep the quotes)

4. **Test the email**:
   - Restart the development server: `npm run dev`
   - Go to: http://localhost:3005/auth/forgot-password
   - Enter your email: auy1jll@gmail.com
   - Check your Gmail inbox for the password reset email

## Current Configuration:
```
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="auy1jll@gmail.com"
SMTP_PASS="your-app-password-here"  ← Replace this
SMTP_FROM_EMAIL="auy1jll@gmail.com"
SMTP_FROM_NAME="Boston Pizza"
```

## Security Notes:
- Never commit your app password to version control
- Use environment variables for production
- App passwords are safer than your main Gmail password
- You can revoke app passwords anytime from Google Account settings

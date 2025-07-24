## ⚠️ bolt-test-config Module

This module is used **only for development and pre-production environments**.  
It provides temporary Supabase-powered storage for shared settings and testing purposes.

### ✅ What This Module Supports:
- API keys for third-party integrations (QuickBooks, Zapier, Twilio, etc.)
- Email & SMS templates for notification previews
- Feature flags for toggling dev/test features
- Company-level settings and custom fields (temporary persistence)
- Platform admin settings (tenant tracking, branding, integrations)
- Test user flows (MFA, integrations, impersonation, etc.)

### 🚫 Do NOT:
- Use this in production environments
- Depend on this module for critical configuration
- Commit sensitive real API keys or live credentials here

### 🔁 Transition Plan:
When preparing for production:
- Migrate all persistent data to your **Rails/MySQL backend**
- Replace Supabase reads/writes with API endpoints
- Archive this module or limit to QA sandbox
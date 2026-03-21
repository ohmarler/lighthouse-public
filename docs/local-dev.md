# Local Development Guide

This guide is intended for developers who want to run the Lighthouse SEO Dashboard
locally for development, debugging, or contribution purposes.

> **Note**: Local development is not required to use this dashboard. The standard
> setup path in [README.md](../README.md) deploys directly to Vercel without any
> local execution. Follow this guide only if you specifically need to modify the
> application code.

---

## Prerequisites

Complete the full setup in README.md first — you need all credentials, accounts,
and a live Vercel deployment before local development makes sense. Local development
connects to the same Vercel KV database as production.

## Step 1: Create `.env.local`

Create a file named `.env.local` in the project root (this file is gitignored and
will never be committed):

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in all values from your production Vercel environment
variables, with two changes:

| Variable | Production Value | Local Value |
|----------|-----------------|-------------|
| `DASHBOARD_URL` | `https://your-project.vercel.app` | `http://localhost:3000` |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | `http://localhost:3000` |

All other values should be identical to your production configuration.

## Step 2: Add Localhost to Google OAuth

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Click your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, click **Add URI**
4. Add: `http://localhost:3000/api/auth/callback/google`
5. Click **Save**

Keep your production redirect URI — do not remove it.

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run the Development Server

```bash
npm run dev
```

The dashboard is available at `http://localhost:3000`.

**Important**: Local development reads from and writes to the same Vercel KV database
as your production deployment. Changes made locally (completed action items, competitor
config, cached AI insights) will appear in production and vice versa.

If you need isolated local data, create a second Vercel KV database and use its
credentials in `.env.local` instead.

---

## Running Tests

```bash
npm test           # Run all tests once
npm run test:watch # Run tests in watch mode
```

## Type Checking and Linting

```bash
npm run typecheck  # TypeScript validation
npm run lint       # ESLint
npm run verify     # All checks + build (run before submitting a PR)
```

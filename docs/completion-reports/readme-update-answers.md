# README Factual Verification Answers

**Date**: 2026-04-01  
**Source files inspected**: `scripts/`, `package.json`, `lib/config.ts`, `.github/workflows/unlighthouse.yml`, `docs/local-dev.md`, `.gitignore`

---

## 1. Does `scripts/generate-secrets.sh` exist? Windows equivalent?

**Yes — both exist.**

- `scripts/generate-secrets.sh` — Mac/Linux version
- `scripts/generate-secrets.ps1` — Windows PowerShell version

Both are also registered as npm shortcuts in `package.json`:
- `npm run setup:secrets` → runs `bash scripts/generate-secrets.sh`
- `npm run setup:secrets:windows` → runs `powershell -ExecutionPolicy Bypass -File scripts/generate-secrets.ps1`

The README currently tells users to call the scripts directly with `bash scripts/generate-secrets.sh`. The npm shortcuts (`npm run setup:secrets`) are simpler and equally valid — worth using in the README to keep things consistent with `npm run setup:validate`.

---

## 2. Does `package.json` contain a `setup:validate` script?

**Yes.** It runs:

```
node scripts/validate-setup.mjs
```

**What it checks** (from `scripts/validate-setup.mjs`):

Loads `.env.local` (falls back to `.env` with a warning if `.env.local` is absent).

Validates the following as **required** (exits with code 1 if any are missing):

| Variable | Notes |
|----------|-------|
| `TARGET_BASE_URL` | |
| `TARGET_DOMAIN` | |
| `DASHBOARD_URL` | |
| `NEXTAUTH_URL` | |
| `NEXTAUTH_SECRET` | Also validates: must be 32+ characters |
| `GOOGLE_CLIENT_ID` | |
| `GOOGLE_CLIENT_SECRET` | |
| `GOOGLE_ANALYTICS_PROPERTY_ID` | Also validates: must start with `properties/` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | |
| `ANTHROPIC_API_KEY` | |
| `AI_MODEL` | |
| `DATAFORSEO_LOGIN` | |
| `DATAFORSEO_PASSWORD` | |
| `DATAFORSEO_LOCATION_CODE` | |
| `DATAFORSEO_LANGUAGE_CODE` | |
| `CI_UPLOAD_SIGNING_KEY` | Also validates: must be exactly 64 hex characters |
| `KV_REST_API_URL` | Noted as auto-populated by Vercel KV |
| `KV_REST_API_TOKEN` | Noted as auto-populated by Vercel KV |

Also reports the following as **optional** (informational only, no failure):
`SLACK_WEBHOOK_URL`, `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`, `VERCEL_DEPLOY_HOOK`, `ALLOWED_EMAIL_DOMAIN`, `APP_NAME`, `SITE_DESCRIPTION`, `REPORTS_MAX_RUNS`

**Important implication for the README**: The validation script treats `DASHBOARD_URL`, `KV_REST_API_URL`, and `KV_REST_API_TOKEN` as required, but those are only available *after* Vercel deployment (Step 13). The script should be run *after* completing Phase 3, not at the end of Phase 2. The current README placement (end of Phase 2 / Step 12) will produce false failures for those three variables. A partial validation pass after Phase 2 (before Vercel) and a full pass after Phase 3 (once KV and DASHBOARD_URL are known) would be more accurate — or the README should clearly note which variables will still be missing at that point.

---

## 3. Does `docs/local-dev.md` exist?

**Yes.** Contents summary:

The guide explicitly states local development is not required for standard usage — only needed if modifying application code. It covers four steps: (1) copy `.env.example` to `.env.local` and change `DASHBOARD_URL`/`NEXTAUTH_URL` to `http://localhost:3000`; (2) add `http://localhost:3000/api/auth/callback/google` as an additional authorized redirect URI in Google Cloud Console (keeping the production URI — not replacing it); (3) run `npm install`; (4) run `npm run dev`. It also notes that local dev reads from and writes to the same Vercel KV database as production.

---

## 4. What is the actual Next.js version in `package.json`?

**`16.2.1`**

(The CLAUDE.md says "Next.js 16" which matches. React is `19.2.0`.)

---

## 5. GitHub Actions workflow filename and `name:` field?

**Filename**: `.github/workflows/unlighthouse.yml`

**`name:` field in YAML**: `Unlighthouse CI`

This is what appears in the GitHub Actions UI when navigating to the Actions tab and in the left sidebar when selecting workflows.

---

## 6. Is DataForSEO optional?

**No — it is required. The application will refuse to start without it.**

In `lib/config.ts`, the `loadConfig()` function calls `getRequired()` for all four DataForSEO variables:

```typescript
const dataForSeoLogin = getRequired('DATAFORSEO_LOGIN', missing);
const dataForSeoPassword = getRequired('DATAFORSEO_PASSWORD', missing);
const dataForSeoLocationCode = getRequiredNumber('DATAFORSEO_LOCATION_CODE', missing);
const dataForSeoLanguageCode = getRequired('DATAFORSEO_LANGUAGE_CODE', missing);
```

If any are missing, they are added to the `missing[]` array, and the app throws a `CONFIGURATION ERROR` at startup listing all missing variables.

The `validate-setup.mjs` script likewise lists all four as required and exits with code 1 if absent.

**README implication**: The current README (including the rewritten version) correctly describes DataForSEO as required. There is no "run without competitor tracking" mode — despite the feature being described as a "core feature" rather than a baseline requirement, the code enforces it as mandatory.

---

## 7. Is Anthropic/Claude optional in the same way?

**No — also required. The application will refuse to start without it.**

In `lib/config.ts`:

```typescript
const anthropicApiKey = getRequired('ANTHROPIC_API_KEY', missing);
const aiModel = getRequired('AI_MODEL', missing);
```

Additionally, `AI_MODEL` has a format check — if set to a value that does not start with `claude-`, the app throws a `CONFIGURATION ERROR` immediately (before even checking for other missing variables).

The `isAIEnabled()` helper function exists but its own docstring acknowledges: *"In this deployment model, AI configuration is required at startup — if the application is running, this function invariably returns true."*

**README implication**: The README currently frames both Anthropic and DataForSEO as "required for core features" (implying a degraded mode exists without them). This is technically incorrect — the app enforces all of these as hard requirements via `lib/config.ts`. The README framing should be updated to reflect that these are required for the app to start at all, not just for "core features."

---

## 8. Are there any setup scripts beyond secrets generation?

For setup specifically, only two scripts matter:

| Script | npm command | When used |
|--------|-------------|-----------|
| `scripts/generate-secrets.sh` / `.ps1` | `npm run setup:secrets` / `npm run setup:secrets:windows` | Step 9 — generate `NEXTAUTH_SECRET` and `CI_UPLOAD_SIGNING_KEY` |
| `scripts/validate-setup.mjs` | `npm run setup:validate` | Step 12 — validate all env vars before deploying |

All other scripts in `scripts/` are used by the GitHub Actions CI workflow or are debugging utilities:

| Script | Purpose | Run by |
|--------|---------|--------|
| `extract-urls.mjs` | Generate URL list from sitemap | CI workflow (`npm run urls`) |
| `scan.mjs` | Run Unlighthouse scan | CI workflow (`npm run scan:mobile/desktop`) |
| `publish.mjs` | Copy scan results to `public/reports/` | CI workflow (`npm run publish`) |
| `upload-reports.mjs` | Upload reports to Vercel KV | CI workflow (`node scripts/upload-reports.mjs`) |
| `detect-regression.mjs` | Compare scores against threshold | CI workflow (`npm run check-regression`) |
| `notify-slack.mjs` | Send Slack notification | CI workflow (`npm run notify`) |
| `test-apis.mjs` | Test all external API connections | Manual debugging (`npm run test:apis`) |
| `diagnose-apis.mjs` | Detailed API diagnostics | Manual debugging only |
| `diagnose-search-console.mjs` | Search Console diagnostics | Manual debugging only |
| `verify-public-ready.mjs` | Check no company content in tracked files | Release validation (`npm run verify`) |

`test-apis.mjs` (via `npm run test:apis`) could be a useful post-setup verification step — it tests live connections to all configured external APIs. It is not currently mentioned in the README setup flow.

---

## 9. `workflow_dispatch` inputs?

The `workflow_dispatch:` trigger in `.github/workflows/unlighthouse.yml` has **no `inputs:` block**. It is declared as:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2AM UTC
  workflow_dispatch:
  repository_dispatch:
    types: [manual-scan]
```

When a user clicks "Run workflow" in the GitHub Actions UI, no configuration options are presented. The scan runs with defaults — it uses whatever secrets are configured in the repository.

**Competitor analysis note**: The workflow YAML contains this comment: *"Competitor analysis is triggered automatically by the dashboard when viewing the Competitors tab or can be manually refreshed from the UI. The /api/competitors endpoint requires session authentication and cannot be called from GitHub Actions."*

This means competitor analysis is **entirely dashboard-driven** (not CI-driven) and has nothing to do with the GitHub Actions trigger. The README correctly notes this, but the old README previously implied there was a "competitor analysis" option in the manual trigger UI — that was inaccurate.

---

## 10. Is `.env.local` already in `.gitignore`?

**Yes — twice over.**

The `.gitignore` contains two patterns that cover `.env.local`:

```
.env.*          # line 36 — matches .env.local
.env*.local     # line 38 — also matches .env.local
```

The `!.env.example` exception on line 37 correctly carves out the example file.

So `.env.local` is definitely gitignored. Users do not need to manually add it.

---

## Summary of README Corrections Needed

| Issue | Severity |
|-------|----------|
| `validate-setup` will fail for `DASHBOARD_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` when run at end of Phase 2 (those aren't available until Phase 3) | Medium — confusing for users |
| DataForSEO and Anthropic framed as "core feature" prerequisites, not hard app requirements | Low — functionally correct but imprecise |
| Setup steps call `bash scripts/generate-secrets.sh` directly — could use `npm run setup:secrets` for consistency | Low — both work |
| Workflow_dispatch has no inputs — any mention of configuring the manual trigger is inaccurate | Low — currently handled correctly in rewrite |

# Completion Report: GitHub Account Sequencing Fix

**Date**: 2026-04-01
**Scope**: Fix sequencing bug where Step 1 required GitHub before account was created in Step 3

---

## Summary of Changes

### 1. Step 0A and Step 0B Created

**Step 0A: Create Your GitHub Account** — added as `### Step 0A` under the new "Before You Start — Complete These First" section.
- "Why first?" rationale note added
- Full GitHub account creation `<details>` block moved verbatim from old Phase 1 Step 3
- Fast-path for users who already have an account
- Checklist: GitHub account created/confirmed, signed in
- Checkpoint: GitHub account ready ✓

**Step 0B: Install Required Software** — added as `### Step 0B` under the new section.
- Reframed as active task ("Install both tools now and confirm they work")
- All 3 existing `<details>` blocks moved verbatim: terminal guide, Git installation, Node.js installation
- Quick-check code block added: `git --version` / `node --version`
- "command not found" guidance added ✓

### 2. Step 3 (GitHub Account) Removed from Phase 1

The `#### Step 3: GitHub Account — Free` section and its trailing `---` separator were removed from Phase 1. Phase 1 now begins directly with what was Step 4 (Google Cloud Account), renumbered to Step 3. ✓

### 3. Costs Section Relocated

`## Costs` (previously a standalone top-level section between `## How It Works` and `## Before You Start`) was removed from its original location and moved as `### Costs` under the new "Before You Start — Complete These First" section. Heading level changed from `##` to `###`; sub-headings changed from `###` to `####`. Content unchanged. ✓

### 4. Pre-condition Notice Added to Step 1

Added before `##### Part A:` in Step 1:
```
> **Pre-condition**: You must be signed in to GitHub before starting this
> step. If you haven't created your GitHub account yet, go back to
> [Step 0A: Create Your GitHub Account](#step-0a-create-your-github-account)
> and complete it first.
```
No other Step 1 content was changed. ✓

### 5. Table of Contents Updated

- Removed standalone `[Costs](#costs)` entry
- Updated `[Before You Start](#before-you-start)` to `[Before You Start — Complete These First](#before-you-start--complete-these-first)`
- Added two indented sub-entries under Before You Start for Step 0A and Step 0B ✓

---

## Step Renumbering Table

| Old Step | New Step | Name |
|----------|----------|------|
| Step 1 | Step 1 | Download the Template and Push to GitHub |
| Step 2 | Step 2 | Create Your .env.local File |
| Step 3 (removed) | Step 0A | GitHub Account (moved to Before You Start) |
| Step 4 | Step 3 | Google Cloud Account |
| Step 5 | Step 4 | Anthropic Account |
| Step 6 | Step 5 | DataForSEO Account |
| Step 7 | Step 6 | Vercel Account |
| Step 8 | Step 7 | Google Analytics Setup |
| Step 9 | Step 8 | Configure Target Site |
| Step 10 | Step 9 | Generate Secrets |
| Step 11 | Step 10 | Set Up Google OAuth |
| Step 12 | Step 11 | Set Up Google Analytics + Search Console |
| Step 13 | Step 12 | Validate Your Configuration |
| Step 14 | Step 13 | Deploy to Vercel |
| Step 15 | Step 14 | Upload Environment Variables to Vercel |
| Step 16 | Step 15 | Verify Full Configuration |
| Step 17 | Step 16 | Update Google OAuth Redirect URI |
| Step 18 | Step 17 | Configure GitHub Actions |
| Step 19 | Step 18 | Test Live API Connections |
| Step 20 | Step 19 | Run Your First Scan |
| Step 21 | Step 20 | Verify Dashboard Features |

**Final step count**: 20 numbered steps (Steps 1–20) plus Steps 0A and 0B in Before You Start.

---

## Complete Inline Cross-Reference Audit

Every "Step N" occurrence in the document body was reviewed. Changes applied (old → new):

| Location | Old text | New text |
|----------|----------|----------|
| Setup Guide CI_UPLOAD_SIGNING_KEY callout | `(Step 15)` | `(Step 14)` |
| Setup Guide CI_UPLOAD_SIGNING_KEY callout | `(Step 18)` | `(Step 17)` |
| Setup Guide CI_UPLOAD_SIGNING_KEY callout | `Step 10` | `Step 9` |
| Step 9 (Generate Secrets) body | `Step 15 (Vercel) and Step 18 (GitHub)` | `Step 14 (Vercel) and Step 17 (GitHub)` |
| Step 9 body | `before Step 18` | `before Step 17` |
| Step 9 body (Action Required list) | `Vercel environment variables (Step 15)` | `Vercel environment variables (Step 14)` |
| Step 9 body (Action Required list) | `GitHub repository secrets (Step 18)` | `GitHub repository secrets (Step 17)` |
| Step 10 (OAuth) timing note | `in Step 17 (after Vercel deployment)` | `in Step 16 (after Vercel deployment)` |
| Step 10 timing note | `NOW (Step 11)` | `NOW (Step 10)` |
| Step 10 timing note | `LATER (Step 17)` | `LATER (Step 16)` |
| Step 10 timing note | `until Step 14. Don't worry` | `until Step 13. Don't worry` |
| Step 10 checklist | `will add later in Step 17` | `will add later in Step 16` |
| Step 7 (GA) bridge note | `configured in Step 12` | `configured in Step 11` |
| Step 12 (Validate) partial check note | `deploy to Vercel (Step 15)` | `deploy to Vercel (Step 14)` |
| Step 12 checkpoint | `resolved in Step 15` | `resolved in Step 14` |
| Step 12 intro | `added credentials in Steps 4–12` | `added credentials in Steps 3–11` |
| Step 13 (Deploy) failure note | `Step 15 and redeploy` | `Step 14 and redeploy` |
| Step 14 (Upload) verify success | `that's Step 17` | `that's Step 16` |
| Step 14 CI key callout | `to GitHub (Step 18)` | `to GitHub (Step 17)` |
| Step 15 (Verify) validation failures | `Step 15)` | `Step 14)` |
| Step 15 validation failures | `Step 14` (KV storage) | `Step 13` |
| Step 15 validation failures | `Step 14` (DASHBOARD_URL) | `Step 13` |
| Step 16 (OAuth redirect) returning note | `Returning from Step 11` | `Returning from Step 10` |
| Step 16 returning note | `Vercel URL from Step 14` | `Vercel URL from Step 13` |
| Step 16 redirect URI instruction | `exact URL from Step 14` | `exact URL from Step 13` |
| Troubleshooting table (Step 20) | `Step 17 — verify exact URL` | `Step 16 — verify exact URL` |
| Troubleshooting table | `Step 18 — copy from Vercel` | `Step 17 — copy from Vercel` |
| Advanced Configuration anchor | `[Step 18](#step-18-configure-github-actions)` | `[Step 17](#step-17-configure-github-actions)` |
| Required Variables Reference intro | `Steps 1–18 and validated in Step 16` | `Steps 1–17 and validated in Step 15` |

### Required Variables Reference Table

| Variable | Old Source | New Source |
|----------|-----------|-----------|
| `DASHBOARD_URL` | Vercel (Step 14) | Vercel (Step 13) |
| `NEXTAUTH_SECRET` | Generated (Step 10) | Generated (Step 9) |
| `CI_UPLOAD_SIGNING_KEY` | Generated (Step 10) | Generated (Step 9) |
| `GOOGLE_CLIENT_ID` | Google Cloud (Step 11) | Google Cloud (Step 10) |
| `GOOGLE_CLIENT_SECRET` | Google Cloud (Step 11) | Google Cloud (Step 10) |
| `KV_REST_API_URL` | Vercel KV (Step 14) | Vercel KV (Step 13) |
| `KV_REST_API_TOKEN` | Vercel KV (Step 14) | Vercel KV (Step 13) |
| `ANTHROPIC_API_KEY` | Anthropic (Step 5) | Anthropic (Step 4) |
| `DATAFORSEO_LOGIN` | DataForSEO (Step 6) | DataForSEO (Step 5) |
| `DATAFORSEO_PASSWORD` | DataForSEO (Step 6) | DataForSEO (Step 5) |
| `GOOGLE_ANALYTICS_PROPERTY_ID` | Google Analytics (Step 8/12) | Google Analytics (Step 7/11) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Google Cloud (Step 12) | Google Cloud (Step 11) |

### References Intentionally Unchanged

| Location | Text | Reason |
|----------|------|--------|
| Step 1 Part C | `[Before You Start](#before-you-start)` | Task constraint: "Do not change anything else in Step 1." Backward-compatible `<a id="before-you-start"></a>` anchor added above new heading to keep this link working. |
| Step 0A, Step 0B headings | — | New pre-flight steps not in the 1–20 range; no decrement applies |

---

## Table of Contents

TOC now reflects:
- `[Before You Start — Complete These First](#before-you-start--complete-these-first)` with indented sub-entries for Step 0A and Step 0B
- `[Costs](#costs)` entry removed (Costs now nested under Before You Start as `### Costs`)

---

## Deviations

None. All three changes applied exactly as specified.

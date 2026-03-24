# Lighthouse SEO Dashboard — Repository Audit Report

**Audit Date**: 2026-03-23
**Auditor**: Roo Code (AI-assisted static analysis)
**Repository**: ohmarler/lighthouse-public
**Purpose**: Pre-release readiness assessment for distribution to non-technical business owners

---

## Executive Summary

This repository is **not ready for distribution as-is** to zero-context, non-technical business owners. The primary setup path in [`README.md`](README.md:387) has already been moved substantially toward the intended ZIP-download workflow, and several dependency-ordering and troubleshooting sections are strong. However, the required public documentation set still contains multiple stale fork-based and `.env`-based assumptions, the GitHub Actions instructions describe a workflow name and manual-run UI that do not exist in the actual workflow, and the setup validator in [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:13) reads the wrong environment file while skipping runtime-required KV variables. In its current state, a first-time business owner could get blocked, follow contradictory instructions, or believe setup is valid when the deployed app will still fail at runtime.

---

## Overall Readiness Score

| Category | Status | Priority |
|----------|--------|----------|
| Repository structure clarity | ⚠️ Needs attention | P2 |
| README — Fork vs ZIP download path | ⚠️ Needs attention | P1 |
| README — Account setup completeness | ⚠️ Needs attention | P1 |
| README — Environment variable coverage | ⚠️ Needs attention | P1 |
| README — Step dependency ordering | ✅ Ready | P2 |
| README — Language accessibility | ⚠️ Needs attention | P1 |
| README — Error recovery coverage | ✅ Ready | P2 |
| Supporting documentation completeness | ❌ Blocking | P0 |
| GitHub Actions workflow accuracy | ❌ Blocking | P0 |
| Code/config alignment | ⚠️ Needs attention | P1 |
| Licensing and usage clarity | ⚠️ Needs attention | P2 |
| Validation script accuracy | ❌ Blocking | P0 |

---

## Blocking Issues (Must Fix Before Distribution)

### 1. Setup validator reads the wrong file and does not validate all runtime-required variables

- **Severity**: Blocking
- **Location**: [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:13), [`README.md`](README.md:1313), [`lib/config.ts`](lib/config.ts:175)
- **Function / symbol / config section involved**: [`loadConfig()`](lib/config.ts:175), required variable list in [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:39), Step 12 “Validate Your Configuration” in [`README.md`](README.md:1313)
- **Why it matters**: The README instructs users to create `.env.local`, but the validator loads only `.env` from disk at [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:14). A user can therefore follow the README exactly and still fail validation. Separately, [`lib/config.ts`](lib/config.ts:186) and [`lib/config.ts`](lib/config.ts:187) require KV_REST_API_URL and KV_REST_API_TOKEN at runtime, but the validator never checks them. The validator also only checks presence, while the README claims it validates formats such as secret length at [`README.md`](README.md:1354).
- **Impact**: Users can be blocked before deployment, or worse, get a false pass and hit runtime configuration errors after deployment.
- **How to verify**:
  1. Follow [`README.md`](README.md:589) and create only `.env.local`.
  2. Run the validator via Step 12 in [`README.md`](README.md:1319).
  3. Observe that [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:14) looks for `.env`, not `.env.local`.
  4. Compare required runtime vars in [`lib/config.ts`](lib/config.ts:179) through [`lib/config.ts`](lib/config.ts:195) against the validator list in [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:39) through [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:56).
- **Exact recommended change**:
  - Update [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:14) to load `.env.local` first and only fall back to `.env` if intentionally supported.
  - Add KV_REST_API_URL and KV_REST_API_TOKEN to the required validation list.
  - Either add actual format validation for NEXTAUTH_SECRET, CI_UPLOAD_SIGNING_KEY, AI_MODEL, and GOOGLE_ANALYTICS_PROPERTY_ID, or downgrade the README wording in [`README.md`](README.md:1324) through [`README.md`](README.md:1362) so it no longer claims stronger validation than the script performs.
  - Replace every `.env` reference in validator output with `.env.local`.

### 2. GitHub Actions instructions point users to a workflow name and manual-run options that do not exist

- **Severity**: Blocking
- **Location**: [`README.md`](README.md:1837), [`docs/github-actions.md`](docs/github-actions.md:191), [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:1)
- **Function / symbol / config section involved**: [`workflow_dispatch`](.github/workflows/unlighthouse.yml:6), Step 17 “Run Your First Scan” in [`README.md`](README.md:1837), “Run Your First Scan” in [`docs/github-actions.md`](docs/github-actions.md:202)
- **Why it matters**: The actual workflow is named **Unlighthouse CI** at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:1), but README and docs tell users to click **Lighthouse Scan** at [`README.md`](README.md:1844) and [`docs/github-actions.md`](docs/github-actions.md:199). They also instruct users to check a “Run competitor analysis” box at [`README.md`](README.md:1847) and [`docs/github-actions.md`](docs/github-actions.md:212), but the workflow defines no manual inputs at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:6). The workflow comments explicitly say competitor analysis is handled in the dashboard at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:112).
- **Impact**: A non-technical user may be unable to find the workflow or may stop when the documented checkbox is missing.
- **How to verify**:
  1. Open the workflow file at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:1).
  2. Confirm the workflow name is “Unlighthouse CI”.
  3. Confirm [`workflow_dispatch`](.github/workflows/unlighthouse.yml:6) has no inputs.
  4. Compare that with the README instructions at [`README.md`](README.md:1841) through [`README.md`](README.md:1848).
- **Exact recommended change**:
  - Choose one of two paths and apply it consistently:
    - **Documentation-first fix**: Update [`README.md`](README.md:1837) and [`docs/github-actions.md`](docs/github-actions.md:202) to use the real workflow name, remove the competitor-analysis checkbox language, and update step names to match the actual job and step labels.
    - **Workflow-first fix**: Rename the workflow to “Lighthouse Scan” and add a real manual input for competitor analysis to [`workflow_dispatch`](.github/workflows/unlighthouse.yml:6), then wire that input into the pipeline.

### 3. Required setup docs still assume fork/clone flow and `.env`, conflicting with the public ZIP-download path

- **Severity**: Blocking
- **Location**: [`docs/google-oauth.md`](docs/google-oauth.md:5), [`docs/anthropic.md`](docs/anthropic.md:5), [`docs/dataforseo.md`](docs/dataforseo.md:5), [`docs/google-analytics.md`](docs/google-analytics.md:5), [`docs/github-actions.md`](docs/github-actions.md:21)
- **Function / symbol / config section involved**: “When to Use This Guide” / “Prerequisites” sections in each doc, plus “Add to Your .env File” sections at [`docs/google-oauth.md`](docs/google-oauth.md:242), [`docs/anthropic.md`](docs/anthropic.md:98), [`docs/dataforseo.md`](docs/dataforseo.md:136), and [`docs/google-analytics.md`](docs/google-analytics.md:368)
- **Why it matters**: The README sends users into these docs for mandatory setup tasks, but the docs still say the user forked the repo, cloned it locally, or should edit `.env`. In the public distribution model, those assumptions are wrong.
- **Impact**: Users are given contradictory instructions inside the required setup flow, which is likely to trigger support requests or abandoned setup.
- **How to verify**:
  1. Start in [`README.md`](README.md:701), [`README.md`](README.md:821), [`README.md`](README.md:1128), or [`README.md`](README.md:1252).
  2. Open the linked doc and compare its prerequisites to the ZIP-based setup path in [`README.md`](README.md:387) through [`README.md`](README.md:585) and the `.env.local` flow in [`README.md`](README.md:589) through [`README.md`](README.md:632).
- **Exact recommended change**:
  - Perform a full consistency sweep across all required docs.
  - Replace fork / clone phrasing with either “your GitHub repository” or the explicit ZIP → unzip → git init → push path.
  - Replace `.env` with `.env.local` in all user-facing steps.
  - Correct stale README step references so each doc points to the current numbered step.

---

## Significant Issues (Should Fix Before Distribution)

### 1. README Step 11 is incomplete for Search Console and partly inaccurate for service-account JSON preparation

- **Severity**: Important
- **Location**: [`README.md`](README.md:1246), [`README.md`](README.md:1275), [`docs/google-analytics.md`](docs/google-analytics.md:115), [`docs/google-analytics.md`](docs/google-analytics.md:237)
- **Function / symbol / config section involved**: Step 11 “Set Up Google Analytics + Search Console” in [`README.md`](README.md:1246)
- **Why it matters**: The step title promises both Analytics and Search Console, but the quick steps never tell the user to create and verify a Search Console property. The same quick path says the downloaded JSON is “one long line” at [`README.md`](README.md:1277), while the detailed guide correctly explains that the Google JSON must be minified and the `\n` escapes preserved at [`docs/google-analytics.md`](docs/google-analytics.md:241).
- **Impact**: Users can finish setup with Search Console non-functional or paste malformed GOOGLE_SERVICE_ACCOUNT_JSON.
- **How to verify**:
  1. Read Step 11 in [`README.md`](README.md:1246) through [`README.md`](README.md:1307).
  2. Compare it with the Search Console setup in [`docs/google-analytics.md`](docs/google-analytics.md:115) through [`docs/google-analytics.md`](docs/google-analytics.md:149).
  3. Compare the JSON guidance in [`README.md`](README.md:1275) through [`README.md`](README.md:1295) with the minification warning in [`docs/google-analytics.md`](docs/google-analytics.md:237) through [`docs/google-analytics.md`](docs/google-analytics.md:293).
- **Exact recommended change**:
  - Add an explicit Search Console property creation + verification sub-step to Step 11.
  - Replace the “it’s one long line” claim with a mandatory minification instruction, or explicitly require the detailed guide before returning to README.

### 2. The README still contains renamed-folder and clone-language leftovers after the ZIP workflow rewrite

- **Severity**: Important
- **Location**: [`README.md`](README.md:100), [`README.md`](README.md:1017)
- **Function / symbol / config section involved**: “Clean-Room Setup” section and Step 9 “Generate Secrets” in [`README.md`](README.md:1011)
- **Why it matters**: The Clean-Room section still says “clean clone” at [`README.md`](README.md:102), while Step 9 tells users to run `cd lighthouse-public` at [`README.md`](README.md:1019) even though Step 1 told them to rename the folder.
- **Impact**: Users who copy commands literally can land in the wrong directory or assume they should clone the repo instead of using the ZIP download.
- **How to verify**:
  1. Follow Step 1 in [`README.md`](README.md:387) through [`README.md`](README.md:553).
  2. Then follow Step 9 in [`README.md`](README.md:1011) through [`README.md`](README.md:1027).
  3. Observe the folder-name mismatch.
- **Exact recommended change**:
  - Replace “clone” wording in the Clean-Room section with ZIP-download language.
  - Replace `cd lighthouse-public` with either `cd YOUR-CHOSEN-NAME` or a reminder that the command must use the user’s renamed folder.

### 3. The root setup path does not explicitly tell non-technical users which files and folders they can safely ignore

- **Severity**: Important
- **Location**: [`README.md`](README.md:346), [`CONTRIBUTING.md`](CONTRIBUTING.md:1), [`LICENSE`](LICENSE:1)
- **Function / symbol / config section involved**: repository entry-point organization in the root
- **Why it matters**: A ZIP-opened root still contains developer-facing material such as [`CONTRIBUTING.md`](CONTRIBUTING.md:1) and implementation folders that a business owner does not need to touch.
- **Impact**: This increases cognitive load immediately after unzipping the template.
- **How to verify**:
  1. Open the repository root listing.
  2. Note that the README does not contain a simple “For setup, only use these files” box near the top.
- **Exact recommended change**:
  - Add a short “If you are setting this up for your own business, focus only on…” box near the top of [`README.md`](README.md:12).
  - Explicitly tell users to ignore app, components, lib, scripts, and [`CONTRIBUTING.md`](CONTRIBUTING.md:1) unless they are modifying code.

### 4. The GitHub Actions guide still uses the template repository name for manual-trigger configuration

- **Severity**: Important
- **Location**: [`docs/github-actions.md`](docs/github-actions.md:221)
- **Function / symbol / config section involved**: “Trigger from Dashboard” / “Dashboard Trigger Button” sections
- **Why it matters**: The example for GITHUB_REPO_NAME is `lighthouse-public` and is described as “Your forked repository name” at [`docs/github-actions.md`](docs/github-actions.md:225). In the actual distribution flow, the user creates a brand-new repo with a new name.
- **Impact**: Optional but user-visible features such as the “Trigger Scan” button can be misconfigured even when the user copies the guide exactly.
- **How to verify**:
  1. Read the Step 1 repository naming instructions in [`README.md`](README.md:439).
  2. Compare them with the examples in [`docs/github-actions.md`](docs/github-actions.md:221).
- **Exact recommended change**:
  - Replace the example with a neutral placeholder such as `your-chosen-repo-name` and remove the word “forked”.

### 5. Optional docs still contain leftover fork-based language

- **Severity**: Important
- **Location**: [`docs/slack.md`](docs/slack.md:175)
- **Function / symbol / config section involved**: “Navigate to Repository Secrets” in the Slack guide
- **Why it matters**: Although Slack is optional, the guide still says “the fork of lighthouse-public”.
- **Impact**: Optional enhancements reintroduce old assumptions and reduce trust in the setup material.
- **How to verify**: Read [`docs/slack.md`](docs/slack.md:169) through [`docs/slack.md`](docs/slack.md:197).
- **Exact recommended change**: Replace fork wording with “your GitHub repository” and align any repository-name examples with the README naming flow.

### 6. Licensing is technically present but not explained in plain English for end users

- **Severity**: Important
- **Location**: [`README.md`](README.md:2583), [`LICENSE`](LICENSE:1)
- **Function / symbol / config section involved**: License section in [`README.md`](README.md:2583)
- **Why it matters**: A non-technical business owner downloading a public template needs to know what they can do with it, whether they can modify it, and what obligations they must keep.
- **Impact**: Ambiguity here increases legal hesitation and support questions.
- **How to verify**:
  1. Read the license section in [`README.md`](README.md:2583) through [`README.md`](README.md:2585).
  2. Compare it with the full Apache legal text in [`LICENSE`](LICENSE:1).
- **Exact recommended change**:
  - Add a short plain-English “What Apache 2.0 means for you” section to [`README.md`](README.md:2583) explaining that users may use, modify, and redeploy the template, must keep license/notice files, and receive no warranty.

### 7. Several README instructions still assume technical command-line fluency

- **Severity**: Important
- **Location**: [`README.md`](README.md:490), [`README.md`](README.md:517), [`README.md`](README.md:618), [`README.md`](README.md:1017), [`README.md`](README.md:1517), [`README.md`](README.md:1677), [`README.md`](README.md:2121)
- **Function / symbol / config section involved**: Steps 1, 2, 9, 14, and Troubleshooting in [`README.md`](README.md:370)
- **Why it matters**: The target audience has never used a terminal, GitHub Actions, Vercel, or cloud consoles before.
- **Impact**: Even correct technical steps can become failure points if command syntax is not translated into plain-language actions.
- **How to verify**: Review the sample audit table in Section 2.5 below.
- **Exact recommended change**:
  - Replace low-value shell verification commands with UI-based checks where possible.
  - Where shell commands remain necessary, explain every non-obvious token in plain English directly under the command.

---

## Minor Issues (Nice to Fix)

### 1. The “Clean-Room Setup” section still says “clean clone” even though the supported path is ZIP download

- **Severity**: Optional
- **Location**: [`README.md`](README.md:100)
- **Recommended fix**: Replace “clean clone” with “fresh ZIP download” or “fresh copy of the template”.

### 2. Part numbering skips from Part 3 to Part 5 in the status copy after GitHub Actions setup

- **Severity**: Optional
- **Location**: [`README.md`](README.md:1800)
- **Recommended fix**: Change the “What’s next” text so it explicitly says Part 4 is optional and Part 5 is the next required verification step.

### 3. The GitHub Actions guide repeats “Step 3” for two different sections

- **Severity**: Optional
- **Location**: [`docs/github-actions.md`](docs/github-actions.md:191), [`docs/github-actions.md`](docs/github-actions.md:202)
- **Recommended fix**: Renumber the second heading.

### 4. Default-value comments are inconsistent across runtime config and script-level config

- **Severity**: Optional
- **Location**: [`lib/config.ts`](lib/config.ts:87), [`lib/config.ts`](lib/config.ts:268), [`scripts/publish.mjs`](scripts/publish.mjs:11), [`scripts/detect-regression.mjs`](scripts/detect-regression.mjs:6), [`.env.example`](.env.example:184)
- **Recommended fix**: Align the documented defaults for REGRESSION_THRESHOLD and KEEP_RUNS across code comments, script defaults, and `.env.example`.

### 5. Contributor docs use a stale repository name for clone instructions

- **Severity**: Optional
- **Location**: [`CONTRIBUTING.md`](CONTRIBUTING.md:58)
- **Recommended fix**: Replace `lighthouse-seo-dashboard` with the current repository name or use neutral placeholders.

### 6. An ignored internal guide still contains old fork / `.env` assumptions

- **Severity**: Optional
- **Location**: [`docs/clean-room.md`](docs/clean-room.md:3), [`.gitignore`](.gitignore:66)
- **Recommended fix**: Either update the ignored guide for internal consistency or delete it to prevent accidental future reintroduction of stale instructions.

---

## Confirmed Correct (No Action Needed)

- ✅ The main README now contains an explicit ZIP-download → unzip → rename → `git init` → push flow at [`README.md`](README.md:387).
- ✅ The README explains how to create a GitHub account and a brand-new repository at [`README.md`](README.md:393) and [`README.md`](README.md:506).
- ✅ The dependency order for OAuth is correct: Step 10 leaves redirect URIs blank at [`README.md`](README.md:1195), and Step 15 adds the real Vercel callback after deployment at [`README.md`](README.md:1691).
- ✅ The CI_UPLOAD_SIGNING_KEY two-location requirement is strongly documented in the README at [`README.md`](README.md:378), [`README.md`](README.md:1059), [`README.md`](README.md:1739), and [`README.md`](README.md:2071).
- ✅ KV auto-population failure and reconnect recovery are documented in both README and the Vercel guide at [`README.md`](README.md:1601) and [`docs/vercel-kv-setup.md`](docs/vercel-kv-setup.md:134).
- ✅ First-run empty-state expectations for AI insights, Search Console, and competitors are clearly documented at [`README.md`](README.md:1962).
- ✅ [`docs/google-oauth.md`](docs/google-oauth.md:131) does include separate Workspace/Internal and Gmail/External + test-user branches.
- ✅ [`docs/anthropic.md`](docs/anthropic.md:124) does explain billing setup, spending controls, and model deprecation risk.
- ✅ [`docs/dataforseo.md`](docs/dataforseo.md:62) explains the $50 minimum deposit, and [`docs/dataforseo.md`](docs/dataforseo.md:97) explains API password vs account password.
- ✅ [`docs/google-analytics.md`](docs/google-analytics.md:237) contains the strongest and most correct explanation of the single-line GOOGLE_SERVICE_ACCOUNT_JSON requirement.
- ✅ [`docs/github-actions.md`](docs/github-actions.md:15) documents the `npm ci` / `package-lock.json` requirement.
- ✅ [`docs/local-dev.md`](docs/local-dev.md:1) is appropriately separated from the end-user path and clearly labeled as developer-only.

---

## Detailed Findings by Section

### Section 1 — Repository Structure Clarity

#### Repository map

| Area | Purpose | Primary entry point |
|------|---------|---------------------|
| Main setup guide | End-user setup path | [`README.md`](README.md:1) |
| Environment template | All runtime and optional configuration variables | [`.env.example`](.env.example:1) |
| Required setup guides | OAuth, Analytics, DataForSEO, Vercel KV, GitHub Actions | [`README.md`](README.md:2440) |
| Deployment automation | Scheduled/manual Lighthouse workflow | [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:1) |
| Runtime configuration | Startup-required environment variables | [`loadConfig()`](lib/config.ts:175) |
| Setup validation | Pre-deploy validator script | [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:1) |
| Developer-only workflow | Local code modification path | [`docs/local-dev.md`](docs/local-dev.md:1) |
| Contributor policy | DCO, CLA, contributor workflow | [`CONTRIBUTING.md`](CONTRIBUTING.md:1) |
| Legal text | Apache 2.0 license | [`LICENSE`](LICENSE:1) |

#### What was checked

- Root tracked files likely included in the GitHub ZIP
- Whether the first thing a user sees tells them what the project is and what to do next
- Whether setup-critical files are obvious
- Whether non-essential developer files are clearly ignorable

#### Findings

- **Positive**: [`README.md`](README.md:1) is easy to discover and already acts as the central setup hub.
- **Positive**: The guide index in [`README.md`](README.md:346) and documentation index in [`README.md`](README.md:2438) do make the important support docs discoverable.
- **Issue**: There is no “Start here / ignore these folders” box near the top of [`README.md`](README.md:12), so a non-technical user who opens the ZIP sees a typical code repository rather than a guided setup kit.
- **Issue**: Root-level files such as [`CONTRIBUTING.md`](CONTRIBUTING.md:1) and [`LICENSE`](LICENSE:1) are legitimate, but they are not contextualized for a business-owner audience.

#### Recommendation

Add a short setup-orientation block near the top of [`README.md`](README.md:12) that says, in plain English, that new users only need [`README.md`](README.md:1), [`.env.example`](.env.example:1), and the linked files under [`docs`](README.md:2440), and may ignore the code folders unless they are modifying the application.

### Section 2 — README.md Completeness and Accuracy

#### 2.1 — Fork vs ZIP download path

- **Confirmed correct**: The core ZIP-download path itself is present and mostly usable in [`README.md`](README.md:453) through [`README.md`](README.md:553).
- **Gap**: The old mental model still leaks into “clean clone” wording at [`README.md`](README.md:102) and the Step 9 `cd lighthouse-public` commands at [`README.md`](README.md:1019).
- **Gap**: The README does explain new repository creation, remote setup, and push at [`README.md`](README.md:506) through [`README.md`](README.md:532), but linked docs still reintroduce fork assumptions.

#### 2.2 — Account setup completeness

| Account / service | README coverage | Audit result |
|-------------------|-----------------|--------------|
| GitHub account + repo creation | [`README.md`](README.md:393) and [`README.md`](README.md:506) | ✅ Strong |
| Vercel account + project import + KV path | [`README.md`](README.md:869) and [`README.md`](README.md:1530) | ✅ Strong |
| Google account | [`README.md`](README.md:249) and [`README.md`](README.md:643) | ⚠️ Basic in README, fuller in [`docs/google-oauth.md`](docs/google-oauth.md:44) |
| Google Cloud Console | [`README.md`](README.md:636) | ✅ Strong |
| Google Analytics 4 | [`README.md`](README.md:936) | ✅ Strong |
| Google Search Console | Step title at [`README.md`](README.md:1246), actual mandatory detail only in [`docs/google-analytics.md`](docs/google-analytics.md:115) | ⚠️ README summary is incomplete |
| Anthropic account + billing | [`README.md`](README.md:687) | ✅ Strong |
| DataForSEO account + $50 deposit | [`README.md`](README.md:805) | ✅ Strong |

#### 2.3 — Environment variable completeness

- **Cross-source conflict**: [`README.md`](README.md:589) uses `.env.local`, while [`.env.example`](.env.example:6) still tells users to copy to `.env`, and required docs still say `.env`.
- **Required runtime coverage**: The Required Variables Reference in [`README.md`](README.md:1494) does list all runtime-required variables from [`lib/config.ts`](lib/config.ts:179) through [`lib/config.ts`](lib/config.ts:195).
- **Weak area**: KV_REST_API_URL and KV_REST_API_TOKEN are documented as auto-populated in [`README.md`](README.md:1578), but they are not part of the Step 12 validation path and are not positioned cleanly in the local-file workflow.
- **Weak area**: Optional workflow-level settings such as KEEP_RUNS and REGRESSION_THRESHOLD are present in [`.env.example`](.env.example:184) but are actually consumed as GitHub Secrets in the workflow via [`scripts/publish.mjs`](scripts/publish.mjs:11) and [`scripts/detect-regression.mjs`](scripts/detect-regression.mjs:6), which is not explained in README.

#### 2.4 — Step dependency ordering

- ✅ Vercel URL before OAuth redirect: handled correctly by leaving redirect URIs blank in Step 10 at [`README.md`](README.md:1195) and filling them in Step 15 at [`README.md`](README.md:1699).
- ✅ CI_UPLOAD_SIGNING_KEY generated before it is reused in Vercel and GitHub: Step 9 at [`README.md`](README.md:1011) precedes Step 14 and Step 16.
- ✅ Vercel environment variables are added before the first successful deployment: Step 13 initial failure at [`README.md`](README.md:1548), Step 14 env upload at [`README.md`](README.md:1612), redeploy at [`README.md`](README.md:1656).
- ✅ GitHub secrets are configured before the first scan: Step 16 at [`README.md`](README.md:1737) precedes Step 17 at [`README.md`](README.md:1837).

#### Setup checklist extracted from docs and README

1. Create accounts: GitHub, Google / Google Cloud, Anthropic, DataForSEO, Vercel, GA4.
2. Download ZIP, unzip, rename the folder, create a new GitHub repository, and push your copy.
3. Create `.env.local` from [`.env.example`](.env.example:1).
4. Add target site values.
5. Generate NEXTAUTH_SECRET and CI_UPLOAD_SIGNING_KEY.
6. Create Google OAuth credentials.
7. Create GA4, Search Console, and service-account access.
8. Validate setup locally.
9. Deploy to Vercel and add KV.
10. Add runtime variables to Vercel and redeploy.
11. Update the Google redirect URI with the real Vercel URL.
12. Add GitHub Actions secrets.
13. Enable workflows and run the first scan.
14. Verify scores, AI insights, competitor data, and analytics.

#### 2.5 — Non-technical language accessibility sample audit

| Sample instruction | Assessment |
|--------------------|------------|
| [`README.md`](README.md:490) — `cd ~/Downloads/YOUR-CHOSEN-NAME` | ⚠️ Uses `~` and terminal path syntax without explaining what `~` means |
| [`README.md`](README.md:517) — `git init`, `git add .`, `git remote add origin`, `git branch -M main`, `git push -u origin main` | ⚠️ Accurate, but too many unexplained git concepts in one block |
| [`README.md`](README.md:559) — `git remote -v` verification | ⚠️ The command is unexplained; “-v” and remote terminology assume git literacy |
| [`README.md`](README.md:618) — `cat .gitignore | grep "env"` | ❌ Unnecessary shell jargon for a business-owner flow |
| [`README.md`](README.md:1024) — `ExecutionPolicy Bypass` | ⚠️ Correct for PowerShell, but not explained in plain English |
| [`README.md`](README.md:1517) — `jq -c .` and `\n` escape discussion | ⚠️ Needed content, but technical and better delegated to the detailed guide only |
| [`README.md`](README.md:1677) — “Check the browser console (F12)” | ⚠️ Developer troubleshooting language in the main business-owner path |
| [`README.md`](README.md:2121) — `curl` Anthropic API test | ⚠️ Useful for developers, not ideal as a primary business-owner recovery step |
| [`docs/google-analytics.md`](docs/google-analytics.md:251) — “Python `json.dumps`” and escape-sequence warnings | ⚠️ Technically valuable, but advanced for the target user |
| [`docs/github-actions.md`](docs/github-actions.md:381) — cron syntax customization | ⚠️ Appropriate as advanced content, not for the primary setup flow |

#### 2.6 — Error recovery coverage

The requested scenarios are mostly covered well:

| Scenario | Coverage |
|----------|----------|
| CI_UPLOAD_SIGNING_KEY mismatch / 401 | ✅ [`README.md`](README.md:1878) and [`README.md`](README.md:2071) |
| GOOGLE_SERVICE_ACCOUNT_JSON formatting errors | ✅ [`README.md`](README.md:2182) and [`docs/google-analytics.md`](docs/google-analytics.md:447) |
| OAuth redirect URI mismatch | ✅ [`README.md`](README.md:1720) and [`README.md`](README.md:2090) |
| KV vars not auto-populated | ✅ [`README.md`](README.md:1601) and [`docs/vercel-kv-setup.md`](docs/vercel-kv-setup.md:134) |
| First scan completes but dashboard shows no data | ✅ [`README.md`](README.md:1935) and [`README.md`](README.md:2160) |
| AI Insights panel empty after first scan | ✅ [`README.md`](README.md:1929) and [`README.md`](README.md:1971) |

### Section 3 — Supporting Documentation Completeness

#### What was checked

- Required docs linked from [`README.md`](README.md:2440)
- Accuracy against the current ZIP-based README path
- Whether each guide is sufficient for its stated job

#### Supporting documentation audit

| File | Audit result |
|------|--------------|
| [`docs/google-oauth.md`](docs/google-oauth.md:1) | ✅ Good Workspace/Gmail branching at [`docs/google-oauth.md`](docs/google-oauth.md:131). ⚠️ Outdated prerequisites, stale `.env` wording, and stale step references at [`docs/google-oauth.md`](docs/google-oauth.md:5), [`docs/google-oauth.md`](docs/google-oauth.md:10), and [`docs/google-oauth.md`](docs/google-oauth.md:244). |
| [`docs/anthropic.md`](docs/anthropic.md:1) | ✅ Billing, limits, and model deprecation are well covered at [`docs/anthropic.md`](docs/anthropic.md:110) and [`docs/anthropic.md`](docs/anthropic.md:124). ⚠️ Prerequisites and `.env` wording are stale at [`docs/anthropic.md`](docs/anthropic.md:5), [`docs/anthropic.md`](docs/anthropic.md:10), and [`docs/anthropic.md`](docs/anthropic.md:98). |
| [`docs/dataforseo.md`](docs/dataforseo.md:1) | ✅ Deposit and API-password distinction are strong at [`docs/dataforseo.md`](docs/dataforseo.md:62) and [`docs/dataforseo.md`](docs/dataforseo.md:99). ⚠️ Still uses `.env` and stale repo/setup wording at [`docs/dataforseo.md`](docs/dataforseo.md:10), [`docs/dataforseo.md`](docs/dataforseo.md:138), and stale main-step reference at [`docs/dataforseo.md`](docs/dataforseo.md:148). |
| [`docs/google-analytics.md`](docs/google-analytics.md:1) | ✅ Best detailed guide in the repo for Google setup, especially the JSON-integrity warning at [`docs/google-analytics.md`](docs/google-analytics.md:241). ⚠️ Still says `.env` and has stale prerequisite / step references at [`docs/google-analytics.md`](docs/google-analytics.md:10), [`docs/google-analytics.md`](docs/google-analytics.md:370), and [`docs/google-analytics.md`](docs/google-analytics.md:386). |
| [`docs/github-actions.md`](docs/github-actions.md:1) | ✅ Documents Actions enablement and `npm ci` requirement at [`docs/github-actions.md`](docs/github-actions.md:15) and [`docs/github-actions.md`](docs/github-actions.md:191). ❌ Still assumes a forked repo, uses clone terminology, uses the wrong workflow name, and documents a nonexistent competitor-analysis checkbox at [`docs/github-actions.md`](docs/github-actions.md:21), [`docs/github-actions.md`](docs/github-actions.md:43), and [`docs/github-actions.md`](docs/github-actions.md:210). |
| [`docs/vercel-kv-setup.md`](docs/vercel-kv-setup.md:1) | ✅ Accurate and useful. It clearly explains reconnecting KV and handling missing variables at [`docs/vercel-kv-setup.md`](docs/vercel-kv-setup.md:134) and [`docs/vercel-kv-setup.md`](docs/vercel-kv-setup.md:157). |
| [`docs/local-dev.md`](docs/local-dev.md:1) | ✅ Appropriate as a separate developer path. It stays out of the main end-user setup flow and warns about shared production KV usage at [`docs/local-dev.md`](docs/local-dev.md:62). |

#### Vercel audit

- ✅ The Vercel project import path in [`README.md`](README.md:1538) is logically ordered.
- ✅ The README correctly expects the first deploy to fail before env vars are added at [`README.md`](README.md:1548).
- ✅ The KV auto-population and reconnect guidance is sufficient in [`README.md`](README.md:1578) and [`docs/vercel-kv-setup.md`](docs/vercel-kv-setup.md:85).
- ⚠️ The biggest Vercel-related gap is not Vercel setup itself, but the fact that local validation does not mirror runtime requirements because the validator omits KV vars.

### Section 4 — GitHub Actions Workflow Accuracy

#### GitHub Actions audit

| Secret / setting | Actual workflow usage | Documentation status | Audit result |
|------------------|-----------------------|----------------------|--------------|
| TARGET_BASE_URL | Required for URL generation at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:48) | Covered in [`README.md`](README.md:1757) and [`docs/github-actions.md`](docs/github-actions.md:150) | ✅ |
| SITEMAP_URL | Optional override at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:58) | Covered in [`README.md`](README.md:1762) and [`docs/github-actions.md`](docs/github-actions.md:162) | ✅ |
| DASHBOARD_URL | Used for upload at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:83) | Covered in [`README.md`](README.md:1761) and [`docs/github-actions.md`](docs/github-actions.md:139) | ✅ |
| CI_UPLOAD_SIGNING_KEY | Used for signed upload at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:84) | Covered in [`README.md`](README.md:1759) and [`docs/github-actions.md`](docs/github-actions.md:118) | ✅ |
| SLACK_WEBHOOK_URL | Optional notification step at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:91) | Covered in [`docs/slack.md`](docs/slack.md:169) | ✅ |
| VERCEL_DEPLOY_HOOK | Optional redeploy at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:102) | Covered in advanced docs at [`docs/github-actions.md`](docs/github-actions.md:330) | ✅ |
| KEEP_RUNS | Passed to publish step at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:70) | Not documented as a GitHub Secret in README or the GitHub Actions guide | ⚠️ |
| REGRESSION_THRESHOLD | Passed to regression step at [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:86) | Not documented as a GitHub Secret in README or the GitHub Actions guide | ⚠️ |

#### Additional findings

- ✅ The workflow does use `npm ci`, and that requirement is documented in [`docs/github-actions.md`](docs/github-actions.md:15).
- ✅ Actions enablement on a new repository is documented in [`docs/github-actions.md`](docs/github-actions.md:191) and reiterated in [`README.md`](README.md:1843).
- ✅ The daily 2 AM UTC schedule is documented in [`README.md`](README.md:2012) and [`docs/github-actions.md`](docs/github-actions.md:9).
- ❌ The workflow name, job references, and manual trigger instructions in docs do not match the actual workflow defined in [`.github/workflows/unlighthouse.yml`](.github/workflows/unlighthouse.yml:1).

### Section 5 — Code Configuration Alignment

#### Required runtime variables from [`loadConfig()`](lib/config.ts:175)

| Variable | Runtime requirement | In [`.env.example`](.env.example:1) | In README setup flow | In Pre-Deployment Checklist | Result |
|----------|---------------------|-------------------|----------------------|-----------------------------|--------|
| TARGET_BASE_URL | [`lib/config.ts`](lib/config.ts:179) | [`.env.example`](.env.example:20) | [`README.md`](README.md:989) | [`README.md`](README.md:1498) | ✅ |
| TARGET_DOMAIN | [`lib/config.ts`](lib/config.ts:180) | [`.env.example`](.env.example:21) | [`README.md`](README.md:990) | [`README.md`](README.md:1499) | ✅ |
| DASHBOARD_URL | [`lib/config.ts`](lib/config.ts:181) | [`.env.example`](.env.example:30) | [`README.md`](README.md:1553) | [`README.md`](README.md:1500) | ✅ |
| NEXTAUTH_URL | [`lib/config.ts`](lib/config.ts:182) | [`.env.example`](.env.example:33) | [`README.md`](README.md:1554) | [`README.md`](README.md:1501) | ✅ |
| NEXTAUTH_SECRET | [`lib/config.ts`](lib/config.ts:183) | [`.env.example`](.env.example:45) | [`README.md`](README.md:1053) | [`README.md`](README.md:1502) | ✅ |
| GOOGLE_CLIENT_ID | [`lib/config.ts`](lib/config.ts:184) | [`.env.example`](.env.example:63) | [`README.md`](README.md:1202) | [`README.md`](README.md:1504) | ✅ |
| GOOGLE_CLIENT_SECRET | [`lib/config.ts`](lib/config.ts:185) | [`.env.example`](.env.example:64) | [`README.md`](README.md:1203) | [`README.md`](README.md:1505) | ✅ |
| KV_REST_API_URL | [`lib/config.ts`](lib/config.ts:186) | [`.env.example`](.env.example:112) | [`README.md`](README.md:1578) | [`README.md`](README.md:1506) | ✅ with validator gap |
| KV_REST_API_TOKEN | [`lib/config.ts`](lib/config.ts:187) | [`.env.example`](.env.example:113) | [`README.md`](README.md:1578) | [`README.md`](README.md:1507) | ✅ with validator gap |
| ANTHROPIC_API_KEY | [`lib/config.ts`](lib/config.ts:188) | [`.env.example`](.env.example:84) | [`README.md`](README.md:786) | [`README.md`](README.md:1508) | ✅ |
| AI_MODEL | [`lib/config.ts`](lib/config.ts:189) | [`.env.example`](.env.example:85) | [`README.md`](README.md:787) | [`README.md`](README.md:1509) | ✅ |
| DATAFORSEO_LOGIN | [`lib/config.ts`](lib/config.ts:190) | [`.env.example`](.env.example:97) | [`README.md`](README.md:843) | [`README.md`](README.md:1510) | ✅ |
| DATAFORSEO_PASSWORD | [`lib/config.ts`](lib/config.ts:191) | [`.env.example`](.env.example:98) | [`README.md`](README.md:844) | [`README.md`](README.md:1511) | ✅ |
| DATAFORSEO_LOCATION_CODE | [`lib/config.ts`](lib/config.ts:192) | [`.env.example`](.env.example:99) | [`README.md`](README.md:845) | [`README.md`](README.md:1512) | ✅ |
| DATAFORSEO_LANGUAGE_CODE | [`lib/config.ts`](lib/config.ts:193) | [`.env.example`](.env.example:104) | [`README.md`](README.md:846) | [`README.md`](README.md:1513) | ✅ |
| GOOGLE_ANALYTICS_PROPERTY_ID | [`lib/config.ts`](lib/config.ts:194) | [`.env.example`](.env.example:71) | [`README.md`](README.md:1290) | [`README.md`](README.md:1514) | ✅ |
| GOOGLE_SERVICE_ACCOUNT_JSON | [`lib/config.ts`](lib/config.ts:195) | [`.env.example`](.env.example:72) | [`README.md`](README.md:1291) | [`README.md`](README.md:1515) | ✅ |

#### Conclusion for Section 5

No runtime-required variable from [`getRequired()`](lib/config.ts:125) or [`getRequiredNumber()`](lib/config.ts:137) is completely missing from all three requested locations. The main problem is **consistency and enforcement**, not total absence:

- The validator omits KV_REST_API_URL and KV_REST_API_TOKEN.
- The validator reads the wrong local file.
- Several required docs still point users at `.env` rather than `.env.local`.

#### Env var and secrets inventory grouped by configuration location

##### Local setup file: `.env.local`

- Created in Step 2 at [`README.md`](README.md:589)
- User-generated or copied values include TARGET_BASE_URL, TARGET_DOMAIN, NEXTAUTH_SECRET, CI_UPLOAD_SIGNING_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ANTHROPIC_API_KEY, AI_MODEL, DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD, DATAFORSEO_LOCATION_CODE, DATAFORSEO_LANGUAGE_CODE, GOOGLE_ANALYTICS_PROPERTY_ID, and GOOGLE_SERVICE_ACCOUNT_JSON.
- DASHBOARD_URL and NEXTAUTH_URL are added after the first Vercel deployment at [`README.md`](README.md:1551).

##### Vercel environment variables

- Manual runtime values are added in Step 14 at [`README.md`](README.md:1612).
- KV_REST_API_URL and KV_REST_API_TOKEN are expected to auto-populate after KV setup at [`README.md`](README.md:1578).
- Optional Vercel-only values include APP_NAME, SITE_DESCRIPTION, ALLOWED_EMAIL_DOMAIN, GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, VERCEL_DEPLOY_HOOK, and REPORTS_MAX_RUNS.

##### GitHub Actions secrets

- Required: CI_UPLOAD_SIGNING_KEY, TARGET_BASE_URL, DASHBOARD_URL, plus conditional SITEMAP_URL at [`README.md`](README.md:1757).
- Optional but real workflow inputs: SLACK_WEBHOOK_URL, VERCEL_DEPLOY_HOOK, KEEP_RUNS, and REGRESSION_THRESHOLD.
- Current docs do not group these workflow-only overrides clearly.

### Section 6 — CONTRIBUTING.md and Licensing

#### What was checked

- Whether licensing is explained in plain English for business-owner users
- Whether contributor docs could confuse non-developers
- Whether a plain-English usage note is missing

#### Findings

- [`LICENSE`](LICENSE:1) contains the full Apache 2.0 text, which is legally correct.
- [`README.md`](README.md:2583) only says “Apache License 2.0 - See LICENSE for details,” which is too terse for the stated target audience.
- [`CONTRIBUTING.md`](CONTRIBUTING.md:1) is clearly a contributor document, but because it sits in the root and opens with DCO / CLA language at [`CONTRIBUTING.md`](CONTRIBUTING.md:7), it is still potentially intimidating for a non-technical user who opens it by mistake.

#### Recommendation

Add a short plain-English “How you may use this template” section to [`README.md`](README.md:2583), and consider explicitly labeling [`CONTRIBUTING.md`](CONTRIBUTING.md:1) as “For developers who want to contribute code back to the project”.

### Section 7 — Scripts Accuracy

#### What was checked

- Whether [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:1) covers the same required environment-variable set as [`loadConfig()`](lib/config.ts:175)
- Whether the output matches what the README says it validates
- Whether the script is invoked at the correct point in the flow

#### Findings

| Check | Audit result |
|------|--------------|
| Loads the same local file the README tells users to create | ❌ No. The script loads `.env` at [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:14), while README instructs `.env.local` at [`README.md`](README.md:589). |
| Checks every runtime-required variable from [`loadConfig()`](lib/config.ts:175) | ❌ No. KV_REST_API_URL and KV_REST_API_TOKEN are missing from the script’s required list at [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:39). |
| Validates secret lengths / formats as claimed in README | ❌ No. The script only checks non-empty values at [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:58), but the README claims length-level validation at [`README.md`](README.md:1354). |
| Gives non-technical users a useful missing-variable list | ✅ Partly. The examples are helpful at [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:61), but the wrong file name in the output makes the guidance misleading. |
| Is invoked at a sensible point in the flow | ⚠️ Partly. Step 12 in [`README.md`](README.md:1313) is the right place for a pre-deploy check, but only if the validator actually mirrors the documented setup model. |

#### Recommendation

Keep the validator in Step 12, but rewrite it so it validates the **current public setup contract** rather than the older `.env`-based model.

---

## Recommended Fix Priority Order

1. **Fix [`scripts/validate-setup.mjs`](scripts/validate-setup.mjs:1) to load `.env.local`, include KV vars, and stop over-claiming validation strength** — **Medium**
2. **Align the GitHub Actions docs and README with the actual workflow name and manual-run UI, or rename the workflow to match the docs** — **Medium**
3. **Sweep all required setup docs to remove fork / clone / `.env` assumptions and correct step references** — **Complex**
4. **Repair README Step 11 so Search Console setup and service-account JSON handling are mandatory and accurate** — **Medium**
5. **Add a short “Start here / ignore these folders” orientation box near the top of [`README.md`](README.md:12)** — **Quick**
6. **Replace remaining renamed-folder leftovers such as `cd lighthouse-public` and “clean clone” wording** — **Quick**
7. **Fix optional-guide leftovers, especially [`docs/github-actions.md`](docs/github-actions.md:221) and [`docs/slack.md`](docs/slack.md:175)** — **Quick**
8. **Document workflow-only optional secrets such as KEEP_RUNS and REGRESSION_THRESHOLD in the correct configuration location** — **Quick**
9. **Add a plain-English Apache 2.0 usage summary for business owners** — **Quick**
10. **Clean up minor numbering, heading, and default-value inconsistencies** — **Quick**

---

## Notes for Repository Owner

- The current repository is closest to “ready after one consistency pass,” not “ready after one README edit.” The main README is ahead of the linked docs, so users who branch into required guides are currently the highest-risk path.
- The public-template burden here is mostly **documentation synchronization**, not application code. The codebase itself already has many of the right concepts; the setup contract around it is what still feels mid-migration.
- Audit conclusions above were based on **tracked public files intended for the GitHub ZIP**. An ignored internal file, [`docs/clean-room.md`](docs/clean-room.md:1), still contains stale fork / `.env` assumptions, but [`.gitignore`](.gitignore:66) excludes it from distribution.
- After the documentation and validator fixes are made, the next highest-value step is a true clean-machine human rehearsal of the full ZIP-download → new repo → Vercel → Google → first scan flow before announcing public availability.

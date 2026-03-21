#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('============================================');
console.log('Lighthouse Dashboard - Setup Validator');
console.log('============================================\n');

// Load .env file if it exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
  console.log('✓ Loaded .env file\n');
} else {
  console.log('⚠️  No .env file found - checking process.env only\n');
}

let hasErrors = false;

// REQUIRED VARIABLES (Core functionality)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('REQUIRED VARIABLES (Core Functionality)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const requiredVars = [
  { name: 'TARGET_BASE_URL', example: 'https://example.com' },
  { name: 'TARGET_DOMAIN', example: 'example.com' },
  { name: 'DASHBOARD_URL', example: 'https://lighthouse.example.com' },
  { name: 'NEXTAUTH_URL', example: 'https://lighthouse.example.com' },
  { name: 'NEXTAUTH_SECRET', example: '(generated via bash scripts/generate-secrets.sh)' },
  { name: 'GOOGLE_CLIENT_ID', example: '(from Google Cloud Console)' },
  { name: 'GOOGLE_CLIENT_SECRET', example: '(from Google Cloud Console)' },
  { name: 'GOOGLE_ANALYTICS_PROPERTY_ID', example: 'properties/123456789' },
  { name: 'GOOGLE_SERVICE_ACCOUNT_JSON', example: '(JSON object from service account)' },
  { name: 'ANTHROPIC_API_KEY', example: 'sk-ant-... (from console.anthropic.com)' },
  { name: 'AI_MODEL', example: 'claude-3-5-haiku-20241022' },
  { name: 'DATAFORSEO_LOGIN', example: '(from dataforseo.com)' },
  { name: 'DATAFORSEO_PASSWORD', example: '(from dataforseo.com)' },
  { name: 'DATAFORSEO_LOCATION_CODE', example: '2840' },
  { name: 'DATAFORSEO_LANGUAGE_CODE', example: 'en' },
  { name: 'CI_UPLOAD_SIGNING_KEY', example: '(generated via bash scripts/generate-secrets.sh)' },
];

requiredVars.forEach(check => {
  const value = process.env[check.name];
  if (!value || value.trim() === '') {
    console.log(`✗ ${check.name} - MISSING (REQUIRED)`);
    console.log(`  Example: ${check.example}\n`);
    hasErrors = true;
  } else {
    console.log(`✓ ${check.name} - SET`);
  }
});

// TWO-LOCATION CHECK
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('⚠️  CRITICAL: TWO-LOCATION CHECK');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('The following variables MUST be set in BOTH locations with IDENTICAL values:');
console.log('  1. Vercel environment variables');
console.log('  2. GitHub repository secrets');
console.log('');
console.log('Variables requiring two-location setup:');
console.log(`  - CI_UPLOAD_SIGNING_KEY ${process.env.CI_UPLOAD_SIGNING_KEY ? '(SET in .env)' : '(NOT SET)'}`);
console.log(`  - TARGET_BASE_URL ${process.env.TARGET_BASE_URL ? '(SET in .env)' : '(NOT SET)'}`);
console.log('');
console.log('⚠️  If these do not match exactly, you will get 401 Unauthorized errors.');
console.log('   This is the #1 cause of setup failures.');
console.log('');

// OPTIONAL VARIABLES (Enhancements)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('OPTIONAL VARIABLES (Enhancements)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const optionalVars = [
  { name: 'SLACK_WEBHOOK_URL', feature: 'Slack notifications for scans and regressions' },
  { name: 'GITHUB_TOKEN', feature: 'Manual scan triggers from dashboard UI' },
  { name: 'GITHUB_REPO_OWNER', feature: 'Manual scan triggers from dashboard UI' },
  { name: 'GITHUB_REPO_NAME', feature: 'Manual scan triggers from dashboard UI' },
  { name: 'VERCEL_DEPLOY_HOOK', feature: 'Auto-redeploy dashboard after scans' },
  { name: 'ALLOWED_EMAIL_DOMAIN', feature: 'Email domain restriction for sign-in' },
  { name: 'APP_NAME', feature: 'Custom dashboard branding' },
  { name: 'SITE_DESCRIPTION', feature: 'Custom dashboard branding' },
  { name: 'REPORTS_MAX_RUNS', feature: 'Maximum report runs stored in KV (default: 30)' },
];

optionalVars.forEach(check => {
  const value = process.env[check.name];
  if (!value || value.trim() === '') {
    console.log(`⚪ ${check.name} - Not set`);
    console.log(`  Enhancement: ${check.feature}\n`);
  } else {
    console.log(`✓ ${check.name} - SET`);
    console.log(`  Enhancement: ${check.feature}\n`);
  }
});

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('VALIDATION SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (hasErrors) {
  console.log('❌ VALIDATION FAILED');
  console.log('');
  console.log('   All listed variables are REQUIRED. The application will refuse');
  console.log('   to start if any are missing — there is no partial functionality mode.');
  console.log('   Every integration (AI, Competitor Analysis, Analytics) must be');
  console.log('   fully configured before deployment.\n');
  console.log('   Do not deploy to Vercel until this script passes with zero errors.');
  console.log('📋 Follow the README.md setup guide');
  console.log('');
  process.exit(1);
} else {
  console.log('✅ VALIDATION PASSED');
  console.log('   All required variables are set.\n');
  console.log('⚠️  IMPORTANT: Before deploying to Vercel and GitHub:');
  console.log('   1. Copy all values from .env to Vercel environment variables');
  console.log('   2. Add CI_UPLOAD_SIGNING_KEY and TARGET_BASE_URL to GitHub Secrets');
  console.log('   3. Use IDENTICAL values in both locations');
  console.log('');
  console.log('📋 Continue following README.md');
  console.log('');
  process.exit(0);
}

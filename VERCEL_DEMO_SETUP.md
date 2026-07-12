# Vercel demo deployment

This repository can run as a Vercel demo without a separate backend host.
The `api/[...path].js` serverless function runs the existing Express API and
uses `/tmp/drosa.sqlite` while Vercel invokes a warm function instance.

## Important limitation

`/tmp` is temporary Vercel storage. Demo data, uploaded files and backups can
be removed after a cold start or redeploy. Do not use this profile for real
patient data or as a production database.

## Vercel project settings

- Import the GitHub repository and select the `main` branch.
- Framework Preset: `Other`.
- Leave the output directory empty.
- Deploy from the repository root.

## Required environment variables

Set these for Production, Preview and Development in Vercel. Never expose
their values to browser code.

```text
NODE_ENV=production
REQUIRE_PRODUCTION_READY=true
TRUST_PROXY=1
CORS_ORIGIN=https://YOUR-VERCEL-DOMAIN
API_URL=https://YOUR-VERCEL-DOMAIN
JWT_SECRET=<unique secret with at least 32 characters>
BACKUP_ENCRYPTION_KEY=<different unique secret with at least 32 characters>
UPLOAD_DIR=/tmp/drrosa-uploads
SCANNER_IMPORT_DIR=/tmp/drrosa-scanner
BACKUP_DIR=/tmp/drrosa-backups
STAFF_DEFAULT_PERMISSIONS=patients:read,patients:write,records:read,records:write,calendar:read,calendar:write,documents:read,documents:write,clinical:read,clinical:write,billing:read,billing:write
INITIAL_DIRECTOR_PASSWORD=<strong password, at least 12 characters>
INITIAL_STAFF_PASSWORD=<strong password, at least 12 characters>
```

After deployment, open `https://YOUR-VERCEL-DOMAIN/api/health`. A JSON health
response confirms that `/api/*` reaches the Express function. The first API
call seeds the configured demo accounts.

## Persistent production data

This demo profile does not use Turso. The existing backend is synchronous
`node:sqlite`; Turso requires the data layer and all dependent request
handlers to be migrated to an asynchronous database client first.

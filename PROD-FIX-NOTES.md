# Production Fix Notes: Full Menu Showing Only 4 Categories

## Summary
- Symptom: Full Menu displayed 4 category cards only.
- Root cause: The app fell back to 4 hardcoded categories because the Prisma DB query failed during server render. Failure was caused by the wrong `DATABASE_URL` being loaded from `.env.local` (wrong port and password), and previously the Prisma schema hardcoded a URL.
- Fix: Standardize on `env("DATABASE_URL")` in Prisma, correct `.env.local` to the running Postgres (port 5433, URL-encoded password), restart server, and import the provided data dump.

## What Was Happening
- `src/app/menu/page.tsx` fetches categories server-side via Prisma. On error, it returns a 4-item fallback array. With an invalid DB connection, the error path was hit, so only 4 categories appeared.
- `src/app/api/menu/categories/route.ts` also failed with `PrismaClientInitializationError`, confirming the DB connection issue.

## Root Causes
1) Incorrect environment precedence
   - Next.js loads `.env.local` before `.env` in development.
   - We had two different values:
     - `.env` → `DATABASE_URL=postgresql://auy1jll:_Zx-nake%406172@localhost:5433/pizzax`
     - `.env.local` → `DATABASE_URL="postgresql://auy1jll:_Zx-nake_6172@localhost:5432/pizzax"` (wrong port, wrong password format)
   - The app used `.env.local`, causing authentication failures.

2) Prisma schema was hardcoding a connection URL
   - `prisma/schema.prisma` originally contained a literal URL. This risks drift from environment files.

## Edits Made
1) Prisma datasource to use env()
   - File: `prisma/schema.prisma`
   - Change:
     - `url = env("DATABASE_URL")`

2) Correct `.env.local`
   - File: `.env.local`
   - Set the same connection string as the actual running Postgres (port 5433) and ensure the password `@` is URL-encoded as `%40`:
```
DATABASE_URL="postgresql://auy1jll:_Zx-nake%406172@localhost:5433/pizzax"
NEXTAUTH_SECRET="your-super-secret-nextauth-secret"
NEXTAUTH_URL="http://localhost:3007"
```

3) Confirm `.env` (used as a reference)
- File: `.env`
```
DATABASE_URL=postgresql://auy1jll:_Zx-nake%406172@localhost:5433/pizzax
PORT=3007
```

4) Load real data
- Started isolated Postgres for local dev:
```
docker run -d --name local-pg-5433 \
  -e POSTGRES_DB=pizzax \
  -e POSTGRES_USER=auy1jll \
  -e POSTGRES_PASSWORD=_Zx-nake@6172 \
  -p 5433:5432 postgres:16
```
- Imported your dump into the container:
```
docker cp backups91125/02-data.sql local-pg-5433:/02-data.sql
docker exec -i local-pg-5433 bash -lc "psql -U auy1jll -d pizzax -f /02-data.sql"
```

5) Restarted dev server
- PowerShell syntax note for setting env vars inline:
```
# Correct PS syntax (no quotes around numeric value)
$env:PORT=3007; npm run dev:original
```
- Or simply:
```
npm run dev:original  # uses .env.local and .env automatically
```

## Verification
- `GET /api/menu/categories` returns > 4 (8 root categories were returned with current data).
- `GET /menu` renders more than 4 category cards.

## Production Checklist
1) Ensure Prisma uses env var
- `prisma/schema.prisma` must use `url = env("DATABASE_URL")` (already done).

2) Set correct `DATABASE_URL` in production
- Add to your production environment (e.g., Docker secrets, Compose env, or platform env):
```
DATABASE_URL=postgresql://<USER>:<URL_ENCODED_PASSWORD>@<HOST>:<PORT>/<DB>
NEXTAUTH_SECRET=<secure random>
NEXTAUTH_URL=https://<your-domain>
```
- IMPORTANT: URL-encode special characters in the password (e.g., `@` → `%40`).

3) Prisma generate before/start (containerized)
- Ensure Prisma Client is generated for the final image. Two safe options:
   - Option A: Generate during build (recommended):
```
# After installing dependencies and copying source
RUN npx prisma generate
RUN npm run build
```
   - Option B: Generate on container start (less ideal for prod):
```
CMD ["sh", "-lc", "npx prisma generate && npm start"]
```

4) If using Docker Compose with a DB service
- Point app service to the correct DB host and port. If the DB runs as a sidecar named `db`:
```
DATABASE_URL=postgresql://<USER>:<URL_ENCODED_PASSWORD>@db:5432/<DB>
```
- Ensure the DB user/password match what the DB service is created with.

5) Seed/Import data
- If you require the same dataset as staging/dev, import a sanitized dump similarly to local, or provide a production seed script:
```
npx prisma db push
# Optional
node prisma/seed.js
```

6) Redeploy
- Rebuild and redeploy the app with the corrected environment.
- Validate:
  - `/api/menu/categories` returns > 4
  - `/menu` shows full category list

## Rollback & Safety
- No schema-destructive operations were performed.
- The change to use `env("DATABASE_URL")` is safe and recommended.
- Keep `.env.local` out of production; prefer platform env or `.env.production`.

## Quick Triage Commands
```
# Verify which env files Next.js loaded on startup (seen in console):
#   - Environments: .env.local, .env

# Test DB connectivity from app container (if containerized):
#   (Inside container)
node -e "require('@prisma/client').PrismaClient().$connect().then(()=>console.log('OK')).catch(console.error)"

# Check categories directly:
curl -s http://localhost:3000/api/menu/categories | jq '.data | length'
```

## Notes
- Navbar components purposely filter out pizza-related and empty categories; expecting fewer top-level categories than total is normal. If you need to surface all 18 categories at top level, we can adjust that filter logic.

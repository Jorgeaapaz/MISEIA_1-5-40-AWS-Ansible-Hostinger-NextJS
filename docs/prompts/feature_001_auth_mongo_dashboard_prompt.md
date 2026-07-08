@~/.claude/prompts/new_functionality_prompt_spec.md

# Feature 001 — User Auth, MongoDB Persistence & Plan Dashboard

## Role
Act as a Software Developer, Software Architect and IT Infrastructure Engineer, you are an expert in Next.js, Express, MongoDB and Docker.

## Context
- Project: `1-5-40-nextjs-gh-aws` — a Next.js landing page for an AI training program, currently deployed to a single AWS EC2 instance via a systemd service (see `AGENTS.md`).
- Current `docker-compose.yml` only defines the `aiformacion` Next.js container (image `aiformacion:latest`, port `3000:3000`). There is no database service yet.
- Current env files: `.env`, `.env.example`, `.env.production` only contain `AWS_VPS_NAME`, `AWS_SSH_ACCESS`, `AWS_PUBLIC_IP`. Real EC2 values live in `.env.production` (do not overwrite these); `.env.example` holds placeholders; `.env` is the local/blank file.
- `app/components/Nav.tsx` renders a fixed nav with a `Reservar plaza` button (`btn-glow` class) that currently does nothing (no `onClick`, not a link).
- `app/data/plans.ts` exports the `PLANS` array (`Esencial`, `Pro`, `Elite`) already used by `PricingSection.tsx` — reuse this same data for the plan-selection step in the dashboard, do not duplicate plan data.
- `app/page.tsx` composes the landing page from section components (`Nav`, `HeroSection`, ... `Footer`). No auth-aware routing exists today.
- Project follows Next.js App Router conventions (see `node_modules/next/dist/docs/` per `AGENTS.md` — confirm current API shape before writing route handlers, since this Next.js version may differ from training data).
- Global rules to respect while implementing: `typeScript_rules.md` (strict TS, no `any`, discriminated unions, typed errors) and `fe_rules.md` (bold aesthetic, accessible forms, no generic AI look) and `mongo_rules.md` (schema/index/connection conventions).

## Task
Implement end-to-end user registration/login backed by MongoDB, gate a plan-selection dashboard behind auth, and wire up the `Reservar plaza` nav button — plus the supporting Docker/env infrastructure.

### 1. Docker Compose — MongoDB service
- Add a `mongodb` service to `docker-compose.yml`:
  - `image: mongo:7.0`
  - `container_name: dominaia-mongo`
  - `restart: unless-stopped`
  - Publish the default Mongo port (`27017:27017`)
  - `environment`: `MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}`, `MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}`, `MONGO_INITDB_DATABASE=dominaia`
  - Add a named volume (e.g. `mongo_data:/data/db`) so data survives container restarts
  - Add the volume to the top-level `volumes:` block
- Add a `MONGODB_URI` (or equivalent) environment variable to the `aiformacion` service so the app/API can reach Mongo via the Docker network (service name `mongodb`, not `localhost`).

### 2. Environment files
- `.env.production`: add real values —
  ```
  MONGO_ROOT_USERNAME=admin
  MONGO_ROOT_PASSWORD=MongoAdmin2024!
  MONGODB_URI=mongodb://admin:MongoAdmin2024!@mongodb:27017/dominaia?authSource=admin
  JWT_SECRET=<generate a strong random secret, do not reuse the Mongo password>
  ```
- `.env.example`: add the same keys with generic placeholders (`your-mongo-username`, `your-mongo-password`, `mongodb://user:pass@mongodb:27017/dominaia?authSource=admin`, `your-jwt-secret`).
- `.env`: add the same keys blank (matching the existing pattern of blank local values).
- Confirm `.env` and `.env.production` are already git-ignored before committing; do not commit real secrets.

### 3. Express CRUD API (users)
- Create a small Express API (e.g. `server/` or `api/` directory — pick a location consistent with keeping it separate from the Next.js `app/` router tree) that:
  - Connects to MongoDB using `MONGODB_URI`, database `dominaia`, single `MongoClient` instance per process (per `mongo_rules.md`).
  - Collection: `users` (lowercase plural, per `mongo_rules.md`).
  - User document fields: `email` (unique index), `passwordHash`, `name`, `country`, `phone`, `age`, `selectedPlan` (nullable), `createdAt`/`updatedAt`.
  - Endpoints:
    - `POST /api/users/register` — validates input, hashes password with bcrypt, rejects duplicate email, returns a signed JWT (httpOnly cookie).
    - `POST /api/users/login` — verifies credentials, returns JWT (httpOnly cookie).
    - `POST /api/users/logout` — clears the auth cookie.
    - `GET /api/users/me` — returns the current authenticated user (from JWT) without `passwordHash`.
    - `PATCH /api/users/me/plan` — sets `selectedPlan` for the authenticated user (body: one of the `PLANS[].name` values from `app/data/plans.ts`).
  - Never store or return plain-text passwords; never log secrets.
  - Create a unique index on `email` and any index needed for login lookups, per `mongo_rules.md`.
- Decide (and document in the PR) whether this runs as a standalone container in `docker-compose.yml` or as Next.js Route Handlers wrapping the same logic — confirm the current Next.js version's supported API-route conventions in `node_modules/next/dist/docs/` before choosing, since this project pins a non-standard Next.js version.

### 4. Auth UI components
- `app/components/Nav.tsx`: make `Reservar plaza` a real navigation action — link/route to the register (or login, if already authenticated) flow instead of a no-op button.
- Create `Register` and `Login` components (client components) with a form collecting: email, password, name, country, phone, age.
  - Client-side validation (required fields, email format, age numeric range) plus server-side validation in the API.
  - On success, redirect to the user dashboard.
  - Accessible forms: every input has an associated `<label>`, errors use `aria-describedby` (per `fe_rules.md`).
- Add a `Login` button to the landing page (`app/page.tsx` / `Nav.tsx`) for already-registered users, visible alongside/adjacent to `Reservar plaza`.

### 5. User dashboard
- New authenticated route (e.g. `/dashboard`) that:
  - Redirects unauthenticated visitors back to `/login`.
  - Lets the user select a plan from the existing `PLANS` data (`app/data/plans.ts`) and persists the selection via `PATCH /api/users/me/plan`.
  - Shows a `Logout` button that calls `POST /api/users/logout` and redirects to the landing page (`/`).

### 6. Seed script
- Add a seed script (e.g. `scripts/seed-users.ts` or `.js`, consistent with the existing `scripts/` directory) that inserts at least 5 users into `dominaia.users` with bcrypt-hashed passwords, realistic name/country/phone/age values, and no plan selected.
- Make it idempotent (safe to re-run — upsert by email or clear-then-insert) and runnable via an npm script (e.g. `npm run seed`).
- After seeding, output a markdown table of the plaintext email/password/name combinations used (for grading/demo purposes only), e.g.:

  | Email | Password | Name |
  |---|---|---|
  | ana.garcia@example.com | Ana#Pass2024 | Ana García |
  | ... | ... | ... |

### 7. Tests (unit, integration, e2e)
- Test stack already in the repo: Vitest + `@testing-library/react` + jsdom (`vitest.config.ts`, `tests/setup.ts`, existing `tests/page.test.tsx`). Follow these conventions for unit/component tests. There is no e2e runner installed yet — add **Playwright** (`@playwright/test`) as a new devDependency and a `playwright.config.ts`, with an `npm run test:e2e` script; do not introduce a second unit-test framework.
- For integration tests that hit real Mongo query/index logic, use `mongodb-memory-server` (new devDependency) to spin up an ephemeral in-memory MongoDB instance per test run — never point tests at the `.env.production` database.

**Unit tests** (Vitest, colocate under `tests/` mirroring existing layout, e.g. `tests/unit/`):
- Password hashing/verification helper: hashes are non-reversible, `verify(plain, hash)` returns true/false correctly.
- JWT sign/verify helper: valid token decodes to the expected payload; tampered/expired token is rejected.
- Input validation functions for register/login (email format, required fields, age range, phone format) — valid and invalid cases.
- `Register` and `Login` components (React Testing Library): renders all required labeled fields, shows validation errors with `aria-describedby` wired to the invalid field, disables submit while pending, calls the expected fetch/action on valid submit.
- `Nav.tsx`: `Reservar plaza` renders as a link/button routing to the expected destination depending on auth state; `Login` button is present and correctly routed.
- Dashboard plan-selector component: renders all `PLANS` entries, marks the selected plan, calls the update callback with the chosen plan name; `Logout` button triggers the logout action.

**Integration tests** (Vitest + `mongodb-memory-server`, e.g. `tests/integration/`):
- `POST /api/users/register`: creates a user with a bcrypt `passwordHash` (never the plain password) in the `users` collection; enforces the unique index — a second registration with the same email returns a conflict error and does not create a duplicate document.
- `POST /api/users/login`: correct credentials return a signed JWT/set the auth cookie; wrong password and unknown email both return an auth error without leaking which one was wrong.
- `GET /api/users/me`: returns the authenticated user without `passwordHash`; missing/invalid/expired token returns unauthorized.
- `PATCH /api/users/me/plan`: persists a valid `PLANS[].name` value on the correct user document only; rejects a plan name not present in `PLANS`.
- `POST /api/users/logout`: clears the auth cookie such that a subsequent `GET /api/users/me` is unauthorized.
- Seed script: running it twice stays idempotent (no duplicate users, still exactly the seeded set), and every seeded user can log in with its documented plaintext password.

**End-to-end tests** (Playwright, e.g. `tests/e2e/`, run against a local dev server backed by the Dockerized MongoDB or `mongodb-memory-server`):
- Landing page → `Reservar plaza` → fill register form with a new email → redirected to `/dashboard` → select a plan → plan reflected in the UI → `Logout` → redirected to `/` and `Login`/`Reservar plaza` visible again (session ended).
- Landing page → `Login` → sign in with one of the seeded users' documented credentials → redirected to `/dashboard` showing that user's data.
- Register with an already-registered email → inline error shown, user stays on the register form (no navigation).
- Login with wrong password → inline error shown, no session cookie set.
- Direct navigation to `/dashboard` while logged out → redirected to `/login`.
- Keyboard-only pass: tab through the register form fields and submit using only the keyboard (accessibility per `fe_rules.md`).

## Output format
- Modified/created files list with a one-line purpose per file.
- The seed credentials table (as specified above) included in the final response and in a checked-in doc (e.g. `docs/seed-users.md`) — never commit this table to `.env*` files.
- Confirmation that `docker compose config` (or equivalent) validates the compose file.
- Test run summary: unit (`npm run test:ci`), integration (Mongo-backed, in-memory), and e2e (`npm run test:e2e`) pass counts, with coverage for the new `app`/API code meeting or exceeding the existing `vitest.config.ts` threshold (60% lines).

## Examples and Steps to follow
1. Create a new local git branch for this feature before making any changes (per `new_functionality_prompt_spec.md` tool rules).
2. Read the relevant Next.js docs under `node_modules/next/dist/docs/` for the current routing/API-route conventions before writing server code.
3. Implement docker-compose + env changes first; validate with `docker compose config`.
4. Implement the Express CRUD API and unit-test it (register/login/duplicate-email/wrong-password/plan-update/logout).
5. Implement `Register`/`Login` components and wire `Reservar plaza` / `Login` nav buttons.
6. Implement the `/dashboard` route with plan selection and logout.
7. Implement and run the seed script; capture the credentials table.
8. Add `mongodb-memory-server` and `@playwright/test` as devDependencies; write unit tests alongside each component/helper, integration tests for every API endpoint, and e2e tests for the flows listed in Section 7.
9. Run `npm run test:ci`, the new integration suite, and `npm run test:e2e` until everything passes — including existing tests in `tests/page.test.tsx` (no regressions).
10. Commit locally in small steps, repeating test-and-commit until the task is complete with no errors.
11. Push the branch and open a Pull Request using `/git-only-update`, then merge, switch back to local `main`/`master`, and pull — validating the merged result works.

## Output checklist and Guardrails
- [ ] `mongo:7.0` service added to `docker-compose.yml` with published port, named volume, and env-driven credentials.
- [ ] `MONGO_ROOT_USERNAME` / `MONGO_ROOT_PASSWORD` / `MONGODB_URI` / `JWT_SECRET` present in `.env.production` (real), `.env.example` (placeholders), `.env` (blank).
- [ ] No real secrets committed outside `.env.production`/`.env` (both must already be git-ignored — verify, don't assume).
- [ ] Passwords are bcrypt-hashed at rest; JWT stored in an httpOnly cookie, not localStorage.
- [ ] `email` has a unique index on the `users` collection.
- [ ] `Reservar plaza` button performs a real navigation/action; a `Login` button is visible on the landing page.
- [ ] Register/Login forms are keyboard-accessible with labeled inputs.
- [ ] `/dashboard` is unreachable without authentication and redirects appropriately.
- [ ] Logout clears the session and returns the user to the landing page.
- [ ] Seed script inserts ≥ 5 users and prints/saves a plaintext credentials table (email, password, name).
- [ ] Unit tests cover: password hashing, JWT sign/verify, input validation, `Register`/`Login`/`Nav`/plan-selector components.
- [ ] Integration tests (against `mongodb-memory-server`, never the production DB) cover: register (incl. duplicate-email conflict), login (incl. wrong password/unknown email), `me`, plan update (incl. invalid plan name), logout, and seed-script idempotency.
- [ ] E2E tests (Playwright) cover: full register→dashboard→plan-select→logout flow, login with a seeded user, duplicate-email and wrong-password error states, unauthenticated `/dashboard` redirect, and a keyboard-only pass through the register form.
- [ ] Existing `tests/page.test.tsx` still passes — no regressions introduced.
- [ ] Never push failing or untested code — all unit, integration, and e2e tests pass before merge.

# Seeded users (demo/grading only)

Produced by `npm run seed` (`scripts/seed-users.ts`) against the `dominaia.users` collection.
Passwords below are plaintext for demo/grading purposes only — the database only ever stores the bcrypt hash.

| Email | Password | Name |
|---|---|---|
| ana.garcia@example.com | Ana#Pass2024 | Ana García |
| carlos.mendez@example.com | Carlos#Pass2024 | Carlos Méndez |
| lucia.fernandez@example.com | Lucia#Pass2024 | Lucía Fernández |
| diego.rojas@example.com | Diego#Pass2024 | Diego Rojas |
| maria.torres@example.com | Maria#Pass2024 | María Torres |

Re-running `npm run seed` is idempotent — it upserts by email instead of creating duplicates.

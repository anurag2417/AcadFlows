# UI test seed data

Run the deterministic two-school seed from the repository root:

```powershell
pnpm --filter @acadflows/api seed:ui
```

The command deletes and recreates the two test schools, so do not run it
against a shared or production database. Set `MONGODB_URI` to a disposable
database first.

## Test credentials

All seeded users use the password shown below:

| Role | Sunrise Public School | Green Valley International |
|---|---|---|
| Admin | `principal@sunrisegpn.edu.in` / `Admin@2024` | `principal@greenvalley.edu.in` / `Admin@2024` |
| Teacher | `priya.sharma@sunrisegpn.edu.in` / `Teacher@2024` | `kavita.rao@greenvalley.edu.in` / `Teacher@2024` |
| Student | `arjun.mehta@student.sunrise.edu.in` / `Student@2024` | `rohan.patil@student.green.edu.in` / `Student@2024` |
| Guardian | `suresh.mehta@gmail.com` / `Guardian@2024` | `sanjay.kulkarni@gmail.com` / `Guardian@2024` |

Use the school slug or the school code printed by the seed command to select
the tenant in the UI:

- `sunrise-public-school`
- `green-valley-international`

To exercise platform-admin screens locally, set
`PLATFORM_ADMIN_EMAIL=principal@sunrisegpn.edu.in` before starting the API and
log in with that seeded Sunrise admin account. Use this only in the disposable
test database; a platform-admin identity should be a separate account in a
real deployment.

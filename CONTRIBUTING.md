# Contributing to MamaCare

## Team

| Role | Name | Responsibility |
|------|------|---------------|
| Tech Lead | Pacifique | Reviews & approves all PRs, merges to `develop` and `main` |
| Frontend Dev 1 | TBD | React UI components, pages |
| Frontend Dev 2 | TBD | React UI components, styling |
| Backend Dev 1 | TBD | ASP.NET Core controllers, models |
| Backend Dev 2 | TBD | ASP.NET Core services, database |

---

## Branch Strategy

```
main        → production only. Protected. Only Tech Lead merges here via PR.
develop     → integration branch. Protected. All features merge here first via PR.
feature/*   → individual feature work. Created by each developer.
fix/*       → bug fixes.
```

### Branch Protection Summary

| Branch | Direct Push | Force Push | Deletion | PR Required | Approvals |
|--------|-------------|------------|----------|-------------|-----------|
| `main` | ❌ | ❌ | ❌ | ✅ | 1 (Tech Lead) |
| `develop` | ❌ | ❌ | ❌ | ✅ | 1 (Tech Lead) |
| `feature/*` | ✅ | ✅ | ✅ | — | — |

### Branch Naming

```
feature/fe-<description>    # frontend feature
feature/be-<description>    # backend feature
fix/fe-<description>        # frontend bug fix
fix/be-<description>        # backend bug fix
```

**Examples:**
```
feature/fe-mothers-list
feature/fe-appointment-form
feature/be-mothers-crud
feature/be-auth-jwt
fix/be-db-connection
fix/fe-routing-error
```

---

## Workflow (Every Developer Follows This)

### 1. Always start from the latest `develop`
```bash
git checkout develop
git pull origin develop
git checkout -b feature/fe-your-feature
```

### 2. Commit using Conventional Commits

| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructure, no feature change |
| `docs:` | Documentation only |
| `chore:` | Config, dependencies |

**Examples:**
```bash
git commit -m "feat: add mothers list page"
git commit -m "fix: correct CORS origin URL"
git commit -m "refactor: extract API calls to service layer"
```

### 3. Push your branch
```bash
git push origin feature/fe-your-feature
```

### 4. Open a Pull Request on GitHub
- Set base branch to `develop`
- Fill in the PR template completely
- Request review from **Pacifique (Tech Lead)**
- Do NOT merge your own PR
- Do NOT push to `develop` or `main` directly

### 5. After review
- If changes are requested, fix them on the same branch and push again
- Your previous approval will be dismissed automatically — request review again
- Once approved, the Tech Lead will merge

---

## Pull Request Rules
- One PR = one feature or fix, keep it focused
- PR must be approved before merge
- No direct commits to `develop` or `main`
- Resolve all review comments before re-requesting review
- Keep PRs small — large PRs are harder to review and more likely to be rejected

---

## Code Style

### Frontend (React)
- Component files: `PascalCase.jsx` → e.g. `MotherCard.jsx`
- Page files inside `src/pages/`
- Reusable components inside `src/components/`
- API calls only inside `src/api/` or `src/services/`
- No hardcoded API URLs — always use the axios instance in `src/api/axios.js`

### Backend (C#)
- Controllers in `Controllers/`
- Models in `Models/`
- Database context in `Data/`
- Business logic in `Services/`
- Follow RESTful naming: `GET /api/mothers`, `POST /api/mothers`
- No business logic inside controllers — delegate to services

---

## Getting Started

### Prerequisites
- Node.js 18+
- .NET 10 SDK
- SQL Server Express
- Git

### Setup
```bash
git clone https://github.com/Pacifique16/MamaCare.git
cd MamaCare
git checkout develop
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```
Runs at: http://localhost:5173

**Backend:**
```bash
cd server/MamaCare.API
dotnet restore
dotnet tool install --global dotnet-ef   # first time only
dotnet ef database update
dotnet run --launch-profile http
```
Runs at: http://localhost:5000

### Test the connection
Open http://localhost:5173 — you should see **"MamaCare API is running!"**

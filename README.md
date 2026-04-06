# MamaCare

A maternal healthcare web application.

## Stack
- **Frontend**: React + Vite (port 5173)
- **Backend**: ASP.NET Core Web API (port 5000)
- **Database**: SQL Server Express
- **ORM**: Entity Framework Core

## Project Structure
```
MamaCare/
├── client/        # React frontend
└── server/
    └── MamaCare.API/  # ASP.NET Core backend
```

## Getting Started

### Prerequisites
- Node.js 18+
- .NET 10 SDK
- SQL Server Express

### Run the Backend
```bash
cd server/MamaCare.API
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```
API runs at: http://localhost:5000

### Run the Frontend
```bash
cd client
npm install
npm run dev
```
App runs at: http://localhost:5173

### Test the API
Open: http://localhost:5000/api/test

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/test | Health check |
| GET | /api/mothers | Get all mothers |
| GET | /api/mothers/{id} | Get by ID |
| POST | /api/mothers | Create mother |
| PUT | /api/mothers/{id} | Update mother |
| DELETE | /api/mothers/{id} | Delete mother |

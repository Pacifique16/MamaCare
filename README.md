# MamaCare 🤱

> *Empowering Mothers, Ensuring Safe Journeys.*

🌐 **Live App:** [mama-care-ten.vercel.app](https://mama-care-ten.vercel.app)

<img width="1898" height="971" alt="hero section" src="https://github.com/user-attachments/assets/cac406bc-6d0f-4752-8f8b-5c6c6f2b502c" />



## What is MamaCare?

MamaCare is a full-stack maternal healthcare web application built to bridge the gap between pregnant mothers and the medical care they deserve. It combines AI-powered pregnancy guidance, real-time doctor communication, symptom triage, appointment management, and a curated health library — all in one platform designed specifically for the maternal care journey.

From the moment a mother signs up, MamaCare personalizes her experience based on her trimester and risk level, walking her through every milestone from the first prenatal visit all the way to postpartum recovery. Doctors get a dedicated portal to manage their patients efficiently, and hospital administrators get full control over the platform's content and medical staff.

---

## Why Does MamaCare Exist?

Maternal mortality and pregnancy complications remain a serious challenge in many parts of the world, often not because care is unavailable — but because it is inaccessible, fragmented, or poorly communicated. Mothers miss appointments, misread symptoms, or simply don't know who to call when something feels wrong at 2am.

MamaCare was built to solve exactly that. It puts a knowledgeable, always-available AI assistant in every mother's pocket, connects her directly to her assigned doctor, and gives hospitals a modern digital infrastructure to manage maternal care at scale — without replacing the human touch that makes healthcare meaningful.

---

## Who Benefits from MamaCare?

### 🤰 Pregnant Mothers
- Get **instant AI-powered answers** to pregnancy questions at any time of day, powered by Groq's LLaMA 3.3 70B model that understands her specific trimester and risk level
- **Assess symptoms** through a guided triage wizard that tells her whether to rest, monitor, or seek immediate care
- **Book and manage appointments** with her assigned doctor without phone calls or waiting rooms
- **Read curated health articles** from the library covering nutrition, exercise, mental health, fetal development, and more
- **Message her doctor directly** for follow-ups, questions, or prescription clarifications
- **Track her rest patterns** and receive reminders to maintain healthy sleep habits
- **Access emergency contacts** instantly from her dashboard when every second counts
- Never feel alone during one of the most important journeys of her life

### 👨‍⚕️ Doctors
- Get a **clear overview of their entire patient roster** with each mother's profile, trimester, risk level, and history
- **Manage appointments** efficiently without administrative overhead
- **Communicate directly with patients** through the built-in messaging system
- **Issue digital prescriptions** that patients can view instantly from their dashboard
- Spend less time on logistics and more time on actual care

### 🏥 Hospitals & Healthcare Administrators
- **Onboard and manage doctors** with full profiles including certifications, specializations, and languages spoken
- **Publish and manage a health library** of curated articles that educate patients and reduce unnecessary clinic visits
- **Review article requests** submitted by doctors or staff before publishing
- **Monitor contact messages** from patients and respond to support inquiries
- Get a **system-wide dashboard** with statistics on patients, appointments, and platform activity
- Reduce the administrative burden on clinical staff by digitizing the entire patient communication workflow
- Build a **scalable, modern digital health infrastructure** without expensive proprietary software

---

## Features

### For Mothers
- **Onboarding** — trimester-based profile setup with privacy consent
- **Dashboard** — personalized health metrics, upcoming appointments, and quick actions
- **AI Chatbot** — Groq-powered (LLaMA 3.3 70B) pregnancy assistant with context-aware responses based on trimester and risk level
- **Triage Wizard** — symptom-based risk assessment with guided steps
- **Appointments** — book and manage appointments with doctors
- **Library** — browse and read curated pregnancy health articles
- **Messaging** — direct messaging with assigned doctors
- **Prescriptions** — view prescriptions issued by doctors
- **Rest Monitor** — track sleep and rest patterns
- **Emergency Call** — quick access to emergency contacts

### For Doctors
- **Dashboard** — overview of patient roster and appointments
- **Patient Roster** — view and manage assigned patients with full profiles
- **Appointments** — manage scheduled appointments
- **Messaging** — communicate directly with patients
- **Prescriptions** — issue prescriptions to patients

### For Admins
- **Dashboard** — system-wide overview and statistics
- **Doctor Management** — add, edit, and manage doctor accounts with certifications and languages
- **Library Management** — publish and manage health articles
- **Article Requests** — review and approve article submissions
- **Contact Messages** — view and respond to contact form submissions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | ASP.NET Core Web API (.NET 10) |
| Database | PostgreSQL (Railway) |
| ORM | Entity Framework Core + Npgsql |
| Auth | JWT (BCrypt password hashing) |
| AI | Groq API — LLaMA 3.3 70B Versatile |
| File Uploads | Cloudinary |
| Charts | Recharts |
| Animations | Framer Motion |
| Deployment | Vercel (frontend) · Render (backend) · Railway (database) |

---

## Project Structure

```
MamaCare/
├── images/                    # Project screenshots
├── client/                    # React frontend (Vite)
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── api/               # Axios services & API calls
│   │   ├── assets/            # Images and SVGs
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth/          # Auth layouts, OTP, protected routes
│   │   │   ├── contact/       # Contact form components
│   │   │   ├── dashboard/     # Dashboard cards and widgets
│   │   │   ├── layout/        # Navbar, Footer, Sidebars
│   │   │   ├── onboarding/    # Onboarding step components
│   │   │   ├── triage/        # Triage layout and steps
│   │   │   └── PregnancyChatbot.jsx
│   │   ├── context/           # AuthContext
│   │   ├── pages/             # Route-level page components
│   │   │   ├── admin/         # Admin portal pages
│   │   │   ├── doctor/        # Doctor portal pages
│   │   │   └── triage/        # Triage wizard
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vercel.json
└── server/
    └── MamaCare.API/          # ASP.NET Core backend
        ├── Controllers/       # API controllers
        ├── Data/              # EF Core DbContext
        ├── DTOs/              # Request/response DTOs
        ├── Migrations/        # EF Core migrations
        ├── Models/            # Domain models
        ├── Services/          # Business logic services
        └── Program.cs
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- .NET 10 SDK
- PostgreSQL or Railway connection string

### Backend

```bash
cd server/MamaCare.API
```

Create `appsettings.Development.json` or set environment variables:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=mamacare;Username=postgres;Password=yourpassword"
  },
  "Jwt": {
    "Secret": "your-secret-key"
  },
  "Groq": {
    "ApiKey": "your-groq-api-key"
  }
}
```

```bash
dotnet ef database update
dotnet run
```

API runs at: `http://localhost:8080`

### Frontend

```bash
cd client
npm install
npm run dev
```

App runs at: `http://localhost:5173`

Create a `.env` file based on `.env.example`:
```env
VITE_API_URL=http://localhost:8080
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

---

## Deployment

| Service | Platform | Environment Variables |
|---------|----------|-----------------------|
| Frontend | Vercel | `VITE_API_URL` |
| Backend | Render | `DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`, `FRONTEND_URL` |
| Database | Railway | PostgreSQL (auto-provides `DATABASE_URL`) |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and receive JWT |

### Mothers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mothers` | Get all mothers |
| GET | `/api/mothers/{id}` | Get mother by ID |
| POST | `/api/mothers` | Create mother profile |
| PUT | `/api/mothers/{id}` | Update mother profile |
| DELETE | `/api/mothers/{id}` | Delete mother |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/doctors/{id}` | Get doctor by ID |
| POST | `/api/doctors` | Add doctor |
| PUT | `/api/doctors/{id}` | Update doctor |
| DELETE | `/api/doctors/{id}` | Delete doctor |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get appointments |
| POST | `/api/appointments` | Book appointment |
| PUT | `/api/appointments/{id}` | Update appointment |
| DELETE | `/api/appointments/{id}` | Cancel appointment |

### Triage
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/triage` | Submit triage session |
| GET | `/api/triage/{motherId}` | Get triage history |

### AI Chatbot
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/chat` | JWT required | Send message to Groq AI |

### Library
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/library` | Get all articles |
| GET | `/api/library/{id}` | Get article by ID |
| POST | `/api/library` | Create article (Admin) |
| PUT | `/api/library/{id}` | Update article (Admin) |
| DELETE | `/api/library/{id}` | Delete article (Admin) |

### Messaging
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/{conversationId}` | Get messages |
| POST | `/api/messages` | Send message |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/test` | Health check |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/prescriptions` | Get prescriptions |
| POST | `/api/prescriptions` | Issue prescription |

---

## User Roles

| Role | Access |
|------|--------|
| **Mother** | Dashboard, triage, appointments, library, messaging, prescriptions, chatbot |
| **Doctor** | Patient roster, appointments, messaging, prescriptions |
| **Admin** | Doctor management, library, article requests, contact messages |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on branching, commits, and pull requests.

---

## ⭐ Show Your Support

If you found this project helpful or interesting, please consider giving it a star! 🌟

Your support motivates me to create more educational projects and helps others discover useful resources.

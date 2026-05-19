# HireDeck Demo

A demo-level MERN internship and job portal with applicant/recruiter roles, JWT auth, job posting, applications, and PDF resume uploads.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose
- Auth: JWT, bcryptjs
- Uploads: Multer, local `backend/uploads/resumes`

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI` in `backend/.env` for MongoDB Atlas. If `MONGO_URI` is empty, the API runs in demo mode with in-memory sample data.

Seed MongoDB Atlas:

```bash
npm run seed
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Demo Credentials

- Applicant: `applicant@hiredeck.dev` / `Applicant123!`
- Recruiter: `recruiter@hiredeck.dev` / `Recruiter123!`

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users

- `GET /api/users` recruiter only
- `GET /api/users/profile`
- `PUT /api/users/profile` multipart profile/resume update
- `GET /api/users/saved-jobs` applicant only
- `PATCH /api/users/saved-jobs/:jobId` applicant only

### Jobs

- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs` recruiter only
- `PUT /api/jobs/:id` recruiter only
- `DELETE /api/jobs/:id` recruiter only

### Applications

- `POST /api/applications/jobs/:jobId/apply` applicant only, multipart PDF resume
- `GET /api/applications/my` applicant only
- `GET /api/applications/recruiter` recruiter only
- `PATCH /api/applications/:id/status` recruiter only

### Dashboard

- `GET /api/dashboard/applicant`
- `GET /api/dashboard/recruiter`

## Upload Rules

- Only PDF resumes are allowed.
- Maximum file size is 2MB.
- Demo uploads are stored locally in `backend/uploads/resumes`.

## Notes

- JWT tokens are stored in `localStorage` for demo simplicity.
- The project is intentionally clean and compact rather than enterprise-scale.
- Demo mode is useful for local review when MongoDB Atlas is not configured.

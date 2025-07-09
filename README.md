# Murang'a County Project Tracker

A full-stack web application for monitoring, managing, and promoting transparency in development projects across Murang'a County, Kenya. The system empowers the public, staff, and administrators with real-time project data, analytics, and communication tools.

---

## 🌍 Project Overview

The Murang'a Project Tracker is designed to:
- **Centralize project data** for all wards and sub-counties.
- **Enable public access** to project information and status.
- **Provide staff/admin dashboards** for project management and analytics.
- **Facilitate communication** through public and staff comments.
- **Support transparency and accountability** in county development.

---

## 🏛️ System Architecture

**Monorepo Structure:**
- `client/` – Frontend (React, Vite, TypeScript, Tailwind CSS)
- `server/` – Backend (Node.js, Express, TypeScript, Prisma, PostgreSQL)
- **Database** – Hosted on Neon (PostgreSQL)

**Key Features:**
- **Multi-role access:** Public, Staff, Admin
- **Project CRUD & analytics:** Real-time status, budget, and progress tracking
- **Geographic organization:** Sub-county and ward breakdowns
- **Advanced filtering & search:** By status, year, location, department
- **Comment system:** Public and authenticated comments, real-time updates
- **Export & reporting:** Excel, PDF, and PowerPoint generation

---

## 📁 Directory Structure

```
murang'a project tracker/
├── Murang-a_project_tracker/
│   ├── client/   # Frontend app (see client/README.md for details)
│   └── server/   # Backend API (see server/README.md for details)
├── README.md     # This file
```

---

## 🚀 Deployment Plan (Free Tiers)

**Frontend:** Vercel  
**Backend:** Railway  
**Database:** Neon (PostgreSQL)

### 1. Neon (Database)
- Create a Neon Postgres project.
- Copy the connection string (for use as `DATABASE_URL` in Railway).

### 2. Railway (Backend)
- Push backend code to GitHub.
- Create a Railway project and link your repo.
- Set environment variables:
  - `DATABASE_URL` (from Neon)
  - `FRONTEND_URL` (your Vercel frontend URL)
  - `JWT_SECRET` (a strong random string)
- Deploy the backend.
- Run migrations: `npx prisma migrate deploy` in Railway’s shell.
- Copy your Railway backend URL.

### 3. Vercel (Frontend)
- Push frontend code to GitHub.
- Create a Vercel project and link your repo.
- Set environment variable:
  - `VITE_API_URL` (your Railway backend URL)
- Deploy the frontend.
- Copy your Vercel frontend URL.

### 4. Final Steps
- Test the frontend (Vercel URL) and backend (Railway URL).
- Ensure the backend connects to Neon and the frontend can fetch data from the backend.
- Update CORS settings if needed (backend uses `FRONTEND_URL`).

---

## 🛠️ Technology Stack

**Frontend:**  
- React, TypeScript, Vite, Tailwind CSS, Recharts, Axios, XLSX, jsPDF, pptxgenjs

**Backend:**  
- Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, bcrypt, helmet, cors

**Database:**  
- Neon (PostgreSQL, free tier)

---

## 📚 Further Documentation

- **Frontend details:** See `client/README.md`
- **Backend details:** See `server/README.md`
- **API endpoints, scripts, and troubleshooting:** See respective READMEs above.

---

## 🤝 Contributing

1. Fork the repository and create a feature branch.
2. Make your changes and commit with clear messages.
3. Open a pull request describing your changes.

---

## 📝 License

This project is open-source and available under the MIT License.

---

**For any issues or questions, please refer to the client/server READMEs or open an issue in the repository.** 
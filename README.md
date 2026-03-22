# Compliance Tracker

A simple web app to manage compliance tasks across clients.
Built with **React**, **Node/Express**, and **MongoDB**.

## Live Demo
https://mini-compliance-tracker-1.onrender.com

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (Atlas)
- Deployment: Render

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI 

### Backend
```bash
cd backend
npm install
cp .env.example .env     #  MONGO_URI        
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tradeoffs & Assumptions

**Assumptions**
- Single-user app (no auth needed per requirements)
- Status flow is linear: Pending → In Progress → Completed
- Tasks cannot be deleted (compliance audit trail consideration)

**Tradeoffs**
- Used MongoDB over SQL — flexible schema suits evolving compliance categories, easier to deploy on Atlas free tier
- No auth — out of scope; would add JWT + bcrypt in production
- Filters applied server-side (DB query) for scalability; search is client-side for simplicity

# IT Helpdesk Response Library
### COMP1842 – Web Programming 2 | MEVN Stack CRUD Application

---

## Overview
A full-stack CRUD web application built on the **MEVN stack** (MongoDB, Express, Vue 3, Node.js) for a company Helpdesk Response Library. Staff can manage standardised responses for common IT issues using issue codes.

---

## Features
- ✅ Full **CRUD** operations (Create, Read, Update, Delete)
- 🏷️ **3-field schema**: Issue Code + Response + **Category** + **Priority** (4 fields total — exceeds requirement)
- 📊 **Dashboard** with statistics and category breakdown
- 🎯 **Staff Training Quiz** — match issue codes to responses (3 question types)
- 🔍 **Search & Filter** by keyword, category, and priority
- 👁️ **View modal** for quick response lookup
- ℹ️ **About page** covering MEVN architecture, SQL vs NoSQL, accessibility, security
- 🌱 **Seed endpoint** to populate sample data instantly

---

## Prerequisites
- **Node.js** v18+
- **MongoDB** running locally on port 27017
- **npm** v9+

---

## Setup & Running

### 1. Start MongoDB
```bash
mongod --dbpath /data/db
# Or if using Homebrew:
brew services start mongodb-community
```

### 2. Backend
```bash
cd backend
npm install
npm start
# API runs at http://localhost:3000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:8080
```

### 4. Load Sample Data
Visit `http://localhost:8080` → click **"Load Sample Data"** button on the dashboard.

Or via API:
```bash
curl -X POST http://localhost:3000/api/seed
```

---

## Project Structure
```
helpdesk-app/
├── backend/
│   ├── server.js        # Express API + Mongoose models
│   ├── .env             # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── main.js           # App entry point
    │   ├── App.vue           # Root component + navbar
    │   ├── router/index.js   # Vue Router routes
    │   ├── store/helpdesk.js # Pinia state management
    │   ├── assets/style.css  # Global styles
    │   └── views/
    │       ├── Dashboard.vue   # Stats + recent entries
    │       ├── EntriesList.vue # CRUD table with search/filter
    │       ├── EntryForm.vue   # Create / Edit form
    │       ├── QuizPage.vue    # Staff training quiz
    │       └── AboutPage.vue  # Technical documentation
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entries` | Get all entries |
| GET | `/api/entries/:id` | Get one entry |
| POST | `/api/entries` | Create entry |
| PUT | `/api/entries/:id` | Update entry |
| DELETE | `/api/entries/:id` | Delete entry |
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/entries/category/:cat` | Filter by category |
| POST | `/api/seed` | Load sample data |

---

## Data Schema (MongoDB)
```js
{
  issueCode:  String,  // Unique, UPPERCASE, e.g. "PWD_RESET"
  response:   String,  // Standard helpdesk response text
  category:   String,  // Enum: 8 categories
  priority:   String,  // Enum: Low / Medium / High / Critical
  createdAt:  Date,
  updatedAt:  Date
}
```

---

## Technologies Used
- **MongoDB** — NoSQL document database
- **Express 4** — RESTful API framework
- **Vue 3** — Frontend framework (Composition API)
- **Node.js 18** — Server runtime
- **Pinia** — Vue state management
- **Vue Router 4** — SPA routing
- **Axios** — HTTP client
- **Vite** — Frontend build tool / dev server
- **Mongoose** — MongoDB ODM with schema validation

---

## Learning Outcomes Addressed
1. **CRUD MEVN application** — Full Create/Read/Update/Delete via RESTful API
2. **Internet/intranet issues** — About page covers browser compatibility, GDPR, accessibility law, CORS, HTTPS
3. **SQL vs NoSQL** — Comparative analysis in About page with practical justification
# Web2_Programming_Gre

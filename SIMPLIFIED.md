# IT Helpdesk Response Library - Simplified Version

A beginner-friendly MEVN stack CRUD application for managing helpdesk responses.

## Simplifications Made

### Backend (`server.js`)
✅ **Simplified Schema** - Removed schema validations, uppercase transformations, pre-hooks, and updatedAt field
✅ **Cleaner Routes** - Direct error handling without complex error code detection
✅ **No Stats Endpoints** - Removed `/api/stats` and `/api/category/:category` routes
✅ **Minimal DB Operations** - Basic find, create, update, delete operations

### Frontend
✅ **Removed Pinia State Management** - Replaced with simple `useApi()` composable
✅ **Simpler Quiz Logic** - Removed 3-question types, now just 1 simple type
✅ **Removed Transitions** - All fade transitions removed for clarity
✅ **Simplified Components** - Removed extra computed properties and watchers
✅ **Direct API Calls** - All components use the simple composable

## Project Structure

```
backend/
├── server.js          # All backend code in one file
├── .env               # Port & MongoDB URI
└── package.json

frontend/
├── src/
│   ├── main.js                    # App entry (no Pinia)
│   ├── App.vue                    # Root component
│   ├── composable/
│   │   └── useApi.js              # Simple API composable (replaces Pinia)
│   ├── router/index.js            # Vue Router
│   ├── views/
│   │   ├── Dashboard.vue          # Stats overview
│   │   ├── EntriesList.vue        # View/search/delete entries
│   │   ├── EntryForm.vue          # Create/edit entry
│   │   ├── QuizPage.vue           # Simple quiz
│   │   └── AboutPage.vue          # Info page
│   ├── components/
│   │   └── Quiz.vue               # (legacy)
│   └── assets/style.css           # Styling
├── index.html
├── vite.config.js
└── package.json
```

## How It Works

### 1. Backend API
Simple Express REST API with MongoDB:
- `GET /api/entries` - Get all entries
- `POST /api/entries` - Create entry
- `GET /api/entries/:id` - Get single entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry
- `POST /api/seed` - Load sample data

### 2. Frontend Composable
Replace 100+ lines of Pinia store with simple `useApi()` composable:
```javascript
const api = useApi()
// api.entries.value - reactive entry list
// api.loading.value - loading state
// api.error.value - error message
// api.success.value - success message
// api.fetchEntries() - fetch all
// api.createEntry(payload) - create
// api.updateEntry(id, payload) - update
// api.deleteEntry(id) - delete
// api.seedData() - load samples
```

### 3. Simple Quiz
- Generates 6 random questions
- One question type: "Given issue code, what's the response?"
- Immediate feedback (correct/incorrect)
- Final score screen

## Setup

### Backend
```bash
cd backend
npm install
# Start MongoDB: mongod --dbpath /data/db
npm start
# API at http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App at http://localhost:8080
```

### Load Sample Data
Click "Load Sample Data" button on Dashboard, or:
```bash
curl -X POST http://localhost:3000/api/seed
```

## Key Differences from Original

| Feature | Original | Simplified |
|---------|----------|-----------|
| State Management | Pinia store | useApi() composable |
| Backend Error Handling | Complex with error codes | Simple try/catch |
| DB Validators | Full enum/required validations | Basic types |
| Pre-hooks | Auto-update timestamps | Manual only |
| Quiz Questions | 3 complex types | 1 simple type |
| Transitions | Fade transitions everywhere | Removed |
| Component Size | Large & complex | Small & clear |

## Learning Resources

Great for learning:
- ✅ Vue 3 fundamentals (props, state, computed, lifecycle)
- ✅ RESTful API design
- ✅ MongoDB basic operations
- ✅ Component composition
- ✅ Form validation
- ✅ Routing with Vue Router
- ✅ HTTP requests with Axios

Removed complexity:
- ❌ Advanced state management patterns
- ❌ Complex aggregation pipelines
- ❌ Multiple question type logic
- ❌ Middleware and hooks
- ❌ Advanced transitions/animations

## Common Tasks

### Add a new field to entries
1. Update schema in `backend/server.js`
2. Update form fields in `frontend/src/views/EntryForm.vue`
3. Update display in relevant views

### Change the quiz
Edit `generateQuiz()` in `frontend/src/views/QuizPage.vue`

### Modify styling
Edit `frontend/src/assets/style.css`

---

**Perfect for university students learning full-stack web development!**

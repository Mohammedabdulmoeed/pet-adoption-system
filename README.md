# Pet Adoption Management System (MERN)

Production-style **MERN** app with **JWT auth**, **role-based access** (User/Admin), pets CRUD, and adoption workflow.

## Folder structure

```
pet-adoption-management-system/
  server/
    src/
      app.js
      server.js
      config/
        db.js
        env.js
      controllers/
        auth.controller.js
        pet.controller.js
        adoption.controller.js
      middleware/
        auth.js
        errorHandler.js
        notFound.js
        validate.js
      models/
        User.js
        Pet.js
        Adoption.js
      routes/
        auth.routes.js
        pet.routes.js
        adoption.routes.js
      seed/
        seed.js
    .env.example
  client/
    src/
      components/
      context/
      lib/
      pages/
      App.tsx
      main.tsx
      index.css
    .env.example
```

## Features

- **Visitor**
  - View pets, search by **name/breed**, filter by **species/breed/age**, pagination
  - View pet details
- **User**
  - Register/Login (JWT)
  - Apply to adopt (button disabled if already applied or pet adopted)
  - View their adoption applications + statuses
- **Admin**
  - Pets CRUD
  - View all adoption applications
  - Approve/Reject applications
  - When **approved**, pet becomes **adopted** (and other pending requests for that pet are auto-rejected)

## Setup (local)

### Prereqs
- Node.js (LTS)
- MongoDB running locally (or a MongoDB Atlas URI)

### 1) Install dependencies

From repo root:

```bash
npm run install:all
```

### 2) Configure environment variables

- Backend:
  - Copy `server/.env.example` → `server/.env`
  - Set `MONGO_URI` and a strong `JWT_SECRET`
- Frontend:
  - Copy `client/.env.example` → `client/.env`
  - Set `VITE_API_URL` (default: `http://localhost:5000/api`)

### 3) Seed admin + sample pets (optional)

```bash
cd server
npm run seed
```

Seeded admin credentials:
- Email: `admin@pets.com`
- Password: `Admin@123`

### 4) Run dev (API + UI)

From repo root:

```bash
npm run dev
```

- API: `http://localhost:5000/api/health`
- UI: `http://localhost:5173`

## Production build / deploy-ready

1) Build frontend:

```bash
cd client
npm run build
```

2) Run server in production mode (server will serve `client/dist`):

```bash
cd server
set NODE_ENV=production
npm start
```

## API overview

Base URL: `http://localhost:5000/api`

### Auth

- **Register**

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Jane\",\"email\":\"jane@example.com\",\"password\":\"password123\"}"
```

- **Login**

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@pets.com\",\"password\":\"Admin@123\"}"
```

Response contains:
- `token` (JWT)
- `user` (id/name/email/role)

- **Me**

```bash
curl http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_JWT"
```

### Pets

- **List pets** (pagination + search + filters)

Query params:
- `page`, `limit`
- `search` (matches name or breed)
- `species`, `breed`
- `ageMin`, `ageMax`
- `status` (`available` | `adopted`)

```bash
curl "http://localhost:5000/api/pets?page=1&limit=12&search=lab&species=Dog&ageMin=1&ageMax=8"
```

- **Get pet**

```bash
curl http://localhost:5000/api/pets/PET_ID
```

- **Create pet (admin)**

```bash
curl -X POST http://localhost:5000/api/pets ^
  -H "Authorization: Bearer ADMIN_JWT" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Luna\",\"species\":\"Cat\",\"breed\":\"Siamese\",\"age\":1,\"description\":\"Playful\",\"status\":\"available\",\"image\":\"https://example.com/cat.jpg\"}"
```

- **Update pet (admin)**

```bash
curl -X PUT http://localhost:5000/api/pets/PET_ID ^
  -H "Authorization: Bearer ADMIN_JWT" ^
  -H "Content-Type: application/json" ^
  -d "{\"age\":2}"
```

- **Delete pet (admin)**

```bash
curl -X DELETE http://localhost:5000/api/pets/PET_ID ^
  -H "Authorization: Bearer ADMIN_JWT"
```

### Adoptions

- **Apply (user)**

```bash
curl -X POST http://localhost:5000/api/adoptions ^
  -H "Authorization: Bearer USER_JWT" ^
  -H "Content-Type: application/json" ^
  -d "{\"petId\":\"PET_ID\"}"
```

Notes:
- Duplicate applications by the same user for the same pet are prevented (unique index + check).
- Applying for an adopted pet returns a 409.

- **My applications (user)**

```bash
curl http://localhost:5000/api/adoptions/mine ^
  -H "Authorization: Bearer USER_JWT"
```

- **All applications (admin)**

```bash
curl http://localhost:5000/api/adoptions ^
  -H "Authorization: Bearer ADMIN_JWT"
```

- **Approve / Reject (admin)**

```bash
curl -X PATCH http://localhost:5000/api/adoptions/ADOPTION_ID/status ^
  -H "Authorization: Bearer ADMIN_JWT" ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"approved\"}"
```

Approving sets:
- Adoption status → `approved`
- Pet status → `adopted`
- Other pending adoptions for that pet → `rejected`


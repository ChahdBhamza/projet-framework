# Quick Start Guide - Local Development

## Project Structure
```
projet-framework/
├── frontend/          (Next.js - Port 3000)
├── backend/           (Express - Port 5000)
└── README.md
```

## Setup

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/projet-framework.git
cd projet-framework
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values (MongoDB, Gmail, etc.)

# Start backend
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup Frontend

Open a NEW terminal:
```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL to http://localhost:5000/api

# Start frontend
npm run dev
# App runs on http://localhost:3000
```

### 4. Test
- Visit http://localhost:3000
- Try signing up
- Check http://localhost:5000/api/health for backend

---

## Development Commands

### Backend
```bash
npm run dev      # Start with hot reload
npm run start    # Start production
npm run server   # Alias for start
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production build
npm run lint     # Run ESLint
```

---

## Environment Variables Needed

### Backend (.env)
```
MONGO_URI=your-mongodb-connection
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
```

---

## Deployment (See DEPLOYMENT_GUIDE.md for details)

1. **Frontend → Vercel**
   - Push to GitHub
   - Import in Vercel
   - Root directory: `frontend`
   - Add environment variables

2. **Backend → Koyeb**
   - Push to GitHub
   - Create app in Koyeb
   - Root directory: `backend`
   - Run command: `npm run start`
   - Add environment variables

3. **Database → MongoDB Atlas**
   - Create free cluster
   - Get connection string
   - Add to Koyeb environment

---

## API Endpoints

See `frontend/src/app/Utils/apiClient.js` for full list.

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/signin`
- `POST /auth/signup`
- `POST /auth/verify-email`
- `POST /auth/reset-password`

### Meals
- `GET /meals`
- `GET /meals/:id`
- `POST /meals` (authenticated)

### Orders
- `GET /orders` (admin)
- `GET /orders/my-orders` (user)
- `POST /orders` (user)

### User
- `GET /user/profile`
- `PUT /user/update-profile`
- `POST /user/change-password`

---

## Troubleshooting

### Port already in use
```bash
# Kill process on port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB connection error
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Ensure database user exists

### CORS errors
- Check backend CORS settings
- Verify frontend URL is allowed
- Update `CORS_ORIGIN` env var if needed

---

## Next: Deploy!

When ready to deploy, see **DEPLOYMENT_GUIDE.md** for step-by-step instructions.

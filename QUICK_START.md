# VELORA - Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js v14+ installed
- MongoDB running locally or MongoDB Atlas URI
- npm installed

### Step 1: Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/velora
JWT_SECRET=velora_secret_key_2024
PORT=5000
NODE_ENV=development
EOF

# Seed database (optional - adds sample products)
npm run seed

# Start backend
npm run dev
```

**Expected Output:**
```
VELORA API server is running on http://localhost:5000
MongoDB Connected: localhost
```

### Step 2: Frontend Setup (2 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start frontend
npm run dev
```

**Expected Output:**
```
VITE v8.3.0  ready in XXX ms
➜  Local:   http://localhost:5173/
```

## ✅ Verify Installation

### Test Backend APIs

```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
# {"success":true,"message":"VELORA API is running"}

# List products
curl http://localhost:5000/api/products

# List categories
curl http://localhost:5000/api/categories
```

### Test Frontend

Open http://localhost:5173 in your browser

Should see VELORA homepage with navigation

## 🔐 Test Credentials

**After running `npm run seed`:**

```
Admin Account:
- Email: admin@velora.com
- Password: password123

Regular User:
- Email: john@example.com
- Password: password123
```

## 📍 Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | http://localhost:5000/api | All API endpoints |
| Health Check | http://localhost:5000/api/health | API status |
| Frontend | http://localhost:5173 | User interface |
| MongoDB | localhost:27017 | Database (if local) |

## 🛠️ Common Commands

### Backend
```bash
npm run dev      # Start with auto-reload
npm start        # Start production mode
npm run seed     # Seed database
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Create production build
npm run lint     # Run linter
```

## 🚨 Troubleshooting

### MongoDB Connection Failed

**Problem:** `Error: connect ECONNREFUSED`

**Solutions:**
1. Start MongoDB locally:
   ```bash
   # Windows
   mongod
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. Or use MongoDB Atlas:
   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/velora
   ```

### Port Already in Use

**Problem:** `listen EADDRINUSE: address already in use :::5000`

**Solution:** Change port in .env:
```
PORT=5001
```

### Frontend Can't Connect to Backend

**Problem:** API calls failing with CORS errors

**Solution:** Verify:
1. Backend is running: `http://localhost:5000/api/health`
2. .env has correct API URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Restart frontend after changing .env

### VITE_API_URL Not Loading

**Solution:** Restart frontend after creating .env file

## 📊 Available Sample Data

After seeding, database contains:

- **2 Users**
  - 1 Admin
  - 1 Regular user

- **4 Categories**
  - Men
  - Women
  - Kids
  - Accessories

- **15 Products**
  - Various items with prices
  - Discount prices on some
  - Realistic stock levels
  - Images from Unsplash

## 🧪 Testing API Endpoints

### Using Postman

1. Import this collection:
```json
{
  "info": {
    "name": "VELORA API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/health"
      }
    },
    {
      "name": "Get Products",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/products"
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"admin@velora.com\",\"password\":\"password123\"}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

### Using curl

```bash
# Get all products
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@velora.com","password":"password123"}'

# Get protected endpoint (replace TOKEN)
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer TOKEN"
```

## 🎯 Next Steps

### Immediate (Testing)
1. Verify backend & frontend running
2. Test login with seed credentials
3. Browse products
4. Test cart functionality

### Short Term (Frontend Development)
1. Create React pages (HomePage, ShopPage, etc.)
2. Build components (Navbar, ProductCard, etc.)
3. Set up Zustand stores
4. Style with Tailwind CSS

### Medium Term (Integration)
1. Connect all frontend pages to APIs
2. Implement state management
3. Add error handling & loading states
4. Test all flows

### Long Term (Deployment)
1. Build frontend: `npm run build`
2. Deploy backend to Heroku/Railway
3. Deploy frontend to Vercel/Netlify
4. Update API URLs for production

## 📚 Documentation Files

- **README.md** - Full project documentation
- **FRONTEND_GUIDE.md** - Frontend development guide
- **IMPLEMENTATION_SUMMARY.md** - What was built
- **This file** - Quick start guide

## 🔗 Useful Links

- [Express.js Docs](https://expressjs.com)
- [Mongoose Docs](https://mongoosejs.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)

## ✨ Project Structure Overview

```
VELORA/
├── backend/          # Backend API (COMPLETE ✅)
│   ├── src/
│   │   ├── config/   # DB connection
│   │   ├── controllers/  # Business logic
│   │   ├── models/   # Database schemas
│   │   ├── routes/   # API endpoints
│   │   ├── middleware/   # Auth, validation
│   │   └── app.js    # Express app
│   ├── scripts/seed.js
│   └── server.js     # Entry point
│
├── frontend/         # React app (READY FOR DEV)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── services/
│   │   └── App.jsx
│   └── vite.config.js
│
└── Documentation/
    ├── README.md
    ├── FRONTEND_GUIDE.md
    ├── IMPLEMENTATION_SUMMARY.md
    └── QUICK_START.md (this file)
```

## 🎓 What You Have

✅ **Complete Backend API**
- 40+ endpoints
- Full CRUD operations
- Authentication & authorization
- Data validation
- Error handling

✅ **Database Setup**
- 7 interconnected models
- Proper indexes
- Relationships configured
- Sample data ready

✅ **Frontend Foundation**
- Vite setup
- Tailwind CSS configured
- Zustand ready
- API service ready

✅ **Documentation**
- API endpoints documented
- Setup guides
- Frontend guide
- Code examples

## 🚀 You're Ready to Go!

The backend is 100% functional. Start building your frontend components and integrate them with the APIs.

**Happy coding! 🎉**

---

For issues or questions, check:
1. Error messages in console
2. Backend logs
3. MongoDB connection
4. Environment variables

**Need help?** All APIs are documented and tested. Check README.md for full documentation.

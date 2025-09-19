# 🚀 Deployment Guide - Income & Expense Tracker

This guide covers various deployment options for your Income & Expense Tracker application.

## 🌐 Frontend Deployment

### Vercel (Recommended for React)
1. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Environment Variables**: Add in Vercel dashboard:
   - `REACT_APP_BACKEND_URL=https://your-backend-url.com`

### Netlify
1. **Build and deploy**:
   ```bash
   cd frontend
   npm run build
   # Upload dist folder to Netlify or connect GitHub repo
   ```

2. **Environment Variables**:
   - `REACT_APP_BACKEND_URL=https://your-backend-url.com`

## 🔧 Backend Deployment

### Heroku
1. **Create Procfile**:
   ```
   web: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

2. **Deploy**:
   ```bash
   cd backend
   git init
   heroku create your-app-name
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

3. **Environment Variables**:
   ```bash
   heroku config:set MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   heroku config:set DB_NAME=expense_tracker
   ```

### DigitalOcean App Platform
1. **Connect GitHub repository**
2. **Configure build settings**:
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**:
   - `MONGO_URL`: Your MongoDB connection string
   - `DB_NAME`: expense_tracker

## 🗄️ Database Deployment

### MongoDB Atlas (Recommended)
1. **Create cluster** at [MongoDB Atlas](https://cloud.mongodb.com)
2. **Get connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/expense_tracker
   ```
3. **Seed data**:
   ```bash
   # Update MONGO_URL in backend/.env
   python seed_data.py
   ```

### Self-hosted MongoDB
1. **Install MongoDB** on your server
2. **Configure security** (authentication, firewall)
3. **Update connection string** in environment variables

## 🔐 Environment Variables Guide

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://your-backend-domain.com
```

### Backend (.env)
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker
DB_NAME=expense_tracker
```

## 📋 Pre-Deployment Checklist

### Frontend
- [ ] Update `REACT_APP_BACKEND_URL` to production backend URL
- [ ] Test build locally: `npm run build`
- [ ] Verify all API calls work with production backend
- [ ] Check responsive design on different devices

### Backend
- [ ] Update CORS origins to include frontend domain
- [ ] Test all API endpoints with production database
- [ ] Verify MongoDB connection string
- [ ] Run database seeding script
- [ ] Test API documentation at `/docs`

### Database
- [ ] Create production database
- [ ] Set up proper authentication
- [ ] Configure network access (IP whitelist)
- [ ] Run seed script to populate initial data
- [ ] Set up backups

## 🛡️ Security Considerations

### Backend Security
```python
# Update CORS origins in server.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],  # Specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Database Security
- Use MongoDB Atlas for managed security
- Enable authentication
- Use connection string with credentials
- Whitelist IP addresses
- Enable SSL/TLS

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install and Build
        run: |
          cd frontend
          npm install
          npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

## 🧪 Testing Deployment

### Frontend Testing
1. **Local build test**:
   ```bash
   cd frontend
   npm run build
   npx serve -s build
   ```

2. **Production testing**:
   - Test all features
   - Verify API connectivity
   - Check responsive design
   - Test different browsers

### Backend Testing
1. **Local production test**:
   ```bash
   cd backend
   uvicorn server:app --host 0.0.0.0 --port 8001
   ```

2. **Production API testing**:
   - Test all endpoints at `/docs`
   - Verify database connections
   - Check CORS settings
   - Test error handling

## 🆘 Troubleshooting

### Common Issues

**Frontend not connecting to backend**:
- Check `REACT_APP_BACKEND_URL` environment variable
- Verify CORS settings in backend
- Check network connectivity

**Database connection errors**:
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database name is correct

**Build failures**:
- Check Node.js/Python versions
- Verify all dependencies are installed
- Check for environment-specific issues

### Support
For deployment issues, contact: skjaveriya.11@gmail.com

---

**Ready to launch your Income & Expense Tracker! 🚀**
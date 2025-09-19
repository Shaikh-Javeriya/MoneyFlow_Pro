# 💰 Income & Expense Tracker - Professional Dashboard

A comprehensive full-stack financial management application built with React, FastAPI, and MongoDB. Perfect for individuals, small businesses, or as a foundation for SaaS products.

## ✨ Features

### 📊 **Dashboard & Analytics**
- Real-time KPI tracking (Balance, Income, Expenses, Net Profit)
- 5 Interactive charts (Income vs Expenses, Monthly Trends, Category Breakdown, etc.)
- Recent transactions overview
- Low balance alerts and overdue notifications

### 💳 **Transaction Management**
- Complete CRUD operations for financial transactions
- Advanced filtering (by type, status, search)
- CSV Import/Export functionality
- Recurring transaction support
- Multi-account management

### 🏦 **Account Management**
- Multiple account types (Checking, Savings, Credit Cards)
- Balance tracking with low-balance alerts
- Account performance visualization

### 👥 **Client & Vendor Management**
- Client management with payment terms (NET 30, NET 15, etc.)
- Vendor management with default expense categories
- Contact information and payment tracking

### 💰 **Budget Management**
- Monthly budget setting per category
- Real-time budget vs actual spending tracking
- Over-budget alerts and notifications
- Visual budget progress indicators

### 🎨 **Customization**
- **10 Currency Support**: USD, EUR, GBP, CAD, AUD, JPY, CHF, CNY, INR, BRL
- **Theme System**: Light/Dark mode with custom color schemes
- **3 Preset Themes**: Blue Professional, Pastel, Dark
- **Font Size Options**: Small, Medium, Large
- **Responsive Design**: Mobile and desktop optimized

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.8+
- MongoDB (local or cloud)

### 1. Clone & Install
```bash
# Clone the repository
git clone [your-repo-url]
cd income-expense-tracker

# Install frontend dependencies
cd frontend
npm install
# or
yarn install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

### 2. Environment Setup
```bash
# Frontend (.env)
cd frontend
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env

# Backend (.env)
cd ../backend
echo "MONGO_URL=mongodb://localhost:27017" > .env
echo "DB_NAME=expense_tracker" > .env
```

### 3. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Seed sample data
cd backend
python seed_data.py
```

### 4. Run Application
```bash
# Terminal 1: Start Backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2: Start Frontend
cd frontend
npm start
# or
yarn start
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

## 🛠️ Tech Stack

### Frontend
- **React 19** with modern hooks
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Lucide React** for icons
- **Date-fns** for date handling
- **Axios** for API communication

### Backend
- **FastAPI** for REST API
- **MongoDB** with Motor (async driver)
- **Pydantic** for data validation
- **CORS** middleware for cross-origin requests

## 🎯 API Endpoints

### Core APIs
- **Categories**: `GET, POST, PUT, DELETE /api/categories`
- **Accounts**: `GET, POST, PUT, DELETE /api/accounts`
- **Transactions**: `GET, POST, PUT, DELETE /api/transactions`
- **Clients**: `GET, POST, PUT, DELETE /api/clients`
- **Vendors**: `GET, POST, PUT, DELETE /api/vendors`
- **Budgets**: `GET, POST, PUT, DELETE /api/budgets`
- **Dashboard**: `GET /api/dashboard/kpis`

### Features
- Advanced filtering and search
- Automatic relationship handling
- Error handling and validation
- CORS support for frontend integration

## 🎨 Customization Guide

### Adding New Categories
1. Navigate to Categories tab
2. Click "Add Category"
3. Choose type (Income/Expense), name, and color
4. Category automatically appears in transactions

### Currency Configuration
1. Go to Theme tab
2. Select from 10 supported currencies
3. All amounts automatically update with proper symbols

### Theme Customization
1. Theme tab offers complete customization
2. Choose from preset themes or create custom colors
3. Light/Dark mode toggle
4. Font size adjustment

## 📦 Project Structure
```
income-expense-tracker/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── contexts/        # React contexts (Theme)
│   │   ├── hooks/           # Custom hooks (API)
│   │   ├── services/        # API services
│   │   └── data/            # Mock data (for reference)
│   └── public/
├── backend/                 # FastAPI application
│   ├── server.py            # Main API server
│   ├── seed_data.py         # Database seeding
│   └── requirements.txt     # Python dependencies
└── README.md
```

## 🚀 Deployment Options

### Frontend Deployment
- **Vercel**: `npm run build` + deploy
- **Netlify**: Direct GitHub integration
- **AWS S3**: Static hosting

### Backend Deployment
- **Heroku**: Python app deployment
- **DigitalOcean**: App Platform
- **AWS EC2**: Full server setup

### Database Options
- **MongoDB Atlas**: Cloud database (free tier available)
- **Local MongoDB**: Self-hosted option

## 📝 License

This project is sold as a digital product with full source code access. You have the right to:
- Use for personal or commercial projects
- Modify and customize as needed
- Resell as part of larger solutions

## 🆘 Support

For technical support or questions:
- **Email**: skjaveriya.11@gmail.com
- **Documentation**: Check `/docs` tab in the application
- **Issues**: Common troubleshooting included in application

---

**Built with ❤️ for financial management and business success**

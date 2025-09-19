# MoneyFlow Pro - Complete PWA

## 🎯 Features

### Complete Financial Management
- **Dashboard**: Beautiful charts and KPIs with theme-aware colors
- **Transactions**: Full CRUD with search, filter, add, edit, delete
- **Categories**: Custom categories with icon picker and color selection
- **Accounts**: Bank account management with balance tracking
- **Clients**: Business client management with revenue tracking
- **Vendors**: Vendor management with expense tracking
- **Budget**: Budget limits with spending monitoring and alerts

### Advanced Features
- **10 Currencies**: USD, EUR, GBP, JPY, INR, CAD, AUD, CHF, CNY, SEK
- **3 Themes**: Ocean Blue, Purple Dream, Nature Green
- **Dark Mode**: Complete dark theme support
- **Charts**: Interactive charts using Chart.js
- **Import/Export**: JSON full backup and CSV individual exports
- **PWA Features**: Installable, offline-first, service worker

### Privacy First
- **Local Storage Only**: No servers, no tracking
- **Offline Capable**: Works without internet
- **Data Portability**: Easy backup and restore

## 🚀 Installation

1. Copy all files from `/app/moneyflow-pwa-complete/` to your project directory
2. Install dependencies: `npm install`
3. Build for production: `npm run build`
4. Serve the build: `npm install -g serve && serve -s build`

## 📱 PWA Installation

1. Open the app in your browser
2. Look for the "Add to Home Screen" option
3. Or wait for the install prompt that appears after 5 seconds

## 🔧 Development

- `npm start`: Development server
- `npm run build`: Production build
- `npm test`: Run tests

## 📊 Chart Dependencies

This PWA uses Chart.js for beautiful, interactive charts:
- Spending by Category (Doughnut)
- Income vs Expenses (Bar)
- Monthly Trends (Line)

## 💾 Data Structure

All data is stored in localStorage with the following keys:
- `moneyflow_transactions`
- `moneyflow_categories`
- `moneyflow_accounts`
- `moneyflow_clients`
- `moneyflow_vendors`
- `moneyflow_budgets`
- `moneyflow_theme`
- `moneyflow_currency`
- `moneyflow_dark`

## 🎨 Theming

The app uses CSS custom properties for dynamic theming:
- Theme colors are applied via CSS variables
- All components respond to theme changes
- Dark mode is fully supported

## 📞 Support

For support, contact: skjaveriya.11@gmail.com
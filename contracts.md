# Income & Expense Tracker - Backend Integration Contracts

## API Contracts & Endpoints

### Base URL: `/api`

## 1. Categories Management
```
GET    /api/categories              - Get all categories
POST   /api/categories              - Create new category
PUT    /api/categories/:id          - Update category
DELETE /api/categories/:id          - Delete category
```

**Category Model:**
```javascript
{
  id: number,
  name: string,
  type: 'income' | 'expense',
  color: string
}
```

## 2. Accounts Management
```
GET    /api/accounts                - Get all accounts
POST   /api/accounts                - Create new account
PUT    /api/accounts/:id            - Update account
DELETE /api/accounts/:id            - Delete account
```

**Account Model:**
```javascript
{
  id: number,
  name: string,
  type: 'checking' | 'savings' | 'credit',
  balance: number,
  lowBalanceThreshold: number
}
```

## 3. Transactions Management
```
GET    /api/transactions            - Get all transactions (with filtering)
POST   /api/transactions            - Create new transaction
PUT    /api/transactions/:id        - Update transaction
DELETE /api/transactions/:id        - Delete transaction
GET    /api/transactions/export     - Export transactions to CSV
POST   /api/transactions/import     - Import transactions from CSV
```

**Transaction Model:**
```javascript
{
  id: number,
  date: string,
  type: 'income' | 'expense',
  amount: number,
  categoryId: number,
  categoryName: string,
  accountId: number,
  accountName: string,
  clientVendorId: number | null,
  clientVendorName: string,
  status: 'completed' | 'pending' | 'overdue',
  notes: string,
  recurring: boolean
}
```

## 4. Clients Management
```
GET    /api/clients                 - Get all clients
POST   /api/clients                 - Create new client
PUT    /api/clients/:id             - Update client
DELETE /api/clients/:id             - Delete client
```

**Client Model:**
```javascript
{
  id: number,
  name: string,
  email: string,
  paymentTerms: string
}
```

## 5. Vendors Management
```
GET    /api/vendors                 - Get all vendors
POST   /api/vendors                 - Create new vendor
PUT    /api/vendors/:id             - Update vendor
DELETE /api/vendors/:id             - Delete vendor
```

**Vendor Model:**
```javascript
{
  id: number,
  name: string,
  email: string,
  defaultCategory: string
}
```

## 6. Budget Management
```
GET    /api/budgets                 - Get all budgets with spending data
POST   /api/budgets                 - Create new budget
PUT    /api/budgets/:categoryId     - Update budget
DELETE /api/budgets/:categoryId     - Delete budget
```

**Budget Model:**
```javascript
{
  categoryId: number,
  categoryName: string,
  monthlyBudget: number,
  spent: number  // calculated from transactions
}
```

## 7. Dashboard Analytics
```
GET    /api/dashboard/kpis          - Get KPI data (balance, income, expenses, etc.)
GET    /api/dashboard/charts        - Get chart data for dashboard
```

**KPI Response:**
```javascript
{
  totalIncome: number,
  totalExpenses: number,
  balance: number,
  netProfit: number,
  pendingTransactions: number,
  overdueTransactions: number
}
```

**Chart Data Response:**
```javascript
{
  incomeExpenseTrend: { labels: string[], datasets: object[] },
  monthlySpendingTrend: { labels: string[], datasets: object[] },
  categoryBreakdown: { labels: string[], datasets: object[] },
  accountBalances: { labels: string[], datasets: object[] },
  topCategories: { labels: string[], datasets: object[] }
}
```

## Mock Data Replacement Plan

### Current Mock Data Files:
- `/src/data/mockData.js` - Contains all mock data
- Categories: 13 predefined categories (5 income, 8 expense)
- Accounts: 4 sample accounts
- Transactions: 50+ generated transactions
- Clients: 5 sample clients
- Vendors: 5 sample vendors
- Budgets: 8 budget entries

### Backend Integration Steps:

1. **Database Models:**
   - Create MongoDB schemas for each entity
   - Implement relationships between transactions and other entities
   - Add indexing for performance

2. **API Endpoints:**
   - Implement CRUD operations for all entities
   - Add validation and error handling
   - Implement filtering and sorting for transactions

3. **Frontend Integration:**
   - Replace mock data imports with API calls
   - Update components to use async data fetching
   - Add loading states and error handling
   - Implement real-time updates

4. **Data Migration:**
   - Seed database with current mock data
   - Ensure all relationships are properly established
   - Test data integrity

## Frontend Changes Required:

### Components to Update:
1. **Dashboard.js** - Replace mock data with API calls for KPIs and charts
2. **Transactions.js** - Replace mock transactions with API calls
3. **Categories.js** - Replace mock categories with API calls
4. **Accounts.js** - Replace mock accounts with API calls
5. **Clients.js** - Replace mock clients with API calls
6. **Vendors.js** - Replace mock vendors with API calls
7. **Budget.js** - Replace mock budgets with API calls

### New Services to Create:
- `api.js` - Centralized API service with axios configuration
- Error handling utilities
- Loading state management

## Database Schema (MongoDB)

### Collections:
1. **categories** - Category data
2. **accounts** - Account information
3. **transactions** - All financial transactions
4. **clients** - Client information
5. **vendors** - Vendor information
6. **budgets** - Budget configurations

### Indexes:
- transactions: `{ date: -1, type: 1, status: 1 }`
- categories: `{ type: 1 }`
- accounts: `{ type: 1 }`

## Implementation Priority:
1. Set up basic CRUD endpoints for all entities
2. Implement dashboard analytics endpoints
3. Replace frontend mock data with API calls
4. Add advanced features (CSV import/export, filtering)
5. Implement real-time updates and optimizations

## Notes:
- All currency formatting is handled on frontend using ThemeContext
- Date handling uses date-fns library
- Charts use Chart.js with data from backend
- Responsive design is already implemented
- Theme system (colors, currency) is frontend-only
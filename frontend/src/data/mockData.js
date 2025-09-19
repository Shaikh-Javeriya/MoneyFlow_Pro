// Mock data for the Income & Expense Tracker
import { addDays, subDays, format } from 'date-fns';

// Generate dates for the past 6 months
const generateRandomDate = (monthsBack = 6) => {
  const start = subDays(new Date(), monthsBack * 30);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Categories
export const categories = [
  // Income Categories  
  { id: 1, name: 'Salary', type: 'income', color: '#10b981' },
  { id: 2, name: 'Freelance', type: 'income', color: '#059669' },
  { id: 3, name: 'Investments', type: 'income', color: '#047857' },
  { id: 4, name: 'Business', type: 'income', color: '#065f46' },
  { id: 5, name: 'Other Income', type: 'income', color: '#064e3b' },
  
  // Expense Categories
  { id: 6, name: 'Rent', type: 'expense', color: '#ef4444' },
  { id: 7, name: 'Food', type: 'expense', color: '#dc2626' },
  { id: 8, name: 'Utilities', type: 'expense', color: '#b91c1c' },
  { id: 9, name: 'Travel', type: 'expense', color: '#991b1b' },
  { id: 10, name: 'Subscriptions', type: 'expense', color: '#7f1d1d' },
  { id: 11, name: 'Healthcare', type: 'expense', color: '#f97316' },
  { id: 12, name: 'Entertainment', type: 'expense', color: '#ea580c' },
  { id: 13, name: 'Shopping', type: 'expense', color: '#c2410c' },
];

// Accounts
export const accounts = [
  { id: 1, name: 'Main Checking', type: 'checking', balance: 5420.50, lowBalanceThreshold: 500 },
  { id: 2, name: 'Savings Account', type: 'savings', balance: 12800.75, lowBalanceThreshold: 1000 },
  { id: 3, name: 'Credit Card', type: 'credit', balance: -1250.30, lowBalanceThreshold: -5000 },
  { id: 4, name: 'Business Account', type: 'checking', balance: 8960.25, lowBalanceThreshold: 1000 },
];

// Clients
export const clients = [
  { id: 1, name: 'ABC Corporation', paymentTerms: 'NET 30', email: 'billing@abc.com' },
  { id: 2, name: 'XYZ Industries', paymentTerms: 'NET 15', email: 'payments@xyz.com' },
  { id: 3, name: 'Tech Solutions Ltd', paymentTerms: 'Immediate', email: 'finance@techsol.com' },
  { id: 4, name: 'Global Ventures', paymentTerms: 'NET 45', email: 'accounts@global.com' },
  { id: 5, name: 'StartUp Inc', paymentTerms: 'NET 30', email: 'billing@startup.com' },
];

// Vendors
export const vendors = [
  { id: 1, name: 'Office Supplies Co', defaultCategory: 'Business Expenses', email: 'sales@office.com' },
  { id: 2, name: 'Internet Provider', defaultCategory: 'Utilities', email: 'billing@internet.com' },
  { id: 3, name: 'Software Subscriptions', defaultCategory: 'Subscriptions', email: 'support@software.com' },
  { id: 4, name: 'Local Restaurant', defaultCategory: 'Food', email: 'orders@restaurant.com' },
  { id: 5, name: 'Gas Station', defaultCategory: 'Travel', email: 'info@gasstation.com' },
];

// Budget data
export const budgets = [
  { categoryId: 6, categoryName: 'Rent', monthlyBudget: 1000, spent: 1000 },
  { categoryId: 7, categoryName: 'Food', monthlyBudget: 500, spent: 620 },
  { categoryId: 8, categoryName: 'Utilities', monthlyBudget: 200, spent: 180 },
  { categoryId: 9, categoryName: 'Travel', monthlyBudget: 300, spent: 450 },
  { categoryId: 10, categoryName: 'Subscriptions', monthlyBudget: 150, spent: 145 },
  { categoryId: 11, categoryName: 'Healthcare', monthlyBudget: 400, spent: 320 },
  { categoryId: 12, categoryName: 'Entertainment', monthlyBudget: 250, spent: 180 },
  { categoryId: 13, categoryName: 'Shopping', monthlyBudget: 200, spent: 280 },
];

// Generate 50 sample transactions
export const transactions = [
  // Income transactions
  { id: 1, date: '2024-12-15', type: 'income', amount: 5000, categoryId: 1, categoryName: 'Salary', accountId: 1, accountName: 'Main Checking', clientVendorId: 1, clientVendorName: 'ABC Corporation', status: 'completed', notes: 'Monthly salary', recurring: true },
  { id: 2, date: '2024-12-10', type: 'income', amount: 1500, categoryId: 2, categoryName: 'Freelance', accountId: 1, accountName: 'Main Checking', clientVendorId: 2, clientVendorName: 'XYZ Industries', status: 'completed', notes: 'Web development project', recurring: false },
  { id: 3, date: '2024-12-05', type: 'income', amount: 200, categoryId: 3, categoryName: 'Investments', accountId: 2, accountName: 'Savings Account', clientVendorId: null, clientVendorName: '', status: 'completed', notes: 'Dividend payment', recurring: true },
  { id: 4, date: '2024-11-15', type: 'income', amount: 5000, categoryId: 1, categoryName: 'Salary', accountId: 1, accountName: 'Main Checking', clientVendorId: 1, clientVendorName: 'ABC Corporation', status: 'completed', notes: 'Monthly salary', recurring: true },
  { id: 5, date: '2024-11-20', type: 'income', amount: 800, categoryId: 2, categoryName: 'Freelance', accountId: 4, accountName: 'Business Account', clientVendorId: 3, clientVendorName: 'Tech Solutions Ltd', status: 'completed', notes: 'Consulting work', recurring: false },
  
  // Expense transactions
  { id: 6, date: '2024-12-01', type: 'expense', amount: 1000, categoryId: 6, categoryName: 'Rent', accountId: 1, accountName: 'Main Checking', clientVendorId: null, clientVendorName: '', status: 'completed', notes: 'Monthly rent payment', recurring: true },
  { id: 7, date: '2024-12-14', type: 'expense', amount: 85.50, categoryId: 7, categoryName: 'Food', accountId: 3, accountName: 'Credit Card', clientVendorId: 4, clientVendorName: 'Local Restaurant', status: 'completed', notes: 'Grocery shopping', recurring: false },
  { id: 8, date: '2024-12-12', type: 'expense', amount: 120, categoryId: 8, categoryName: 'Utilities', accountId: 1, accountName: 'Main Checking', clientVendorId: 2, clientVendorName: 'Internet Provider', status: 'completed', notes: 'Internet bill', recurring: true },
  { id: 9, date: '2024-12-08', type: 'expense', amount: 65, categoryId: 9, categoryName: 'Travel', accountId: 3, accountName: 'Credit Card', clientVendorId: 5, clientVendorName: 'Gas Station', status: 'completed', notes: 'Gas fill-up', recurring: false },
  { id: 10, date: '2024-12-07', type: 'expense', amount: 29.99, categoryId: 10, categoryName: 'Subscriptions', accountId: 3, accountName: 'Credit Card', clientVendorId: 3, clientVendorName: 'Software Subscriptions', status: 'completed', notes: 'Netflix subscription', recurring: true },
  
  // More transactions to reach 50 total
  { id: 11, date: '2024-11-28', type: 'expense', amount: 450, categoryId: 11, categoryName: 'Healthcare', accountId: 1, accountName: 'Main Checking', clientVendorId: null, clientVendorName: '', status: 'completed', notes: 'Doctor visit', recurring: false },
  { id: 12, date: '2024-11-25', type: 'expense', amount: 180, categoryId: 12, categoryName: 'Entertainment', accountId: 3, accountName: 'Credit Card', clientVendorId: null, clientVendorName: '', status: 'completed', notes: 'Movie tickets', recurring: false },
  { id: 13, date: '2024-11-22', type: 'expense', amount: 299.99, categoryId: 13, categoryName: 'Shopping', accountId: 3, accountName: 'Credit Card', clientVendorId: null, clientVendorName: '', status: 'completed', notes: 'Clothing purchase', recurring: false },
  { id: 14, date: '2024-11-20', type: 'income', amount: 300, categoryId: 4, categoryName: 'Business', accountId: 4, accountName: 'Business Account', clientVendorId: 4, clientVendorName: 'Global Ventures', status: 'pending', notes: 'Consultation fee', recurring: false },
  { id: 15, date: '2024-11-18', type: 'expense', amount: 75, categoryId: 7, categoryName: 'Food', accountId: 1, accountName: 'Main Checking', clientVendorId: null, clientVendorName: '', status: 'completed', notes: 'Restaurant dinner', recurring: false },
];

// Add more transactions to reach 50 (continuing with similar pattern)
for (let i = 16; i <= 50; i++) {
  const isIncome = Math.random() > 0.3; // 30% income, 70% expense
  const date = generateRandomDate();
  
  if (isIncome) {
    const incomeCategories = categories.filter(c => c.type === 'income');
    const randomCategory = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
    const amount = Math.floor(Math.random() * 3000) + 500; // $500-$3500
    
    transactions.push({
      id: i,
      date: format(date, 'yyyy-MM-dd'),
      type: 'income',
      amount,
      categoryId: randomCategory.id,
      categoryName: randomCategory.name,
      accountId: Math.floor(Math.random() * 4) + 1,
      accountName: accounts[Math.floor(Math.random() * 4)].name,
      clientVendorId: Math.floor(Math.random() * 5) + 1,
      clientVendorName: clients[Math.floor(Math.random() * 5)].name,
      status: Math.random() > 0.1 ? 'completed' : 'pending',
      notes: `${randomCategory.name} payment`,
      recurring: Math.random() > 0.7
    });
  } else {
    const expenseCategories = categories.filter(c => c.type === 'expense');
    const randomCategory = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
    const amount = Math.floor(Math.random() * 500) + 20; // $20-$520
    
    transactions.push({
      id: i,
      date: format(date, 'yyyy-MM-dd'),
      type: 'expense',
      amount,
      categoryId: randomCategory.id,
      categoryName: randomCategory.name,
      accountId: Math.floor(Math.random() * 4) + 1,
      accountName: accounts[Math.floor(Math.random() * 4)].name,
      clientVendorId: Math.floor(Math.random() * 5) + 1,
      clientVendorName: vendors[Math.floor(Math.random() * 5)].name,
      status: Math.random() > 0.05 ? 'completed' : 'overdue',
      notes: `${randomCategory.name} expense`,
      recurring: Math.random() > 0.8
    });
  }
}

// Sort transactions by date (newest first)
transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

// Theme presets
export const themePresets = {
  'Blue Professional': {
    primary: '#2563eb',
    accent: '#0891b2', 
    success: '#059669',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b'
  },
  'Pastel': {
    primary: '#8b5cf6',
    accent: '#06b6d4',
    success: '#10b981',
    background: '#fefefe',
    surface: '#f1f5f9',
    text: '#334155'
  },
  'Dark': {
    primary: '#3b82f6',
    accent: '#14b8a6',
    success: '#22c55e',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9'
  }
};
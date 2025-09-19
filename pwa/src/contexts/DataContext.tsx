import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: number;
  date: string;
  notes?: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface Account {
  id: number;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  institution: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPaid: number;
  status: 'active' | 'inactive';
}

export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  totalSpent: number;
  status: 'active' | 'inactive';
}

export interface Budget {
  id: number;
  categoryId: number;
  monthlyBudget: number;
}

interface DataContextType {
  // State
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  clients: Client[];
  vendors: Vendor[];
  budgets: Budget[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: number, category: Partial<Category>) => void;
  deleteCategory: (id: number) => void;
  
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: number, account: Partial<Account>) => void;
  deleteAccount: (id: number) => void;
  
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: number, client: Partial<Client>) => void;
  deleteClient: (id: number) => void;
  
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: number, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: number) => void;
  
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: number, budget: Partial<Budget>) => void;
  deleteBudget: (id: number) => void;
  
  // Utilities
  getStats: () => {
    income: number;
    expenses: number;
    balance: number;
    transactionCount: number;
  };
  getSpendingByCategory: () => Record<number, number>;
  exportData: () => string;
  importData: (data: string) => { success: boolean; message: string };
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Default data
const defaultCategories: Category[] = [
  { id: 1, name: 'Food & Dining', type: 'expense', color: '#ef4444', icon: '🍽️' },
  { id: 2, name: 'Transportation', type: 'expense', color: '#f97316', icon: '🚗' },
  { id: 3, name: 'Shopping', type: 'expense', color: '#eab308', icon: '🛍️' },
  { id: 4, name: 'Entertainment', type: 'expense', color: '#22c55e', icon: '🎬' },
  { id: 5, name: 'Bills & Utilities', type: 'expense', color: '#3b82f6', icon: '💡' },
  { id: 6, name: 'Healthcare', type: 'expense', color: '#8b5cf6', icon: '🏥' },
  { id: 7, name: 'Education', type: 'expense', color: '#ec4899', icon: '📚' },
  { id: 8, name: 'Salary', type: 'income', color: '#10b981', icon: '💰' },
  { id: 9, name: 'Freelance', type: 'income', color: '#06b6d4', icon: '💼' },
  { id: 10, name: 'Investment', type: 'income', color: '#84cc16', icon: '📈' },
];

const defaultAccounts: Account[] = [
  { id: 1, name: 'Checking Account', type: 'checking', balance: 2500.00, institution: 'Bank of America' },
  { id: 2, name: 'Savings Account', type: 'savings', balance: 8750.50, institution: 'Chase Bank' },
  { id: 3, name: 'Credit Card', type: 'credit', balance: -1250.25, institution: 'Capital One' },
  { id: 4, name: 'Investment Account', type: 'investment', balance: 15420.75, institution: 'Fidelity' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [accounts, setAccounts] = useState<Account[]>(defaultAccounts);
  const [clients, setClients] = useState<Client[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('moneyflow_transactions');
    const savedCategories = localStorage.getItem('moneyflow_categories');
    const savedAccounts = localStorage.getItem('moneyflow_accounts');
    const savedClients = localStorage.getItem('moneyflow_clients');
    const savedVendors = localStorage.getItem('moneyflow_vendors');
    const savedBudgets = localStorage.getItem('moneyflow_budgets');

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      // Add some sample transactions for demo
      const sampleTransactions: Transaction[] = [
        { id: 1, description: 'Grocery Store', amount: 85.50, type: 'expense', categoryId: 1, date: '2025-09-15', notes: 'Weekly groceries' },
        { id: 2, description: 'Salary Deposit', amount: 3000.00, type: 'income', categoryId: 8, date: '2025-09-14', notes: 'Monthly salary' },
        { id: 3, description: 'Gas Station', amount: 45.20, type: 'expense', categoryId: 2, date: '2025-09-13', notes: 'Fuel' },
        { id: 4, description: 'Coffee Shop', amount: 12.75, type: 'expense', categoryId: 1, date: '2025-09-12', notes: 'Morning coffee' },
        { id: 5, description: 'Freelance Project', amount: 500.00, type: 'income', categoryId: 9, date: '2025-09-11', notes: 'Web design project' },
      ];
      setTransactions(sampleTransactions);
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(defaultCategories);
    }
    
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    } else {
      setAccounts(defaultAccounts);
    }
    
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      // Add sample clients
      const sampleClients: Client[] = [
        { id: 1, name: 'ABC Corporation', email: 'contact@abc-corp.com', phone: '+1-555-0123', address: '123 Business Ave, NY', totalPaid: 15420.50, status: 'active' },
        { id: 2, name: 'XYZ Enterprises', email: 'info@xyz-ent.com', phone: '+1-555-0456', address: '456 Commerce St, CA', totalPaid: 8750.00, status: 'active' },
      ];
      setClients(sampleClients);
    }
    
    if (savedVendors) {
      setVendors(JSON.parse(savedVendors));
    } else {
      // Add sample vendors
      const sampleVendors: Vendor[] = [
        { id: 1, name: 'Office Supply Co', email: 'orders@officesupply.com', phone: '+1-555-1111', address: '100 Supply St, NY', category: 'Office Supplies', totalSpent: 2450.75, status: 'active' },
        { id: 2, name: 'Tech Equipment Ltd', email: 'sales@techequip.com', phone: '+1-555-2222', address: '200 Tech Ave, CA', category: 'Technology', totalSpent: 8900.50, status: 'active' },
      ];
      setVendors(sampleVendors);
    }
    
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    } else {
      // Add sample budgets
      const sampleBudgets: Budget[] = [
        { id: 1, categoryId: 1, monthlyBudget: 300 },
        { id: 2, categoryId: 2, monthlyBudget: 200 },
        { id: 3, categoryId: 3, monthlyBudget: 150 },
      ];
      setBudgets(sampleBudgets);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('moneyflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('moneyflow_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('moneyflow_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('moneyflow_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('moneyflow_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('moneyflow_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Transaction CRUD
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      )
    );
  };

  const deleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  // Category CRUD
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: number, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === id ? { ...category, ...updates } : category
      )
    );
  };

  const deleteCategory = (id: number) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  // Account CRUD
  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...account,
      id: Date.now(),
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const updateAccount = (id: number, updates: Partial<Account>) => {
    setAccounts(prev =>
      prev.map(account =>
        account.id === id ? { ...account, ...updates } : account
      )
    );
  };

  const deleteAccount = (id: number) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
  };

  // Client CRUD
  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now(),
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: number, updates: Partial<Client>) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id ? { ...client, ...updates } : client
      )
    );
  };

  const deleteClient = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  // Vendor CRUD
  const addVendor = (vendor: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: Date.now(),
    };
    setVendors(prev => [...prev, newVendor]);
  };

  const updateVendor = (id: number, updates: Partial<Vendor>) => {
    setVendors(prev =>
      prev.map(vendor =>
        vendor.id === id ? { ...vendor, ...updates } : vendor
      )
    );
  };

  const deleteVendor = (id: number) => {
    setVendors(prev => prev.filter(vendor => vendor.id !== id));
  };

  // Budget CRUD
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now(),
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id: number, updates: Partial<Budget>) => {
    setBudgets(prev =>
      prev.map(budget =>
        budget.id === id ? { ...budget, ...updates } : budget
      )
    );
  };

  const deleteBudget = (id: number) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  // Utility functions
  const getStats = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      transactionCount: transactions.length,
    };
  };

  const getSpendingByCategory = () => {
    const spending: Record<number, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        spending[t.categoryId] = (spending[t.categoryId] || 0) + t.amount;
      });
    return spending;
  };

  const exportData = () => {
    const data = {
      transactions,
      categories,
      accounts,
      clients,
      vendors,
      budgets,
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0'
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.transactions) setTransactions(data.transactions);
      if (data.categories) setCategories(data.categories);
      if (data.accounts) setAccounts(data.accounts);
      if (data.clients) setClients(data.clients);
      if (data.vendors) setVendors(data.vendors);
      if (data.budgets) setBudgets(data.budgets);
      return { success: true, message: 'Data imported successfully!' };
    } catch (error) {
      return { success: false, message: 'Invalid JSON data' };
    }
  };

  const clearAllData = () => {
    setTransactions([]);
    setCategories(defaultCategories);
    setAccounts(defaultAccounts);
    setClients([]);
    setVendors([]);
    setBudgets([]);
  };

  const value: DataContextType = {
    // State
    transactions,
    categories,
    accounts,
    clients,
    vendors,
    budgets,
    
    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addAccount,
    updateAccount,
    deleteAccount,
    addClient,
    updateClient,
    deleteClient,
    addVendor,
    updateVendor,
    deleteVendor,
    addBudget,
    updateBudget,
    deleteBudget,
    
    // Utilities
    getStats,
    getSpendingByCategory,
    exportData,
    importData,
    clearAllData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
import React, { useState } from 'react';
import { MoreHorizontal, List, Upload, Plus } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard: React.FC = () => {
  const { transactions, categories, getStats, getSpendingByCategory } = useData();
  const { formatCurrency } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const stats = getStats();
  const spendingByCategory = getSpendingByCategory();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">💰 MoneyFlow Pro</h1>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="btn btn-secondary"
            >
              <MoreHorizontal size={20} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 w-48 z-50">
                <button
                  onClick={() => {
                    setShowAllTransactions(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <List size={16} />
                  <span>All Transactions</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                  <Upload size={16} />
                  <span>Import CSV/Excel</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <p className="page-subtitle">Your financial overview</p>
      </div>

      <div className="page-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card" style={{'--bg-from': '#3b82f6', '--bg-to': '#2563eb'} as React.CSSProperties}>
            <div className="stat-value">{formatCurrency(stats.income)}</div>
            <div className="stat-label">Income</div>
          </div>
          
          <div className="stat-card" style={{'--bg-from': '#ef4444', '--bg-to': '#dc2626'} as React.CSSProperties}>
            <div className="stat-value">{formatCurrency(stats.expenses)}</div>
            <div className="stat-label">Expenses</div>
          </div>
          
          <div className="stat-card" style={{'--bg-from': '#22c55e', '--bg-to': '#16a34a'} as React.CSSProperties}>
            <div className="stat-value">{formatCurrency(stats.balance)}</div>
            <div className="stat-label">Balance</div>
          </div>
          
          <div className="stat-card" style={{'--bg-from': '#8b5cf6', '--bg-to': '#7c3aed'} as React.CSSProperties}>
            <div className="stat-value">{stats.transactionCount}</div>
            <div className="stat-label">Transactions</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">Spending Overview</h3>
          <div className="text-center text-gray-500">
            {Object.keys(spendingByCategory).length > 0 
              ? `${Object.keys(spendingByCategory).length} categories with spending`
              : 'No spending data yet'
            }
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Transactions</h3>
            <button 
              onClick={() => setShowAllTransactions(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions yet</p>
              <p className="text-sm mt-2">Tap the + button to add your first transaction</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const category = categories.find(c => c.id === transaction.categoryId);
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <span>{category?.icon || '💰'}</span>
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category?.name} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* All Transactions Modal */}
      {showAllTransactions && (
        <div className="modal-overlay" onClick={() => setShowAllTransactions(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">All Transactions</h2>
              <button
                onClick={() => setShowAllTransactions(false)}
                className="modal-close"
              >
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No transactions yet</p>
                </div>
              ) : (
                transactions.map((transaction) => {
                  const category = categories.find(c => c.id === transaction.categoryId);
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span>{category?.icon || '💰'}</span>
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category?.name} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
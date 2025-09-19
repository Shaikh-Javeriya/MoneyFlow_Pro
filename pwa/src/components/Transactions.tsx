import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import QuickEntry from './QuickEntry';

const Transactions: React.FC = () => {
  const { transactions, categories } = useData();
  const { formatCurrency } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         categories.find(c => c.id === transaction.categoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">Transactions</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-input"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-500">
              {transactions.filter(t => t.type === 'income').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Income</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-500">
              {transactions.filter(t => t.type === 'expense').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Expenses</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-500">
              {transactions.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const category = categories.find(c => c.id === transaction.categoryId);
              return (
                <div key={transaction.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: category?.color + '20', color: category?.color }}
                      >
                        {category?.icon || '💰'}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description || 'Transaction'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category?.name || 'Unknown'} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showAddModal && (
        <QuickEntry onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default Transactions;
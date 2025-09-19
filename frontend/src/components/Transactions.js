import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';
import { transactions as mockTransactions, categories, accounts, clients, vendors } from '../data/mockData';

const Transactions = () => {
  const { formatCurrency } = useTheme();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.clientVendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddTransaction = (transactionData) => {
    const newTransaction = {
      id: Math.max(...transactions.map(t => t.id)) + 1,
      ...transactionData,
      date: format(new Date(transactionData.date), 'yyyy-MM-dd')
    };
    setTransactions([newTransaction, ...transactions]);
    setIsAddModalOpen(false);
  };

  const handleEditTransaction = (transactionData) => {
    setTransactions(transactions.map(t => 
      t.id === editingTransaction.id 
        ? { ...t, ...transactionData, date: format(new Date(transactionData.date), 'yyyy-MM-dd') }
        : t
    ));
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Type', 'Amount', 'Category', 'Account', 'Client/Vendor', 'Status', 'Notes'],
      ...filteredTransactions.map(t => [
        t.date, t.type, t.amount, t.categoryName, t.accountName, 
        t.clientVendorName, t.status, t.notes
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Transactions</h1>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 bg-[var(--color-accent)] text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 bg-[var(--color-success)] text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm">
              <Upload size={16} />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-tertiary)]">
              <tr>
                <th className="text-left p-4 font-semibold text-[var(--text-primary)]">Date</th>
                <th className="text-left p-4 font-semibold text-[var(--text-primary)]">Type</th>
                <th className="text-left p-4 font-semibold text-[var(--text-primary)]">Amount</th>
                <th className="text-left p-4 font-semibold text-[var(--text-primary)]">Category</th>
                <th className="text-left p-4 font-semibold text-[var(--text-primary)]">Account</th>
                <th className="text-left p-4 font-semibold text-[var(--text-primary)]">Client/Vendor</th>
                <th className="text-left p-4 font-semibold text-[var(--text-primary)]">Status</th>
                <th className="text-left p-4 font-semibold text-[var(--text-primary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="p-4 text-[var(--text-primary)]">
                    {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`p-4 font-semibold ${
                    transaction.type === 'income' ? 'text-[var(--color-success)]' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="p-4 text-[var(--text-primary)]">{transaction.categoryName}</td>
                  <td className="p-4 text-[var(--text-primary)]">{transaction.accountName}</td>
                  <td className="p-4 text-[var(--text-primary)]">{transaction.clientVendorName || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  transaction.type === 'income' ? 'bg-[var(--color-success)]' : 'bg-red-500'
                }`} />
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{transaction.categoryName}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingTransaction(transaction)}
                  className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-[var(--text-secondary)]">Amount:</span>
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-[var(--color-success)]' : 'text-red-500'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Account:</span>
                <p className="text-[var(--text-primary)]">{transaction.accountName}</p>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Client/Vendor:</span>
                <p className="text-[var(--text-primary)]">{transaction.clientVendorName || '-'}</p>
              </div>
            </div>
            
            {transaction.notes && (
              <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)] text-sm">Notes:</span>
                <p className="text-[var(--text-primary)] text-sm mt-1">{transaction.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingTransaction) && (
        <TransactionModal
          transaction={editingTransaction}
          isOpen={isAddModalOpen || !!editingTransaction}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingTransaction(null);
          }}
          onSave={editingTransaction ? handleEditTransaction : handleAddTransaction}
        />
      )}
    </div>
  );
};

// Transaction Modal Component
const TransactionModal = ({ transaction, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: transaction?.date || format(new Date(), 'yyyy-MM-dd'),
    type: transaction?.type || 'expense',
    amount: transaction?.amount || '',
    categoryId: transaction?.categoryId || '',
    accountId: transaction?.accountId || '',
    clientVendorId: transaction?.clientVendorId || '',
    status: transaction?.status || 'completed',
    notes: transaction?.notes || '',
    recurring: transaction?.recurring || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const category = categories.find(c => c.id === parseInt(formData.categoryId));
    const account = accounts.find(a => a.id === parseInt(formData.accountId));
    const clientVendor = formData.clientVendorId ? 
      [...clients, ...vendors].find(cv => cv.id === parseInt(formData.clientVendorId)) : null;

    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
      categoryId: parseInt(formData.categoryId),
      categoryName: category?.name || '',
      accountId: parseInt(formData.accountId),
      accountName: account?.name || '',
      clientVendorId: formData.clientVendorId ? parseInt(formData.clientVendorId) : null,
      clientVendorName: clientVendor?.name || ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories
                  .filter(c => c.type === formData.type)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Account</label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                required
              >
                <option value="">Select Account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Client/Vendor (Optional)
            </label>
            <select
              value={formData.clientVendorId}
              onChange={(e) => setFormData({...formData, clientVendorId: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            >
              <option value="">Select Client/Vendor</option>
              <optgroup label="Clients">
                {clients.map(client => (
                  <option key={`client-${client.id}`} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Vendors">
                {vendors.map(vendor => (
                  <option key={`vendor-${vendor.id}`} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.recurring}
              onChange={(e) => setFormData({...formData, recurring: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="recurring" className="text-sm text-[var(--text-primary)]">
              Recurring Transaction
            </label>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              {transaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)] py-2 px-4 rounded-lg hover:bg-[var(--border-color)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Transactions;
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, DollarSign, CreditCard, Building, TrendingUp } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const Accounts = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useData();
  const { formatCurrency } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const assets = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
  const liabilities = Math.abs(accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0));

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteAccount(id);
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setShowAddModal(true);
  };

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case 'checking': return <Building className="w-6 h-6" />;
      case 'savings': return <DollarSign className="w-6 h-6" />;
      case 'credit': return <CreditCard className="w-6 h-6" />;
      case 'investment': return <TrendingUp className="w-6 h-6" />;
      default: return <Building className="w-6 h-6" />;
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">Accounts</h1>
          <button
            onClick={() => {
              setEditingAccount(null);
              setShowAddModal(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Account
          </button>
        </div>
        <p className="page-subtitle">Track your bank accounts</p>
      </div>

      <div className="page-content">
        <div className="card mb-6">
          <div className="text-center mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Net Worth</p>
            <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalBalance)}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Across {accounts.length} accounts</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{formatCurrency(assets)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Assets</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{formatCurrency(liabilities)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Liabilities</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {accounts.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500">No accounts yet</p>
              <p className="text-sm text-gray-400 mt-2">Add accounts to track your finances</p>
            </div>
          ) : (
            accounts.map((account) => (
              <div key={account.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      account.balance >= 0 ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'
                    }`}>
                      {getAccountTypeIcon(account.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{account.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{account.institution}</p>
                      <p className="text-xs text-gray-500 capitalize">{account.type} Account</p>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(account)}
                      className="btn btn-sm btn-secondary"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="btn btn-sm btn-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
                    <p className={`text-2xl font-bold ${
                      account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                  <div className="w-24">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          account.balance >= 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(Math.abs(account.balance / 10000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <AccountModal
          account={editingAccount}
          onClose={() => {
            setShowAddModal(false);
            setEditingAccount(null);
          }}
          onSave={(data) => {
            if (editingAccount) {
              updateAccount(editingAccount.id, data);
            } else {
              addAccount(data);
            }
            setShowAddModal(false);
            setEditingAccount(null);
          }}
        />
      )}
    </div>
  );
};

const AccountModal = ({ account, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || 'checking',
    balance: account?.balance || '',
    institution: account?.institution || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.institution) {
      alert('Please fill in all required fields');
      return;
    }
    onSave({
      ...formData,
      balance: parseFloat(formData.balance) || 0,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {account ? 'Edit Account' : 'Add Account'}
          </h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Account Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g., Checking Account"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="form-input"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit">Credit Card</option>
              <option value="investment">Investment</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Institution *</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="form-input"
              placeholder="e.g., Bank of America"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Balance</label>
            <input
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              className="form-input"
              placeholder="0.00"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {account ? 'Update Account' : 'Add Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Accounts;
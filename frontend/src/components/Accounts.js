import React, { useState } from 'react';
import { Plus, Edit, Trash2, Wallet, CreditCard, Landmark, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { accounts as mockAccounts } from '../data/mockData';

const Accounts = () => {
  const { formatCurrency } = useTheme();
  const [accounts, setAccounts] = useState(mockAccounts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const handleAddAccount = (accountData) => {
    const newAccount = {
      id: Math.max(...accounts.map(a => a.id)) + 1,
      ...accountData,
      balance: parseFloat(accountData.balance),
      lowBalanceThreshold: parseFloat(accountData.lowBalanceThreshold)
    };
    setAccounts([...accounts, newAccount]);
    setIsAddModalOpen(false);
  };

  const handleEditAccount = (accountData) => {
    setAccounts(accounts.map(a => 
      a.id === editingAccount.id 
        ? { 
            ...a, 
            ...accountData, 
            balance: parseFloat(accountData.balance),
            lowBalanceThreshold: parseFloat(accountData.lowBalanceThreshold)
          } 
        : a
    ));
    setEditingAccount(null);
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking':
        return <Wallet className="text-[var(--color-primary)]" size={24} />;
      case 'savings':
        return <Landmark className="text-[var(--color-success)]" size={24} />;
      case 'credit':
        return <CreditCard className="text-[var(--color-accent)]" size={24} />;
      default:
        return <Wallet className="text-[var(--color-primary)]" size={24} />;
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const getLowBalanceAccounts = () => {
    return accounts.filter(account => account.balance <= account.lowBalanceThreshold);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Accounts</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity mt-4 sm:mt-0"
        >
          <Plus size={20} />
          <span>Add Account</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Balance</p>
              <p className={`text-xl font-bold ${getTotalBalance() >= 0 ? 'text-[var(--color-success)]' : 'text-red-500'}`}>
                {formatCurrency(getTotalBalance())}
              </p>
            </div>
            <Wallet className="text-[var(--color-primary)]" size={24} />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Accounts</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{accounts.length}</p>
            </div>
            <Landmark className="text-[var(--color-accent)]" size={24} />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Low Balance Alerts</p>
              <p className="text-xl font-bold text-red-500">{getLowBalanceAccounts().length}</p>
            </div>
            <AlertTriangle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Low Balance Alerts */}
      {getLowBalanceAccounts().length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="font-semibold text-red-800">Low Balance Alerts</h3>
          </div>
          <div className="space-y-2">
            {getLowBalanceAccounts().map((account) => (
              <p key={account.id} className="text-red-700 text-sm">
                <strong>{account.name}</strong> is below threshold: {formatCurrency(account.balance)} 
                (Threshold: {formatCurrency(account.lowBalanceThreshold)})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getAccountIcon(account.type)}
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{account.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)] capitalize">{account.type}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingAccount(account)}
                  className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Current Balance</p>
                <p className={`text-2xl font-bold ${
                  account.balance >= 0 ? 'text-[var(--color-success)]' : 'text-red-500'
                }`}>
                  {formatCurrency(account.balance)}
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--text-secondary)]">Low Balance Threshold</p>
                <p className="text-lg text-[var(--text-primary)]">
                  {formatCurrency(account.lowBalanceThreshold)}
                </p>
              </div>

              {account.balance <= account.lowBalanceThreshold && (
                <div className="flex items-center space-x-2 p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="text-red-500" size={16} />
                  <span className="text-red-700 text-sm font-medium">Low Balance Alert</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingAccount) && (
        <AccountModal
          account={editingAccount}
          isOpen={isAddModalOpen || !!editingAccount}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingAccount(null);
          }}
          onSave={editingAccount ? handleEditAccount : handleAddAccount}
        />
      )}
    </div>
  );
};

// Account Modal Component
const AccountModal = ({ account, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || 'checking',
    balance: account?.balance || '',
    lowBalanceThreshold: account?.lowBalanceThreshold || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {account ? 'Edit Account' : 'Add Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Account Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
              placeholder="Account name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Account Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit">Credit Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Current Balance</label>
            <input
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData({...formData, balance: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Low Balance Threshold</label>
            <input
              type="number"
              step="0.01"
              value={formData.lowBalanceThreshold}
              onChange={(e) => setFormData({...formData, lowBalanceThreshold: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
              placeholder="0.00"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              You'll receive alerts when balance goes below this amount
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              {account ? 'Update Account' : 'Add Account'}
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

export default Accounts;
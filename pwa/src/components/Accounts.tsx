import React from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const Accounts: React.FC = () => {
  const { accounts } = useData();
  const { formatCurrency } = useTheme();

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Accounts</h1>
        <p className="page-subtitle">Track your bank accounts</p>
      </div>

      <div className="page-content">
        <div className="card mb-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Balance</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalBalance)}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Across {accounts.length} accounts</p>
          </div>
        </div>

        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{account.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{account.institution}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {account.type} Account
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
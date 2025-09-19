import React, { useState } from 'react';
import { MoreHorizontal, List, Upload, Plus, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { transactions, categories, accounts, clients, getStats, getSpendingByCategory } = useData();
  const { formatCurrency } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const stats = getStats();
  const spendingByCategory = getSpendingByCategory();
  const recentTransactions = transactions.slice(0, 5);

  // Chart data
  const categoryChartData = {
    labels: Object.keys(spendingByCategory).map(id => {
      const cat = categories.find(c => c.id === parseInt(id));
      return cat ? cat.name : 'Unknown';
    }),
    datasets: [
      {
        data: Object.values(spendingByCategory),
        backgroundColor: Object.keys(spendingByCategory).map(id => {
          const cat = categories.find(c => c.id === parseInt(id));
          return cat ? cat.color : '#6b7280';
        }),
        borderWidth: 0,
      },
    ],
  };

  const incomeVsExpenseData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [stats.income, stats.expenses],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderRadius: 8,
      },
    ],
  };

  const monthlyTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: [stats.income],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [stats.expenses],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: '70%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">💰 MoneyFlow Pro</h1>

        </div>

        <p className="page-subtitle">Your financial overview</p>
      </div>

      <div className="page-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card" style={{ '--bg-from': '#22c55e', '--bg-to': '#16a34a' }}>
            <div className="stat-value">{formatCurrency(stats.income)}</div>
            <div className="stat-label">Total Income</div>
          </div>

          <div className="stat-card" style={{ '--bg-from': '#ef4444', '--bg-to': '#dc2626' }}>
            <div className="stat-value">{formatCurrency(stats.expenses)}</div>
            <div className="stat-label">Total Expenses</div>
          </div>

          <div className="stat-card" style={{ '--bg-from': 'var(--color-primary)', '--bg-to': 'var(--color-primary-light)' }}>
            <div className="stat-value">{formatCurrency(stats.balance)}</div>
            <div className="stat-label">Net Balance</div>
          </div>

          <div className="stat-card" style={{ '--bg-from': '#8b5cf6', '--bg-to': '#7c3aed' }}>
            <div className="stat-value">{stats.transactionCount}</div>
            <div className="stat-label">Transactions</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Category Spending Chart */}
          <div className="card">
            <h3 className="font-semibold mb-4 text-center">Spending by Category</h3>
            <div className="chart-container chart-small">
              {Object.keys(spendingByCategory).length > 0 ? (
                <Doughnut data={categoryChartData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No spending data</p>
                </div>
              )}
            </div>
          </div>

          {/* Income vs Expenses */}
          <div className="card">
            <h3 className="font-semibold mb-4 text-center">Income vs Expenses</h3>
            <div className="chart-container chart-small">
              <Bar data={incomeVsExpenseData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="card mb-4">
          <h3 className="font-semibold mb-4 text-center">Monthly Trend</h3>
          <div className="chart-container">
            <Line data={monthlyTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Account Balances */}
        <div className="card mb-4">
          <h3 className="font-semibold mb-4">Account Balances</h3>
          <div className="space-y-3">
            {accounts.slice(0, 4).map((account) => {
              const percentage = Math.abs(account.balance / 10000) * 100;
              return (
                <div key={account.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{account.institution}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(account.balance)}
                    </p>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${account.balance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Clients */}
        <div className="card mb-4">
          <h3 className="font-semibold mb-4">Top Clients</h3>
          <div className="space-y-3">
            {clients.slice(0, 3).map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{client.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(client.totalPaid)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Table */}
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
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => {
                    const category = categories.find(c => c.id === transaction.categoryId);
                    return (
                      <tr key={transaction.id}>
                        <td>
                          <div className="flex items-center space-x-2">
                            <span>{category?.icon || '💰'}</span>
                            <span className="font-medium">{transaction.description}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-sm">{category?.name || 'Unknown'}</span>
                        </td>
                        <td>
                          <span className="text-sm">{transaction.date}</span>
                        </td>
                        <td className="text-right">
                          <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                      <div className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
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
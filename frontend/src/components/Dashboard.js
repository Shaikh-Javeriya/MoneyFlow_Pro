import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { useTheme } from '../contexts/ThemeContext';
import { dashboardAPI, transactionsAPI, accountsAPI, categoriesAPI } from '../services/api';
import { useApi } from '../hooks/useApi';
import { format, parseISO, subDays, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const { formatCurrency } = useTheme();
  
  // Fetch data from API
  const { data: kpis, loading: kpisLoading, error: kpisError, refetch: refetchKpis } = useApi(() => dashboardAPI.getKPIs());
  const { data: transactions, loading: transactionsLoading, refetch: refetchTransactions } = useApi(() => transactionsAPI.getAll());
  const { data: accounts, loading: accountsLoading, refetch: refetchAccounts } = useApi(() => accountsAPI.getAll());
  const { data: categories, loading: categoriesLoading, refetch: refetchCategories } = useApi(() => categoriesAPI.getAll());

  // Refresh all data
  const refreshDashboard = () => {
    refetchKpis();
    refetchTransactions();
    refetchAccounts();
    refetchCategories();
  };

  // Loading state
  if (kpisLoading || transactionsLoading || accountsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
        <span className="ml-2 text-[var(--text-secondary)]">Loading dashboard...</span>
      </div>
    );
  }

  // Error state
  if (kpisError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading dashboard: {kpisError.message}</p>
      </div>
    );
  }

  // Use API data or fallback to empty arrays
  const safeTransactions = transactions || [];
  const safeAccounts = accounts || [];
  const safeCategories = categories || [];

  // Debug: Log transaction data to understand format
  if (safeTransactions.length > 0) {
    console.log('Sample transaction:', safeTransactions[0]);
    console.log('Today\'s date:', format(new Date(), 'yyyy-MM-dd'));
  }

  // Use API KPIs or calculate from transactions as fallback
  const totalIncome = kpis?.totalIncome || safeTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = kpis?.totalExpenses || safeTransactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = kpis?.balance || (totalIncome - totalExpenses);
  const netProfit = kpis?.netProfit || (balance > 0 ? balance : 0);
  
  const pendingTransactions = kpis?.pendingTransactions || safeTransactions.filter(t => t.status === 'pending').length;
  const overdueTransactions = kpis?.overdueTransactions || safeTransactions.filter(t => t.status === 'overdue').length;

  // Recent transactions (5 most recent)
  const recentTransactions = safeTransactions.slice(0, 5);

  // Chart data preparation - Use actual transaction date range
  const transactionDates = safeTransactions.map(t => t.date).filter(Boolean).sort();
  const earliestDate = transactionDates.length > 0 ? parseISO(transactionDates[0]) : subDays(new Date(), 29);
  const latestDate = transactionDates.length > 0 ? parseISO(transactionDates[transactionDates.length - 1]) : new Date();
  
  // Create date range from earliest to latest transaction date, or show last 30 days if no transactions
  const daysDiff = Math.max(30, Math.ceil((latestDate - earliestDate) / (1000 * 60 * 60 * 24)) + 1);
  const dateRange = Array.from({ length: Math.min(daysDiff, 30) }, (_, i) => {
    const date = subDays(latestDate, Math.min(daysDiff, 30) - 1 - i);
    return format(date, 'yyyy-MM-dd');
  });

  // Group transactions by date for better performance
  const transactionsByDate = safeTransactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = { income: 0, expense: 0 };
    }
    if (transaction.status === 'completed') {
      if (transaction.type === 'income') {
        acc[date].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        acc[date].expense += transaction.amount;
      }
    }
    return acc;
  }, {});

  console.log('Transactions by date:', transactionsByDate);

  const incomeExpenseData = {
    labels: dateRange.map(date => format(parseISO(date), 'MMM dd')),
    datasets: [
      {
        label: 'Income',
        data: dateRange.map(date => transactionsByDate[date]?.income || 0),
        borderColor: 'var(--color-success)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: dateRange.map(date => transactionsByDate[date]?.expense || 0),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Category breakdown for doughnut chart
  const expensesByCategory = safeCategories
    .filter(c => c.type === 'expense')
    .map(category => ({
      ...category,
      amount: safeTransactions
        .filter(t => t.type === 'expense' && t.categoryId === category.id && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
    }))
    .filter(c => c.amount > 0);

  const categoryData = {
    labels: expensesByCategory.map(c => c.name),
    datasets: [
      {
        data: expensesByCategory.map(c => c.amount),
        backgroundColor: expensesByCategory.map(c => c.color),
        borderWidth: 0,
      },
    ],
  };

  // Account balances for bar chart
  const accountData = {
    labels: safeAccounts.map(a => a.name),
    datasets: [
      {
        label: 'Balance',
        data: safeAccounts.map(a => a.balance),
        backgroundColor: safeAccounts.map(a => 
          a.balance > 0 ? 'var(--color-success)' : '#ef4444'
        ),
        borderRadius: 8,
      },
    ],
  };

  // Monthly spending trend - Use actual transaction months
  const monthlyTrendData = (() => {
    // Get unique months from transactions
    const transactionMonths = [...new Set(safeTransactions.map(t => t.date.substring(0, 7)))].sort();
    const months = transactionMonths.length > 0 
      ? transactionMonths.map(monthStr => parseISO(monthStr + '-01'))
      : eachMonthOfInterval({
          start: subMonths(new Date(), 5),
          end: new Date()
        });

    // Group transactions by month-year
    const transactionsByMonth = safeTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense' && transaction.status === 'completed') {
        const monthYear = transaction.date.substring(0, 7); // Extract YYYY-MM
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear] += transaction.amount;
      }
      return acc;
    }, {});

    console.log('Transactions by month:', transactionsByMonth);

    return {
      labels: months.map(month => format(month, 'MMM yyyy')),
      datasets: [
        {
          label: 'Monthly Spending',
          data: months.map(month => {
            const monthYear = format(month, 'yyyy-MM');
            return transactionsByMonth[monthYear] || 0;
          }),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  })();

  // Top expense categories (horizontal bar)
  const topCategoriesData = (() => {
    const categoryTotals = safeCategories
      .filter(c => c.type === 'expense')
      .map(category => ({
        ...category,
        total: safeTransactions
          .filter(t => t.type === 'expense' && t.categoryId === category.id && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0)
      }))
      .filter(c => c.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      labels: categoryTotals.map(c => c.name),
      datasets: [
        {
          label: 'Total Spent',
          data: categoryTotals.map(c => c.total),
          backgroundColor: categoryTotals.map(c => c.color),
          borderRadius: 4,
        },
      ],
    };
  })();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'var(--border-color)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          color: 'var(--border-color)',
        }
      }
    }
  };

  const horizontalChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'var(--border-color)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      y: {
        grid: {
          color: 'var(--border-color)',
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <button
            onClick={refreshDashboard}
            disabled={kpisLoading || transactionsLoading || accountsLoading || categoriesLoading}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors disabled:opacity-50"
            title="Refresh all charts and data"
          >
            <RefreshCw 
              size={16} 
              className={`${(kpisLoading || transactionsLoading || accountsLoading || categoriesLoading) ? 'animate-spin' : ''}`} 
            />
            <span>Refresh</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)] mt-2 sm:mt-0">
          <Clock size={16} />
          <span>Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Balance</p>
              <p className={`text-xl font-bold ${balance >= 0 ? 'text-[var(--color-success)]' : 'text-red-500'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <DollarSign className="text-[var(--color-primary)]" size={24} />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Income</p>
              <p className="text-xl font-bold text-[var(--color-success)]">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <TrendingUp className="text-[var(--color-success)]" size={24} />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Expenses</p>
              <p className="text-xl font-bold text-red-500">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <TrendingDown className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Net Profit</p>
              <p className="text-xl font-bold text-[var(--color-success)]">
                {formatCurrency(netProfit)}
              </p>
            </div>
            <CheckCircle className="text-[var(--color-success)]" size={24} />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Pending</p>
              <p className="text-xl font-bold text-[var(--color-accent)]">
                {pendingTransactions}
              </p>
            </div>
            <Clock className="text-[var(--color-accent)]" size={24} />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Overdue</p>
              <p className="text-xl font-bold text-red-500">
                {overdueTransactions}
              </p>
            </div>
            <AlertTriangle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Income vs Expense Trend */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses (Recent Days)</h3>
          <div className="h-64">
            <Line data={incomeExpenseData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Spending Trend */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Spending Trend</h3>
          <div className="h-64">
            <Line data={monthlyTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Top Expense Categories */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top Expense Categories</h3>
          <div className="h-64">
            <Bar data={topCategoriesData} options={horizontalChartOptions} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
          <div className="h-64">
            <Doughnut 
              data={categoryData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                    }
                  },
                }
              }} 
            />
          </div>
        </div>

        {/* Account Balances */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Account Balances</h3>
          <div className="h-64">
            <Bar data={accountData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-[var(--color-success)]' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">{transaction.categoryName}</p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {format(parseISO(transaction.date), 'MMM dd')} • {transaction.accountName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-[var(--color-success)]' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
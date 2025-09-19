import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../contexts/ThemeContext';
import { budgets as mockBudgets, categories } from '../data/mockData';

const Budget = () => {
  const { formatCurrency } = useTheme();
  const [budgets, setBudgets] = useState(mockBudgets);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const handleAddBudget = (budgetData) => {
    const category = categories.find(c => c.id === parseInt(budgetData.categoryId));
    const newBudget = {
      categoryId: parseInt(budgetData.categoryId),
      categoryName: category?.name || '',
      monthlyBudget: parseFloat(budgetData.monthlyBudget),
      spent: 0
    };
    setBudgets([...budgets, newBudget]);
    setIsAddModalOpen(false);
  };

  const handleEditBudget = (budgetData) => {
    const category = categories.find(c => c.id === parseInt(budgetData.categoryId));
    setBudgets(budgets.map(b => 
      b.categoryId === editingBudget.categoryId 
        ? {
            ...b,
            categoryId: parseInt(budgetData.categoryId),
            categoryName: category?.name || '',
            monthlyBudget: parseFloat(budgetData.monthlyBudget)
          }
        : b
    ));
    setEditingBudget(null);
  };

  const handleDeleteBudget = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(b => b.categoryId !== categoryId));
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyBudget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCategories = budgets.filter(b => b.spent > b.monthlyBudget);

  // Chart data
  const chartData = {
    labels: budgets.map(b => b.categoryName),
    datasets: [
      {
        label: 'Budget',
        data: budgets.map(b => b.monthlyBudget),
        backgroundColor: 'var(--color-primary)',
        borderRadius: 4,
      },
      {
        label: 'Spent',
        data: budgets.map(b => b.spent),
        backgroundColor: budgets.map(b => b.spent > b.monthlyBudget ? '#ef4444' : 'var(--color-success)'),
        borderRadius: 4,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Budget</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity mt-4 sm:mt-0"
        >
          <Plus size={20} />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Budget</p>
              <p className="text-xl font-bold text-[var(--color-primary)]">
                {formatCurrency(totalBudget)}
              </p>
            </div>
            <Target className="text-[var(--color-primary)]" size={24} />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Spent</p>
              <p className={`text-xl font-bold ${totalSpent > totalBudget ? 'text-red-500' : 'text-[var(--color-success)]'}`}>
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <TrendingUp className={totalSpent > totalBudget ? 'text-red-500' : 'text-[var(--color-success)]'} size={24} />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Over Budget</p>
              <p className="text-xl font-bold text-red-500">{overBudgetCategories.length}</p>
            </div>
            <AlertTriangle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Over Budget Alerts */}
      {overBudgetCategories.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="font-semibold text-red-800">Budget Exceeded</h3>
          </div>
          <div className="space-y-2">
            {overBudgetCategories.map((budget) => (
              <p key={budget.categoryId} className="text-red-700 text-sm">
                <strong>{budget.categoryName}</strong>: {formatCurrency(budget.spent)} spent 
                ({formatCurrency(budget.spent - budget.monthlyBudget)} over budget)
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Chart */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Budget vs Spent</h3>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Budget List */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Budget Details</h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.monthlyBudget) * 100;
              const isOverBudget = budget.spent > budget.monthlyBudget;
              
              return (
                <div key={budget.categoryId} className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[var(--text-primary)]">{budget.categoryName}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingBudget(budget)}
                        className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget.categoryId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-[var(--text-secondary)] mb-2">
                    <span>{formatCurrency(budget.spent)} spent</span>
                    <span>{formatCurrency(budget.monthlyBudget)} budget</span>
                  </div>
                  
                  <div className="w-full bg-[var(--border-color)] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isOverBudget ? 'bg-red-500' : 'bg-[var(--color-success)]'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs mt-1">
                    <span className={`font-medium ${isOverBudget ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                      {percentage.toFixed(1)}%
                    </span>
                    {isOverBudget && (
                      <span className="text-red-500 font-medium">
                        {formatCurrency(budget.spent - budget.monthlyBudget)} over
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingBudget) && (
        <BudgetModal
          budget={editingBudget}
          isOpen={isAddModalOpen || !!editingBudget}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingBudget(null);
          }}
          onSave={editingBudget ? handleEditBudget : handleAddBudget}
          existingBudgets={budgets}
        />
      )}
    </div>
  );
};

// Budget Modal Component
const BudgetModal = ({ budget, isOpen, onClose, onSave, existingBudgets }) => {
  const [formData, setFormData] = useState({
    categoryId: budget?.categoryId || '',
    monthlyBudget: budget?.monthlyBudget || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  // Filter out expense categories that already have budgets (except when editing)
  const availableCategories = categories
    .filter(c => c.type === 'expense')
    .filter(c => 
      !existingBudgets.some(b => b.categoryId === c.id) || 
      (budget && budget.categoryId === c.id)
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {budget ? 'Edit Budget' : 'Add Budget'}
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
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {availableCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Monthly Budget</label>
            <input
              type="number"
              step="0.01"
              value={formData.monthlyBudget}
              onChange={(e) => setFormData({...formData, monthlyBudget: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
              placeholder="0.00"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              {budget ? 'Update Budget' : 'Add Budget'}
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

export default Budget;
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Target } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const Budget = () => {
  const { budgets, categories, getSpendingByCategory, addBudget, updateBudget, deleteBudget } = useData();
  const { formatCurrency } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  
  const spendingByCategory = getSpendingByCategory();
  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyBudget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (spendingByCategory[b.categoryId] || 0), 0);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowAddModal(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">Budget</h1>
          <button
            onClick={() => {
              setEditingBudget(null);
              setShowAddModal(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Budget
          </button>
        </div>
        <p className="page-subtitle">Monitor your spending limits</p>
      </div>

      <div className="page-content">
        {/* Budget Overview */}
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">Budget Overview</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBudget)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${totalSpent > totalBudget ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-300 ${
                totalSpent > totalBudget ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm mt-2">
            <span>{formatCurrency(0)}</span>
            <span className={totalSpent > totalBudget ? 'text-red-600 font-semibold' : ''}>
              {((totalSpent / totalBudget) * 100).toFixed(1)}% used
            </span>
            <span>{formatCurrency(totalBudget)}</span>
          </div>
        </div>

        {budgets.length === 0 ? (
          <div className="card text-center py-8">
            <Target size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No budgets set yet</p>
            <p className="text-sm text-gray-400">Set budgets to track your spending limits</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const category = categories.find(c => c.id === budget.categoryId);
              const spent = spendingByCategory[budget.categoryId] || 0;
              const percentage = (spent / budget.monthlyBudget) * 100;
              const isOverBudget = spent > budget.monthlyBudget;
              const remaining = budget.monthlyBudget - spent;
              
              return (
                <div key={budget.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: category?.color + '20', color: category?.color }}
                      >
                        {category?.icon || '💰'}
                      </div>
                      <div>
                        <p className="font-semibold">{category?.name || 'Unknown Category'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Budget: {formatCurrency(budget.monthlyBudget)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(spent)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {percentage.toFixed(1)}% used
                        </p>
                      </div>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="btn btn-sm btn-secondary"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isOverBudget ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>{formatCurrency(0)}</span>
                      <span className={isOverBudget ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                        {isOverBudget 
                          ? `Over by ${formatCurrency(Math.abs(remaining))}` 
                          : `${formatCurrency(remaining)} remaining`
                        }
                      </span>
                      <span>{formatCurrency(budget.monthlyBudget)}</span>
                    </div>
                  </div>
                  
                  {isOverBudget && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <p className="text-sm text-red-700 dark:text-red-300 flex items-center">
                        <span className="mr-2">⚠️</span>
                        Budget exceeded! Consider reviewing your spending in this category.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <BudgetModal
          budget={editingBudget}
          onClose={() => {
            setShowAddModal(false);
            setEditingBudget(null);
          }}
          onSave={(data) => {
            if (editingBudget) {
              updateBudget(editingBudget.id, data);
            } else {
              addBudget(data);
            }
            setShowAddModal(false);
            setEditingBudget(null);
          }}
        />
      )}
    </div>
  );
};

const BudgetModal = ({ budget, onClose, onSave }) => {
  const { categories } = useData();
  const [formData, setFormData] = useState({
    categoryId: budget?.categoryId || '',
    monthlyBudget: budget?.monthlyBudget || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.monthlyBudget) {
      alert('Please fill in all required fields');
      return;
    }
    onSave({
      ...formData,
      categoryId: parseInt(formData.categoryId),
      monthlyBudget: parseFloat(formData.monthlyBudget),
    });
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {budget ? 'Edit Budget' : 'Add Budget'}
          </h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="form-input"
              required
            >
              <option value="">Select category</option>
              {expenseCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Budget *</label>
            <input
              type="number"
              step="0.01"
              value={formData.monthlyBudget}
              onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
              className="form-input"
              placeholder="0.00"
              required
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 Tip: Set realistic budgets based on your spending history. You can always adjust them later.
            </p>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {budget ? 'Update Budget' : 'Add Budget'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Budget;
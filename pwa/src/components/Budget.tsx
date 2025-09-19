import React from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const Budget: React.FC = () => {
  const { budgets, categories, getSpendingByCategory } = useData();
  const { formatCurrency } = useTheme();
  
  const spendingByCategory = getSpendingByCategory();

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Budget</h1>
        <p className="page-subtitle">Monitor your spending limits</p>
      </div>

      <div className="page-content">
        {budgets.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No budgets set yet</p>
            <p className="text-sm text-gray-400 mt-2">Set budgets to track your spending</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const category = categories.find(c => c.id === budget.categoryId);
              const spent = spendingByCategory[budget.categoryId] || 0;
              const percentage = (spent / budget.monthlyBudget) * 100;
              const isOverBudget = spent > budget.monthlyBudget;
              
              return (
                <div key={budget.id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category?.color + '20', color: category?.color }}
                      >
                        {category?.icon || '💰'}
                      </div>
                      <div>
                        <p className="font-semibold">{category?.name || 'Unknown Category'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Monthly Budget: {formatCurrency(budget.monthlyBudget)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(spent)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {percentage.toFixed(1)}% used
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isOverBudget ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  
                  {isOverBudget && (
                    <p className="text-sm text-red-600 mt-2">
                      ⚠️ Over budget by {formatCurrency(spent - budget.monthlyBudget)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
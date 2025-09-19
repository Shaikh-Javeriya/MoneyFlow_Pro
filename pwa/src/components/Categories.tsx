import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData, Category } from '../contexts/DataContext';

const Categories: React.FC = () => {
  const { categories, addCategory } = useData();
  const [showAddModal, setShowAddModal] = useState(false);

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">Categories</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
          </button>
        </div>
        <p className="page-subtitle">Organize your transactions</p>
      </div>

      <div className="page-content space-y-6">
        {/* Income Categories */}
        <div className="card">
          <h2 className="font-semibold mb-4 text-green-600">Income Categories ({incomeCategories.length})</h2>
          <div className="grid grid-cols-2 gap-3">
            {incomeCategories.map(category => (
              <div key={category.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="card">
          <h2 className="font-semibold mb-4 text-red-600">Expense Categories ({expenseCategories.length})</h2>
          <div className="grid grid-cols-2 gap-3">
            {expenseCategories.map(category => (
              <div key={category.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <CategoryModal
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            addCategory(data);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

interface CategoryModalProps {
  onClose: () => void;
  onSave: (data: Omit<Category, 'id'>) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    color: '#3b82f6',
    icon: '💰'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a category name');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Category</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g., Food & Dining"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`btn ${formData.type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`btn ${formData.type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Expense
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Icon</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="form-input"
              placeholder="🍽️"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="form-input h-12"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default Categories;
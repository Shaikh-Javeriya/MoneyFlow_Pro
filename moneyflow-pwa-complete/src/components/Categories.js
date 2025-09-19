import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const iconOptions = [
  '🍽️', '🚗', '🛍️', '🎬', '💡', '🏥', '📚', '💰', '💼', '📈',
  '🏠', '✈️', '💳', '🎵', '🏋️', '📱', '☕', '🍕', '⛽', '💊',
  '👕', '📺', '🎮', '💸', '🎁', '🐕', '🌟', '📊', '🎯', '🔧'
];

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowAddModal(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">Categories</h1>
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowAddModal(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>
        <p className="page-subtitle">Organize your transactions</p>
      </div>

      <div className="page-content space-y-6">
        {/* Income Categories */}
        <div className="card">
          <h2 className="font-semibold mb-4 text-green-600">Income Categories ({incomeCategories.length})</h2>
          <div className="grid grid-cols-1 gap-3">
            {incomeCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{category.color}</span>
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button
                    onClick={() => handleEdit(category)}
                    className="btn btn-sm btn-secondary"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="btn btn-sm btn-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="card">
          <h2 className="font-semibold mb-4 text-red-600">Expense Categories ({expenseCategories.length})</h2>
          <div className="grid grid-cols-1 gap-3">
            {expenseCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{category.color}</span>
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button
                    onClick={() => handleEdit(category)}
                    className="btn btn-sm btn-secondary"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="btn btn-sm btn-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowAddModal(false);
            setEditingCategory(null);
          }}
          onSave={(data) => {
            if (editingCategory) {
              updateCategory(editingCategory.id, data);
            } else {
              addCategory(data);
            }
            setShowAddModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

const CategoryModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    type: category?.type || 'expense',
    color: category?.color || '#3b82f6',
    icon: category?.icon || '💰'
  });
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {category ? 'Edit Category' : 'Add Category'}
          </h2>
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
                className={`btn ${formData.type === 'income' ? 'btn-success' : 'btn-secondary'}`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`btn ${formData.type === 'expense' ? 'btn-danger' : 'btn-secondary'}`}
              >
                Expense
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Icon</label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <span className="text-2xl">{formData.icon}</span>
                <span>Choose Icon</span>
              </button>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="form-input flex-1"
                placeholder="Or type custom emoji"
              />
            </div>
            
            {showIconPicker && (
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, icon });
                        setShowIconPicker(false);
                      }}
                      className="p-2 text-2xl hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-12 rounded-lg border-2 border-gray-300"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="form-input flex-1"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {category ? 'Update Category' : 'Add Category'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Categories;
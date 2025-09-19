import React, { useState } from 'react';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { categoriesAPI } from '../services/api';
import { useApi, useApiMutation } from '../hooks/useApi';
import { useToast } from '../hooks/use-toast';

const Categories = () => {
  const { toast } = useToast();
  const { data: categories, loading, error, refetch } = useApi(() => categoriesAPI.getAll());
  const { mutate, loading: mutationLoading } = useApiMutation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = async (categoryData) => {
    const result = await mutate(categoriesAPI.create, categoryData);
    if (result.success) {
      toast({ title: "Success", description: "Category created successfully" });
      refetch();
      setIsAddModalOpen(false);
    } else {
      toast({ title: "Error", description: result.error.message, variant: "destructive" });
    }
  };

  const handleEditCategory = async (categoryData) => {
    const result = await mutate(categoriesAPI.update, editingCategory.id, categoryData);
    if (result.success) {
      toast({ title: "Success", description: "Category updated successfully" });
      refetch();
      setEditingCategory(null);
    } else {
      toast({ title: "Error", description: result.error.message, variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const result = await mutate(categoriesAPI.delete, id);
      if (result.success) {
        toast({ title: "Success", description: "Category deleted successfully" });
        refetch();
      } else {
        toast({ title: "Error", description: result.error.message, variant: "destructive" });
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
        <span className="ml-2 text-[var(--text-secondary)]">Loading categories...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading categories: {error.message}</p>
        <button
          onClick={refetch}
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  const incomeCategories = categories?.filter(c => c.type === 'income') || [];
  const expenseCategories = categories?.filter(c => c.type === 'expense') || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Categories</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={mutationLoading}
          className="flex items-center space-x-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity mt-4 sm:mt-0 disabled:opacity-50"
        >
          {mutationLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="text-[var(--color-success)]" size={24} />
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Income Categories</h2>
            <span className="bg-[var(--color-success)] text-white px-2 py-1 rounded-full text-sm">
              {incomeCategories.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {incomeCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-[var(--text-primary)]">{category.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {incomeCategories.length === 0 && (
              <p className="text-[var(--text-secondary)] text-center py-4">No income categories yet</p>
            )}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingDown className="text-red-500" size={24} />
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Expense Categories</h2>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              {expenseCategories.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {expenseCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-[var(--text-primary)]">{category.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {expenseCategories.length === 0 && (
              <p className="text-[var(--text-secondary)] text-center py-4">No expense categories yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingCategory) && (
        <CategoryModal
          category={editingCategory}
          isOpen={isAddModalOpen || !!editingCategory}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={editingCategory ? handleEditCategory : handleAddCategory}
        />
      )}
    </div>
  );
};

// Category Modal Component
const CategoryModal = ({ category, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    type: category?.type || 'expense',
    color: category?.color || '#ef4444'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const colorOptions = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {category ? 'Edit Category' : 'Add Category'}
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
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
              placeholder="Category name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Color</label>
            <div className="grid grid-cols-8 gap-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-[var(--text-primary)]' : 'border-[var(--border-color)]'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
              className="w-full mt-2 h-10 border border-[var(--border-color)] rounded cursor-pointer"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              {category ? 'Update Category' : 'Add Category'}
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

export default Categories;
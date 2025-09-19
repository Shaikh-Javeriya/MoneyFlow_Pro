import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const QuickEntry = ({ onClose }) => {
  const { categories, addTransaction } = useData();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const availableCategories = categories.filter(c => c.type === formData.type);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    const transaction = {
      description: formData.description || 'Transaction',
      amount: parseFloat(formData.amount),
      type: formData.type,
      categoryId: parseInt(formData.categoryId),
      date: formData.date,
      notes: formData.notes
    };

    addTransaction(transaction);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Transaction</h2>
          <button onClick={onClose} className="modal-close">
            <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              placeholder="What was this for?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount *</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="form-input"
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', categoryId: '' })}
                className={`btn ${
                  formData.type === 'income' ? 'btn-success' : 'btn-secondary'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', categoryId: '' })}
                className={`btn ${
                  formData.type === 'expense' ? 'btn-danger' : 'btn-secondary'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="form-input"
              required
            >
              <option value="">Select category</option>
              {availableCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="form-input"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuickEntry;
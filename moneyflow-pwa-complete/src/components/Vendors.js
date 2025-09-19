import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin, Building } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const Vendors = () => {
  const { vendors, addVendor, updateVendor, deleteVendor } = useData();
  const { formatCurrency } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const totalSpent = vendors.reduce((sum, vendor) => sum + vendor.totalSpent, 0);
  const activeVendors = vendors.filter(v => v.status === 'active');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      deleteVendor(id);
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setShowAddModal(true);
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'technology': return '💻';
      case 'office supplies': return '📋';
      case 'marketing': return '📢';
      case 'services': return '🔧';
      case 'legal': return '⚖️';
      case 'utilities': return '💡';
      case 'insurance': return '🛡️';
      case 'transportation': return '🚗';
      default: return '🏢';
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">Vendors</h1>
          <button
            onClick={() => {
              setEditingVendor(null);
              setShowAddModal(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Vendor
          </button>
        </div>
        <p className="page-subtitle">Track your business expenses</p>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-orange-600">{vendors.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Vendors</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{activeVendors.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </div>
          <div className="card text-center">
            <div className="text-lg font-bold text-red-600">{formatCurrency(totalSpent)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
          </div>
        </div>

        {vendors.length === 0 ? (
          <div className="card text-center py-8">
            <Building size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No vendors yet</p>
            <p className="text-sm text-gray-400">Add vendors to track your business expenses</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                      vendor.status === 'active' 
                        ? 'bg-orange-100 dark:bg-orange-900/20' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {getCategoryIcon(vendor.category)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{vendor.name}</h3>
                        <span className={`status-badge ${
                          vendor.status === 'active' ? 'status-active' : 'status-inactive'
                        }`}>
                          {vendor.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">
                        {vendor.category}
                      </p>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{vendor.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{vendor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{vendor.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(vendor)}
                      className="btn btn-sm btn-secondary"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="btn btn-sm btn-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(vendor.totalSpent)}
                    </p>
                  </div>
                  <div className="w-24">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${Math.min((vendor.totalSpent / Math.max(...vendors.map(v => v.totalSpent))) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <VendorModal
          vendor={editingVendor}
          onClose={() => {
            setShowAddModal(false);
            setEditingVendor(null);
          }}
          onSave={(data) => {
            if (editingVendor) {
              updateVendor(editingVendor.id, data);
            } else {
              addVendor(data);
            }
            setShowAddModal(false);
            setEditingVendor(null);
          }}
        />
      )}
    </div>
  );
};

const VendorModal = ({ vendor, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    address: vendor?.address || '',
    category: vendor?.category || 'Services',
    status: vendor?.status || 'active',
    totalSpent: vendor?.totalSpent || '',
  });

  const categories = [
    'Office Supplies',
    'Technology',
    'Marketing',
    'Services',
    'Legal',
    'Utilities',
    'Insurance',
    'Transportation',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    onSave({
      ...formData,
      totalSpent: parseFloat(formData.totalSpent) || 0,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {vendor ? 'Edit Vendor' : 'Add Vendor'}
          </h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Vendor Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g., Office Supply Co"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="contact@vendor.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-input"
              placeholder="+1-555-0123"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
              rows="2"
              placeholder="Business address..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="form-input"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Total Spent</label>
            <input
              type="number"
              step="0.01"
              value={formData.totalSpent}
              onChange={(e) => setFormData({ ...formData, totalSpent: e.target.value })}
              className="form-input"
              placeholder="0.00"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {vendor ? 'Update Vendor' : 'Add Vendor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Vendors;
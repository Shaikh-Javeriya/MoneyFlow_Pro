import React, { useState } from 'react';
import { Plus, Edit, Trash2, Truck, Mail, Tag } from 'lucide-react';
import { vendors as mockVendors } from '../data/mockData';

const Vendors = () => {
  const [vendors, setVendors] = useState(mockVendors);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const handleAddVendor = (vendorData) => {
    const newVendor = {
      id: Math.max(...vendors.map(v => v.id)) + 1,
      ...vendorData
    };
    setVendors([...vendors, newVendor]);
    setIsAddModalOpen(false);
  };

  const handleEditVendor = (vendorData) => {
    setVendors(vendors.map(v => 
      v.id === editingVendor.id ? { ...v, ...vendorData } : v
    ));
    setEditingVendor(null);
  };

  const handleDeleteVendor = (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Vendors</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity mt-4 sm:mt-0"
        >
          <Plus size={20} />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total Vendors</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">{vendors.length}</p>
          </div>
          <Truck className="text-[var(--color-primary)]" size={24} />
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--color-accent)] rounded-full flex items-center justify-center">
                  <Truck className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{vendor.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-[var(--text-secondary)]">
                    <Tag size={14} />
                    <span>{vendor.defaultCategory}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingVendor(vendor)}
                  className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="text-[var(--text-secondary)]" size={16} />
                <p className="text-sm text-[var(--text-primary)]">{vendor.email}</p>
              </div>
              
              <div className="pt-2 border-t border-[var(--border-color)]">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)] bg-opacity-20 text-[var(--color-accent)]">
                  {vendor.defaultCategory}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vendors.length === 0 && (
        <div className="text-center py-12">
          <Truck className="mx-auto text-[var(--text-secondary)] mb-4" size={48} />
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No vendors yet</h3>
          <p className="text-[var(--text-secondary)] mb-4">Add your first vendor to get started</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Add Vendor
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingVendor) && (
        <VendorModal
          vendor={editingVendor}
          isOpen={isAddModalOpen || !!editingVendor}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingVendor(null);
          }}
          onSave={editingVendor ? handleEditVendor : handleAddVendor}
        />
      )}
    </div>
  );
};

// Vendor Modal Component
const VendorModal = ({ vendor, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    email: vendor?.email || '',
    defaultCategory: vendor?.defaultCategory || 'Business Expenses'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const categoryOptions = [
    'Business Expenses',
    'Utilities',
    'Subscriptions',
    'Food',
    'Travel',
    'Office Supplies',
    'Professional Services',
    'Marketing',
    'Equipment',
    'Maintenance'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {vendor ? 'Edit Vendor' : 'Add Vendor'}
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
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Vendor Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
              placeholder="Vendor name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
              placeholder="vendor@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Default Category</label>
            <select
              value={formData.defaultCategory}
              onChange={(e) => setFormData({...formData, defaultCategory: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
            >
              {categoryOptions.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              This category will be auto-selected when creating transactions for this vendor
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              {vendor ? 'Update Vendor' : 'Add Vendor'}
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

export default Vendors;
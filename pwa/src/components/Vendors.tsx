import React from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const Vendors: React.FC = () => {
  const { vendors } = useData();
  const { formatCurrency } = useTheme();

  const totalSpent = vendors.reduce((sum, vendor) => sum + vendor.totalSpent, 0);
  const activeVendors = vendors.filter(v => v.status === 'active');

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'technology': return '💻';
      case 'office supplies': return '📋';
      case 'marketing': return '📢';
      case 'services': return '🔧';
      case 'legal': return '⚖️';
      default: return '🏢';
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Vendors</h1>
        <p className="page-subtitle">Track your business expenses</p>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-orange-600">{vendors.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
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
            <p className="text-gray-500">No vendors yet</p>
            <p className="text-sm text-gray-400 mt-2">Add vendors to track your business expenses</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-2xl">
                      {getCategoryIcon(vendor.category)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{vendor.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vendor.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {vendor.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-orange-600 mb-2">{vendor.category}</p>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>📧 {vendor.email}</p>
                        <p>📞 {vendor.phone}</p>
                        <p>📍 {vendor.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="text-xl font-bold text-red-600">{formatCurrency(vendor.totalSpent)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
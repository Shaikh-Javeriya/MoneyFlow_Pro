import React, { useState } from 'react';
import { Moon, Sun, Download, Upload, Trash2, Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Settings: React.FC = () => {
  const { isDark, toggleDarkMode, theme, changeTheme, currency, changeCurrency, formatCurrency } = useTheme();
  const { exportData, importData, clearAllData, getStats } = useData();
  const [showImportModal, setShowImportModal] = useState(false);
  
  const stats = getStats();

  const themes = {
    blue: 'Ocean Blue',
    purple: 'Purple Dream',
    green: 'Nature Green'
  };

  const currencies = {
    USD: 'US Dollar ($)',
    EUR: 'Euro (€)',
    GBP: 'British Pound (£)',
    JPY: 'Japanese Yen (¥)',
    INR: 'Indian Rupee (₹)'
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moneyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = importData(e.target?.result as string);
        if (result.success) {
          alert('Data imported successfully!');
        } else {
          alert('Error importing data: ' + result.message);
        }
        setShowImportModal(false);
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllData();
      alert('All data has been cleared.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Customize your experience</p>
      </div>

      <div className="page-content space-y-6">
        {/* Appearance */}
        <div className="card">
          <h2 className="font-semibold mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
                <span>Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`btn ${isDark ? 'btn-primary' : 'btn-secondary'}`}
              >
                {isDark ? 'On' : 'Off'}
              </button>
            </div>

            <div>
              <label className="form-label mb-2">Color Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(themes).map(([key, name]) => (
                  <button
                    key={key}
                    onClick={() => changeTheme(key)}
                    className={`btn ${theme === key ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    <Palette size={16} />
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Currency</label>
              <select
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
                className="form-input"
              >
                {Object.entries(currencies).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <h2 className="font-semibold mb-4">Data Management</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleExport}
              className="btn btn-primary w-full"
            >
              <Download size={20} />
              Export Data (JSON)
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="btn btn-secondary w-full"
            >
              <Upload size={20} />
              Import Data
            </button>

            <button
              onClick={handleClearData}
              className="btn w-full"
              style={{ background: '#ef4444', color: 'white' }}
            >
              <Trash2 size={20} />
              Clear All Data
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="font-medium mb-2">Data Summary</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Balance</p>
                <p className="font-semibold">{formatCurrency(stats.balance)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Transactions</p>
                <p className="font-semibold">{stats.transactionCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card">
          <h2 className="font-semibold mb-4">About</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
              <span>September 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Platform</span>
              <span>Progressive Web App</span>
            </div>
          </div>
        </div>
      </div>

      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Import Data</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select a JSON backup file to import your data.
            </p>
            
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="form-input"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
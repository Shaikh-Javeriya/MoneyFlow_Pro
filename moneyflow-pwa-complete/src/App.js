import React, { useState } from 'react';
import { Home, List, PieChart, Users, Building, FileText, Settings, DollarSign, TrendingUp, Plus } from 'lucide-react';
import './App.css';

// Import components
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Categories from './components/Categories';
import Accounts from './components/Accounts';
import Clients from './components/Clients';
import Vendors from './components/Vendors';
import Budget from './components/Budget';
import Docs from './components/Docs';
import SettingsPage from './components/Settings';
import QuickEntry from './components/QuickEntry';

// Context providers
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickEntry, setShowQuickEntry] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'transactions', name: 'Transactions', icon: List },
    { id: 'categories', name: 'Categories', icon: PieChart },
    { id: 'accounts', name: 'Accounts', icon: DollarSign },
    { id: 'budget', name: 'Budget', icon: TrendingUp },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'vendors', name: 'Vendors', icon: Building },
    { id: 'docs', name: 'Docs', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'categories': return <Categories />;
      case 'accounts': return <Accounts />;
      case 'budget': return <Budget />;
      case 'clients': return <Clients />;
      case 'vendors': return <Vendors />;
      case 'docs': return <Docs />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <div className="app">
          <main className="main-content">
            {renderContent()}
          </main>

          {/* FAB Button */}
          <button
            className="fab"
            onClick={() => setShowQuickEntry(true)}
            aria-label="Add new transaction"
          >
            <Plus size={24} />
          </button>

          {/* Bottom Navigation */}
          <nav className="bottom-nav">
            <div className="nav-container">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Quick Entry Modal */}
          {showQuickEntry && (
            <QuickEntry onClose={() => setShowQuickEntry(false)} />
          )}
        </div>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;
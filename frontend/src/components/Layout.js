import React, { useState } from 'react';
import { 
  Home, 
  CreditCard, 
  Tag, 
  Wallet, 
  Users, 
  Truck, 
  PieChart, 
  Palette, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'transactions', name: 'Transactions', icon: CreditCard },
    { id: 'categories', name: 'Categories', icon: Tag },
    { id: 'accounts', name: 'Accounts', icon: Wallet },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'vendors', name: 'Vendors', icon: Truck },
    { id: 'budget', name: 'Budget', icon: PieChart },
    { id: 'theme', name: 'Theme', icon: Palette },
    { id: 'docs', name: 'Docs', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[var(--bg-secondary)] border-b border-[var(--border-color)] p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--color-primary)]">Income & Expense Tracker</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}>
          <div className="p-6">
            <h1 className="text-xl font-bold text-[var(--color-primary)] hidden lg:block">
              Income & Expense Tracker
            </h1>
          </div>
          
          <nav className="px-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-[var(--color-primary)] text-white shadow-lg'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
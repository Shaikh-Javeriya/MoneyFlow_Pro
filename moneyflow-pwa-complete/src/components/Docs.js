import React from 'react';
import { Mail, MessageCircle, Book, HelpCircle, Download, ExternalLink } from 'lucide-react';

const Docs = () => {
  const features = [
    { title: 'Dashboard Overview', description: 'View your financial summary with income, expenses, balance, and multiple charts.', icon: '📊' },
    { title: 'Transaction Management', description: 'Add, edit, delete, and categorize your income and expenses with search and filtering.', icon: '💰' },
    { title: 'Categories & Budgets', description: 'Organize transactions into custom categories and set monthly budget limits.', icon: '🏷️' },
    { title: 'Accounts Tracking', description: 'Monitor multiple bank accounts, credit cards, and investment accounts.', icon: '🏦' },
    { title: 'Client & Vendor Management', description: 'Keep track of business relationships and payment history with full CRUD operations.', icon: '👥' },
    { title: 'Data Export & Import', description: 'Backup your data with JSON export and import. Export individual data as CSV.', icon: '📤' },
    { title: 'Theme Customization', description: 'Personalize with 3 color themes (Blue, Purple, Green), dark mode, and 10 currencies.', icon: '🎨' },
    { title: 'Privacy First', description: 'All data stored locally. No servers, no tracking, complete data control.', icon: '🔒' },
  ];

  const quickStart = [
    'Start by adding your first transaction using the + FAB button',
    'Set up your budget limits in the Budget tab with add/edit/delete functionality',
    'Customize categories with icons and colors using the category management',
    'Add your bank accounts for complete financial tracking',
    'Manage clients and vendors for business expense tracking',
    'Export your data regularly for backup purposes (JSON/CSV)',
    'Customize your theme and currency in Settings'
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📚 Documentation</h1>
        <p className="page-subtitle">Everything you need to know about MoneyFlow Pro</p>
      </div>

      <div className="page-content space-y-6">
        {/* Quick Start Guide */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Book className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold">Quick Start Guide</h2>
          </div>
          <ol className="space-y-2 text-sm">
            {quickStart.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Features */}
        <div className="card">
          <h2 className="font-semibold mb-4">Key Features</h2>
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRUD Operations Guide */}
        <div className="card">
          <h2 className="font-semibold mb-4">📝 Managing Your Data</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Add, Edit & Delete</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Every section (Transactions, Categories, Accounts, Clients, Vendors, Budgets) has full CRUD functionality:
              </p>
              <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• <strong>Add:</strong> Use the + button in each section</li>
                <li>• <strong>Edit:</strong> Click the edit icon (pencil) next to any item</li>
                <li>• <strong>Delete:</strong> Click the delete icon (trash) with confirmation</li>
                <li>• <strong>Search:</strong> Use search and filter options where available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Charts & Analytics */}
        <div className="card">
          <h2 className="font-semibold mb-4">📊 Charts & Analytics</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold mb-1">Dashboard Charts:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <strong>Spending by Category:</strong> Doughnut chart showing expense breakdown</li>
                <li>• <strong>Income vs Expenses:</strong> Bar chart comparing monthly income and expenses</li>
                <li>• <strong>Monthly Trend:</strong> Line chart showing 6-month financial trend</li>
                <li>• <strong>Account Balances:</strong> Visual representation of all account balances</li>
                <li>• <strong>Top Clients:</strong> List of highest-paying clients</li>
                <li>• <strong>Recent Transactions:</strong> Table format with full transaction details</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Themes & Customization */}
        <div className="card">
          <h2 className="font-semibold mb-4">🎨 Themes & Customization</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold mb-2">Available Themes:</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-xs">Ocean Blue</span>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-xs">Purple Dream</span>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-xs">Nature Green</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Supported Currencies (10):</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                USD ($), EUR (€), GBP (£), JPY (¥), INR (₹), CAD (C$), AUD (A$), CHF (Fr), CNY (¥), SEK (kr)
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold">Need Help?</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Contact Support</h3>
                  <p className="text-primary-100 text-sm mb-2">
                    Get help from our development team
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>contact@codeorbit.co.in</span>
                  </div>
                </div>
                <MessageCircle className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="card">
          <h2 className="font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How do I install the app on my phone?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                On mobile browsers, tap "Add to Home Screen" in your browser menu. On desktop, look for the install icon in your address bar.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I sync data between devices?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Use the export/import feature in Settings to transfer your data between devices. Export on one device and import on another.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is my financial data secure?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes! All data is stored locally on your device. We don't have access to your information and it never leaves your device unless you export it.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I backup my data?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Go to Settings → Data Management → Export Data. This creates a JSON file with all your data that you can save and import later.
              </p>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="card">
          <h2 className="font-semibold mb-4">App Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Version</p>
              <p className="font-semibold">1.0.0</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
              <p className="font-semibold">September 2025</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Platform</p>
              <p className="font-semibold">Progressive Web App</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Compatibility</p>
              <p className="font-semibold">All Modern Browsers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;

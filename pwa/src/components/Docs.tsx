import React from 'react';
import { Mail, MessageCircle, Book, HelpCircle } from 'lucide-react';

const Docs: React.FC = () => {
  const features = [
    { title: 'Dashboard Overview', description: 'View your financial summary with income, expenses, and balance.', icon: '📊' },
    { title: 'Transaction Management', description: 'Add, edit, and categorize your income and expenses.', icon: '💰' },
    { title: 'Categories & Budgets', description: 'Organize transactions and set monthly budget limits.', icon: '🏷️' },
    { title: 'Accounts Tracking', description: 'Monitor multiple bank accounts and credit cards.', icon: '🏦' },
    { title: 'Data Export & Import', description: 'Backup your data with JSON export and import.', icon: '📤' },
    { title: 'Theme Customization', description: 'Personalize with multiple color themes and dark mode.', icon: '🎨' },
    { title: 'Privacy First', description: 'All data stored locally. No servers, no tracking.', icon: '🔒' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📚 Documentation</h1>
        <p className="page-subtitle">Everything you need to know about MoneyFlow Pro</p>
      </div>

      <div className="page-content space-y-6">
        {/* Quick Start */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Book size={20} className="text-blue-500" />
            <h2 className="font-semibold">Quick Start Guide</h2>
          </div>
          <ol className="space-y-2 text-sm">
            <li>1. Start by adding your first transaction using the + button</li>
            <li>2. Set up your budget limits in the Budget tab</li>
            <li>3. Customize categories to match your spending habits</li>
            <li>4. Add your bank accounts for complete financial tracking</li>
            <li>5. Export your data regularly for backup purposes</li>
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

        {/* Support */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <HelpCircle size={20} className="text-blue-500" />
            <h2 className="font-semibold">Need Help?</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Contact Support</h3>
                  <p className="text-blue-100 text-sm mb-2">Get help from our team</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail size={16} />
                    <span>skjaveriya.11@gmail.com</span>
                  </div>
                </div>
                <MessageCircle size={32} className="opacity-80" />
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
                On mobile browsers, tap "Add to Home Screen" in your browser menu.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I sync data between devices?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Use the export/import feature to transfer data between devices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is my financial data secure?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes! All data is stored locally on your device. We don't have access to your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
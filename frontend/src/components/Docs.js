import React, { useState } from 'react';
import { HelpCircle, Book, FileText, Video, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedSections, setExpandedSections] = useState(['getting-started']);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const documentation = {
    'getting-started': {
      title: 'Getting Started',
      icon: Book,
      content: {
        overview: `Welcome to the Income & Expense Tracker! This comprehensive financial management tool helps you track your income, expenses, budgets, and financial goals all in one place.`,
        keyFeatures: [
          'Dashboard with real-time financial insights',
          'Transaction management with categories',
          'Budget tracking and alerts',
          'Client and vendor management',
          'Account balance monitoring',
          'Customizable themes and appearance'
        ],
        quickStart: [
          'Start by adding your accounts in the Accounts tab',
          'Create income and expense categories',
          'Add your first transaction',
          'Set up budgets for expense categories',
          'Explore the dashboard for insights'
        ]
      }
    },
    'dashboard': {
      title: 'Dashboard',
      icon: FileText,
      content: {
        overview: `The Dashboard provides a comprehensive overview of your financial status with key performance indicators, charts, and recent transactions.`,
        features: [
          'KPI cards showing balance, income, expenses, and alerts',
          'Income vs Expenses trend chart (30-day view)',
          'Expense breakdown by category (doughnut chart)',
          'Account balances visualization',
          'Recent transactions list',
          'Low balance and overdue alerts'
        ],
        tips: [
          'Check the dashboard daily for financial insights',
          'Monitor the income vs expenses trend',
          'Pay attention to budget alerts',
          'Review recent transactions for accuracy'
        ]
      }
    },
    'transactions': {
      title: 'Transactions',
      icon: FileText,
      content: {
        overview: `Manage all your financial transactions in one place with powerful filtering, search, and export capabilities.`,
        features: [
          'Add, edit, and delete transactions',
          'Filter by type (income/expense) and status',
          'Search transactions by category, notes, or client/vendor',
          'Export transactions to CSV',
          'Import transactions from CSV files',
          'Responsive design (table on desktop, cards on mobile)'
        ],
        fields: [
          'Date: When the transaction occurred',
          'Type: Income or Expense',
          'Amount: Transaction value',
          'Category: Income or expense category',
          'Account: Which account the transaction affects',
          'Client/Vendor: Optional associated party',
          'Status: Completed, Pending, or Overdue',
          'Notes: Additional details',
          'Recurring: Mark if this is a recurring transaction'
        ]
      }
    },
    'categories': {
      title: 'Categories',
      icon: FileText,
      content: {
        overview: `Organize your transactions with custom income and expense categories for better financial tracking.`,
        features: [
          'Separate income and expense categories',
          'Custom color coding for visual identification',
          'Add, edit, and delete categories',
          'Color picker with preset options'
        ],
        defaultCategories: {
          income: ['Salary', 'Freelance', 'Investments', 'Business', 'Other Income'],
          expense: ['Rent', 'Food', 'Utilities', 'Travel', 'Subscriptions', 'Healthcare', 'Entertainment', 'Shopping']
        },
        tips: [
          'Use specific categories for better insights',
          'Assign unique colors for easy identification',
          'Review and organize categories regularly'
        ]
      }
    },
    'accounts': {
      title: 'Accounts',
      icon: FileText,
      content: {
        overview: `Manage your financial accounts including checking, savings, and credit cards with balance monitoring.`,
        features: [
          'Multiple account types (Checking, Savings, Credit Card)',
          'Current balance tracking',
          'Low balance threshold alerts',
          'Account summary with total balance',
          'Visual indicators for account health'
        ],
        accountTypes: [
          'Checking: For daily transactions and expenses',
          'Savings: For long-term savings and goals',
          'Credit Card: Track credit card balances and payments'
        ],
        tips: [
          'Set appropriate low balance thresholds',
          'Regularly update account balances',
          'Monitor credit card balances closely'
        ]
      }
    },
    'budget': {
      title: 'Budget Management',
      icon: FileText,
      content: {
        overview: `Set monthly budgets for expense categories and track your spending against your goals.`,
        features: [
          'Set monthly budgets per expense category',
          'Visual progress tracking with charts',
          'Budget vs actual spending comparison',
          'Over-budget alerts and notifications',
          'Budget performance insights'
        ],
        bestPractices: [
          'Start with realistic budget amounts',
          'Review and adjust budgets monthly',
          'Pay attention to over-budget alerts',
          'Use historical spending data as a guide'
        ],
        tips: [
          'Set budgets for all major expense categories',
          'Leave some buffer for unexpected expenses',
          'Track daily to stay within budget'
        ]
      }
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      icon: HelpCircle,
      content: {
        overview: `Common issues and solutions to help you get the most out of your expense tracker.`,
        commonIssues: [
          {
            issue: 'Transactions not showing in dashboard',
            solution: 'Ensure transactions have "Completed" status and correct dates'
          },
          {
            issue: 'Budget alerts not appearing',
            solution: 'Check that budgets are set for expense categories and amounts are correct'
          },
          {
            issue: 'Charts not displaying data',
            solution: 'Add transactions with recent dates and ensure categories are properly assigned'
          },
          {
            issue: 'Export/Import not working',
            solution: 'Ensure CSV files follow the correct format with all required columns'
          }
        ],
        tips: [
          'Regularly backup your data',
          'Use consistent naming for categories',
          'Keep transaction notes descriptive',
          'Review data accuracy periodically'
        ]
      }
    }
  };

  const renderContent = (content) => {
    return (
      <div className="space-y-6">
        <p className="text-[var(--text-primary)] leading-relaxed">{content.overview}</p>
        
        {content.keyFeatures && (
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">Key Features</h4>
            <ul className="space-y-2">
              {content.keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-[var(--color-success)] mt-1">•</span>
                  <span className="text-[var(--text-secondary)]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.features && (
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">Features</h4>
            <ul className="space-y-2">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-[var(--color-primary)] mt-1">•</span>
                  <span className="text-[var(--text-secondary)]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.quickStart && (
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">Quick Start Guide</h4>
            <ol className="space-y-2">
              {content.quickStart.map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="bg-[var(--color-primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-[var(--text-secondary)]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {content.fields && (
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">Transaction Fields</h4>
            <div className="space-y-3">
              {content.fields.map((field, index) => {
                const [name, description] = field.split(': ');
                return (
                  <div key={index} className="flex">
                    <span className="font-medium text-[var(--text-primary)] w-24">{name}:</span>
                    <span className="text-[var(--text-secondary)]">{description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {content.commonIssues && (
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">Common Issues</h4>
            <div className="space-y-4">
              {content.commonIssues.map((item, index) => (
                <div key={index} className="p-4 bg-[var(--bg-tertiary)] rounded-lg">
                  <h5 className="font-medium text-[var(--text-primary)] mb-2">{item.issue}</h5>
                  <p className="text-[var(--text-secondary)] text-sm">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.tips && (
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">Tips</h4>
            <ul className="space-y-2">
              {content.tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-[var(--color-accent)] mt-1">💡</span>
                  <span className="text-[var(--text-secondary)]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Documentation & Help</h1>
        <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)] mt-2 sm:mt-0">
          <HelpCircle size={16} />
          <span>Need help? Find answers here</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">Topics</h2>
            <nav className="space-y-1">
              {Object.entries(documentation).map(([key, section]) => {
                const Icon = section.icon;
                const isExpanded = expandedSections.includes(key);
                
                return (
                  <div key={key}>
                    <button
                      onClick={() => {
                        setActiveSection(key);
                        toggleSection(key);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                        activeSection === key
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon size={16} />
                        <span className="text-sm font-medium">{section.title}</span>
                      </div>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              {React.createElement(documentation[activeSection].icon, {
                className: "text-[var(--color-primary)]",
                size: 24
              })}
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {documentation[activeSection].title}
              </h2>
            </div>
            
            <div className="prose prose-sm max-w-none">
              {renderContent(documentation[activeSection].content)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <Video className="text-[var(--color-primary)]" size={20} />
            <h3 className="font-semibold text-[var(--text-primary)]">Video Tutorials</h3>
          </div>
          <p className="text-[var(--text-secondary)] text-sm mb-3">
            Watch step-by-step tutorials on how to use all features.
          </p>
          <button className="flex items-center space-x-2 text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
            <ExternalLink size={16} />
            <span className="text-sm">Coming Soon</span>
          </button>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <Book className="text-[var(--color-success)]" size={20} />
            <h3 className="font-semibold text-[var(--text-primary)]">Best Practices</h3>
          </div>
          <p className="text-[var(--text-secondary)] text-sm mb-3">
            Learn financial management best practices and tips.
          </p>
          <button 
            onClick={() => setActiveSection('budget')}
            className="flex items-center space-x-2 text-[var(--color-success)] hover:text-[var(--color-primary)] transition-colors"
          >
            <span className="text-sm">View Guide</span>
          </button>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <HelpCircle className="text-[var(--color-accent)]" size={20} />
            <h3 className="font-semibold text-[var(--text-primary)]">Support</h3>
          </div>
          <p className="text-[var(--text-secondary)] text-sm mb-3">
            Get help with technical issues and troubleshooting.
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveSection('troubleshooting')}
              className="flex items-center space-x-2 text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors"
            >
              <span className="text-sm">View Troubleshooting</span>
            </button>
            <div className="pt-2 border-t border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Need direct support?</p>
              <a 
                href="mailto:skjaveriya.11@gmail.com"
                className="text-sm text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors"
              >
                skjaveriya.11@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
import React, { useState } from "react";
import "./App.css";
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Categories from './components/Categories';
import Accounts from './components/Accounts';
import Clients from './components/Clients';
import Vendors from './components/Vendors';
import Budget from './components/Budget';
import Theme from './components/Theme';
import Docs from './components/Docs';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'categories':
        return <Categories />;
      case 'accounts':
        return <Accounts />;
      case 'clients':
        return <Clients />;
      case 'vendors':
        return <Vendors />;
      case 'budget':
        return <Budget />;
      case 'theme':
        return <Theme />;
      case 'docs':
        return <Docs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderActiveTab()}
        </Layout>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;

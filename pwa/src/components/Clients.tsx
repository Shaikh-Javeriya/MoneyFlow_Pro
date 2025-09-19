import React from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const Clients: React.FC = () => {
  const { clients } = useData();
  const { formatCurrency } = useTheme();

  const totalRevenue = clients.reduce((sum, client) => sum + client.totalPaid, 0);
  const activeClients = clients.filter(c => c.status === 'active');

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <p className="page-subtitle">Manage your business relationships</p>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{activeClients.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </div>
          <div className="card text-center">
            <div className="text-lg font-bold text-purple-600">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No clients yet</p>
            <p className="text-sm text-gray-400 mt-2">Add clients to track your business relationships</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {client.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>📧 {client.email}</p>
                      <p>📞 {client.phone}</p>
                      <p>📍 {client.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Paid</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(client.totalPaid)}</p>
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

export default Clients;
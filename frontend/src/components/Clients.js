import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Mail, Clock } from 'lucide-react';
import { clients as mockClients } from '../data/mockData';

const Clients = () => {
  const [clients, setClients] = useState(mockClients);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const handleAddClient = (clientData) => {
    const newClient = {
      id: Math.max(...clients.map(c => c.id)) + 1,
      ...clientData
    };
    setClients([...clients, newClient]);
    setIsAddModalOpen(false);
  };

  const handleEditClient = (clientData) => {
    setClients(clients.map(c => 
      c.id === editingClient.id ? { ...c, ...clientData } : c
    ));
    setEditingClient(null);
  };

  const handleDeleteClient = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Clients</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity mt-4 sm:mt-0"
        >
          <Plus size={20} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total Clients</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">{clients.length}</p>
          </div>
          <Users className="text-[var(--color-primary)]" size={24} />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{client.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-[var(--text-secondary)]">
                    <Clock size={14} />
                    <span>{client.paymentTerms}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingClient(client)}
                  className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="text-[var(--text-secondary)]" size={16} />
                <p className="text-sm text-[var(--text-primary)]">{client.email}</p>
              </div>
              
              <div className="pt-2 border-t border-[var(--border-color)]">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  client.paymentTerms === 'Immediate' ? 'bg-green-100 text-green-800' :
                  client.paymentTerms === 'NET 15' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {client.paymentTerms}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto text-[var(--text-secondary)] mb-4" size={48} />
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No clients yet</h3>
          <p className="text-[var(--text-secondary)] mb-4">Add your first client to get started</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Add Client
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingClient) && (
        <ClientModal
          client={editingClient}
          isOpen={isAddModalOpen || !!editingClient}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingClient(null);
          }}
          onSave={editingClient ? handleEditClient : handleAddClient}
        />
      )}
    </div>
  );
};

// Client Modal Component
const ClientModal = ({ client, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    paymentTerms: client?.paymentTerms || 'NET 30'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {client ? 'Edit Client' : 'Add Client'}
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
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Client Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
              placeholder="Client name"
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
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Payment Terms</label>
            <select
              value={formData.paymentTerms}
              onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
            >
              <option value="Immediate">Immediate</option>
              <option value="NET 15">NET 15</option>
              <option value="NET 30">NET 30</option>
              <option value="NET 45">NET 45</option>
              <option value="NET 60">NET 60</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              {client ? 'Update Client' : 'Add Client'}
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

export default Clients;
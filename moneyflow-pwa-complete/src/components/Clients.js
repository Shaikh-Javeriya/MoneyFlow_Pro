import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin, Building } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const Clients = () => {
  const { clients, addClient, updateClient, deleteClient } = useData();
  const { formatCurrency } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const totalRevenue = clients.reduce((sum, client) => sum + client.totalPaid, 0);
  const activeClients = clients.filter(c => c.status === 'active');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowAddModal(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">Clients</h1>
          <button
            onClick={() => {
              setEditingClient(null);
              setShowAddModal(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Client
          </button>
        </div>
        <p className="page-subtitle">Manage your business relationships</p>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Clients</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{activeClients.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </div>
          <div className="card text-center">
            <div className="text-lg font-bold text-purple-600">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="card text-center py-8">
            <Building size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No clients yet</p>
            <p className="text-sm text-gray-400">Add clients to track your business relationships</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      client.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <span className={`status-badge ${
                          client.status === 'active' ? 'status-active' : 'status-inactive'
                        }`}>
                          {client.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{client.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(client)}
                      className="btn btn-sm btn-secondary"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="btn btn-sm btn-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(client.totalPaid)}
                    </p>
                  </div>
                  <div className="w-24">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min((client.totalPaid / Math.max(...clients.map(c => c.totalPaid))) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <ClientModal
          client={editingClient}
          onClose={() => {
            setShowAddModal(false);
            setEditingClient(null);
          }}
          onSave={(data) => {
            if (editingClient) {
              updateClient(editingClient.id, data);
            } else {
              addClient(data);
            }
            setShowAddModal(false);
            setEditingClient(null);
          }}
        />
      )}
    </div>
  );
};

const ClientModal = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    status: client?.status || 'active',
    totalPaid: client?.totalPaid || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    onSave({
      ...formData,
      totalPaid: parseFloat(formData.totalPaid) || 0,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {client ? 'Edit Client' : 'Add Client'}
          </h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g., ABC Corporation"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="contact@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-input"
              placeholder="+1-555-0123"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
              rows="2"
              placeholder="Business address..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Total Revenue</label>
            <input
              type="number"
              step="0.01"
              value={formData.totalPaid}
              onChange={(e) => setFormData({ ...formData, totalPaid: e.target.value })}
              className="form-input"
              placeholder="0.00"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {client ? 'Update Client' : 'Add Client'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Clients;
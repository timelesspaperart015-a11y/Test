import React, { useState } from 'react';
import { Customer, CustomerFormData } from './types';
import { MOCK_CUSTOMERS } from './mocks/customers';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';

function App() {
  // State: List of customers (initialized with Mock Data)
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  // State: View Management ('list' or 'form')
  const [view, setView] = useState<'list' | 'form'>('list');

  // State: currently editing customer (null if creating new)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // --- Actions ---

  // Go to Create Mode
  const handleCreateClick = () => {
    setEditingCustomer(null);
    setView('form');
  };

  // Go to Edit Mode
  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setView('form');
  };

  // Handle Delete (with confirmation)
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Handle Form Submission (Create or Update)
  const handleFormSubmit = (formData: CustomerFormData) => {
    if (editingCustomer) {
      // Update logic
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, ...formData } // Merge existing ID/CreatedAt with new form data
            : c
        )
      );
    } else {
      // Create logic
      const newCustomer: Customer = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9), // Mock ID generation
        created_at: new Date().toISOString(),
      };
      // Prepend to list
      setCustomers((prev) => [newCustomer, ...prev]);
    }

    // Reset view
    setView('list');
    setEditingCustomer(null);
  };

  // Cancel form
  const handleCancel = () => {
    setView('list');
    setEditingCustomer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-500 mt-1">Prototype v1.0 (Mock Data Mode)</p>
        </header>

        {/* Content Area */}
        <main>
          {view === 'list' && (
            <CustomerList
              customers={customers}
              onCreate={handleCreateClick}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          )}

          {view === 'form' && (
            <CustomerForm
              initialData={editingCustomer}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}
        </main>

      </div>
    </div>
  );
}

export default App;

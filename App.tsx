import React, { useState, useEffect } from 'react';
import { Customer, CustomerFormData } from './types';
import { supabase } from './supabaseClient';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';

function App() {
  // State: List of customers
  const [customers, setCustomers] = useState<Customer[]>([]);

  // State: View Management ('list' or 'form')
  const [view, setView] = useState<'list' | 'form'>('list');

  // State: currently editing customer (null if creating new)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customer')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customer:', error);
    } else {
      setCustomers(data || []);
    }
  };

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
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      const { error } = await supabase
        .from('customer')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer.');
      } else {
        fetchCustomers();
      }
    }
  };

  // Handle Form Submission (Create or Update)
  const handleFormSubmit = async (formData: CustomerFormData) => {
    if (editingCustomer) {
      // Update logic
      const { error } = await supabase
        .from('customer')
        .update(formData)
        .eq('id', editingCustomer.id);

      if (error) {
        console.error('Error updating customer:', error);
        alert('Failed to update customer.');
        return;
      }
    } else {
      // Create logic
      const { error } = await supabase
        .from('customer')
        .insert([formData]);

      if (error) {
        console.error('Error creating customer:', error);
        alert('Failed to create customer.');
        return;
      }
    }

    // Refresh list and reset view
    await fetchCustomers();
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
          <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
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

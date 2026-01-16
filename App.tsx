import React, { useState, useEffect } from 'react';
import { Customer, CustomerFormData } from './types';
import { supabase } from './supabaseClient';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import AuthUI from './components/AuthUI';
import { Session } from '@supabase/supabase-js';

function App() {
  // State: Auth Session
  const [session, setSession] = useState<Session | null>(null);

  // State: List of customers
  const [customers, setCustomers] = useState<Customer[]>([]);

  // State: View Management ('list' or 'form')
  const [view, setView] = useState<'list' | 'form'>('list');

  // State: currently editing customer (null if creating new)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    // 獲取初始 Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 監聽 Auth 狀態變化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchCustomers();
    }
  }, [session]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
      // Create logic - Supabase RLS and default user_id will handle ownership
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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <AuthUI onSuccess={() => { }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:inline">
              {session.user.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              登出
            </button>
          </div>
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

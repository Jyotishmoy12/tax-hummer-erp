'use client';
import { useState, useEffect } from 'react';

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const res = await fetch('/api/suppliers');
        const data = await res.json();
        if (data.success) {
          setSuppliers(data.data);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSupplier ? `/api/suppliers/${editingSupplier._id}` : '/api/suppliers';
      const method = editingSupplier ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        if (editingSupplier) {
          setSuppliers(suppliers.map(s => (s._id === editingSupplier._id ? data.data : s)));
        } else {
          setSuppliers([data.data, ...suppliers]);
        }
        setShowForm(false);
        setEditingSupplier(null);
        setFormData({
          name: '',
          contactPerson: '',
          email: '',
          phone: '',
          address: '',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      notes: supplier.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuppliers(suppliers.filter(s => s._id !== id));
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-4xl mx-auto my-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Supplier Management</h2>

      <button 
        onClick={() => { setShowForm(true); setEditingSupplier(null); setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', notes: '' }); }}
        className="bg-blue-500 text-white px-3 py-1 rounded mb-4"
      >
        Add Supplier
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 border p-4 rounded">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Contact Person</label>
            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="mt-1 p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="mt-1 p-2 border rounded w-full"></textarea>
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
              {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded w-full">
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p>Loading suppliers...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Contact Person</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Notes</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier._id} className="border-b">
                  <td className="px-4 py-2 border">{supplier.name}</td>
                  <td className="px-4 py-2 border">{supplier.contactPerson}</td>
                  <td className="px-4 py-2 border">{supplier.email}</td>
                  <td className="px-4 py-2 border">{supplier.phone}</td>
                  <td className="px-4 py-2 border">{supplier.address}</td>
                  <td className="px-4 py-2 border">{supplier.notes}</td>
                  <td className="px-4 py-2 border">
                    <button onClick={() => handleEdit(supplier)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(supplier._id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4">No suppliers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

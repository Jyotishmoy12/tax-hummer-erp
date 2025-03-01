'use client';
import { useState, useEffect } from 'react';

export default function AccountingTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    account: '',
    debit: 0,
    credit: 0,
    description: '',
    currency: 'INR', // Default currency
  });

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch('/api/transactions');
        const data = await res.json();
        if (data.success) {
          setTransactions(data.data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Sending the correct currency
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(prev => [data.data, ...prev]);
        setFormData({
          date: '',
          account: '',
          debit: 0,
          credit: 0,
          description: '',
          currency: 'INR',
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDelete = async (transactionId) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const res = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(prev => prev.filter(txn => txn._id !== transactionId));
      } else {
        alert('Error deleting transaction: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Financial Transactions</h2>
      
      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Account</label>
          <input
            type="text"
            name="account"
            value={formData.account}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            placeholder="e.g. Cash, Revenue, Expense"
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Debit</label>
            <input
              type="number"
              name="debit"
              value={formData.debit}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              min="0"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Credit</label>
            <input
              type="number"
              name="credit"
              value={formData.credit}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              min="0"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          >
            <option value="INR">INR - Indian Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="AUD">AUD - Australian Dollar</option>
          </select>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Add Transaction
        </button>
      </form>
      
      {/* Transaction History */}
      {isLoading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Account</th>
                <th className="px-4 py-2 border">Debit</th>
                <th className="px-4 py-2 border">Credit</th>
                <th className="px-4 py-2 border">Currency</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id} className="border-b">
                  <td className="px-4 py-2 border">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{txn.account}</td>
                  <td className="px-4 py-2 border">{txn.debit}</td>
                  <td className="px-4 py-2 border">{txn.credit}</td>
                  {/* Fix: Ensure currency is displayed correctly */}
                  <td className="px-4 py-2 border">{txn.currency ? txn.currency : 'INR'}</td>
                  <td className="px-4 py-2 border">{txn.description}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDelete(txn._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No transactions recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

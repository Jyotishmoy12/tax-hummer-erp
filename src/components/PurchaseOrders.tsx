'use client';
import { useState, useEffect } from 'react';

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state for creating a new purchase order
  const [vendor, setVendor] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [newItem, setNewItem] = useState({ product: '', quantity: 0, cost: 0 });
  const [status, setStatus] = useState('Pending');

  // Fetch existing orders on mount
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/purchase-orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Add new item to the order
  const addNewItem = () => {
    if (newItem.product && newItem.quantity > 0 && newItem.cost > 0) {
      setOrderItems([...orderItems, newItem]);
      setNewItem({ product: '', quantity: 0, cost: 0 });
    }
  };

  // Create a new purchase order
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    // Calculate totalAmount as the sum of (quantity * cost) for each item
    const totalAmount = orderItems.reduce((acc, item) => acc + item.quantity * item.cost, 0);
    const orderData = {
      vendor,
      orderDate: orderDate || new Date(),
      items: orderItems,
      totalAmount,
      status,
    };

    try {
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success) {
        setOrders([data.data, ...orders]);
        // Reset form fields
        setVendor('');
        setOrderDate('');
        setOrderItems([]);
        setStatus('Pending');
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  };

  // Delete a purchase order
  const handleDeleteOrder = async (id) => {
    if (!confirm('Are you sure you want to delete this purchase order?')) return;
    try {
      const res = await fetch(`/api/purchase-orders/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter(order => order._id !== id));
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-4xl mx-auto my-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Purchase Orders</h2>
      
      {/* Form to create a new purchase order */}
      <form onSubmit={handleCreateOrder} className="mb-6 space-y-4 border p-4 rounded">
        <div>
          <label className="block text-sm font-medium">Vendor</label>
          <input
            type="text"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Order Date</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <div className="border p-2 rounded">
          <h3 className="text-lg font-medium mb-2">Order Items</h3>
          {orderItems.length > 0 && (
            <ul className="mb-2">
              {orderItems.map((item, index) => (
                <li key={index}>
                  {item.product} — Qty: {item.quantity} @ {item.cost} = {item.quantity * item.cost}
                </li>
              ))}
            </ul>
          )}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Product"
              value={newItem.product}
              onChange={(e) => setNewItem({ ...newItem, product: e.target.value })}
              className="border p-2 rounded flex-1"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              className="border p-2 rounded w-24"
            />
            <input
              type="number"
              placeholder="Cost"
              value={newItem.cost}
              onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })}
              className="border p-2 rounded w-24"
            />
            <button
              type="button"
              onClick={addNewItem}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add Item
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Create Purchase Order
        </button>
      </form>

      {/* Display existing purchase orders */}
      {isLoading ? (
        <p>Loading purchase orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">Existing Purchase Orders</h3>
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Vendor</th>
                <th className="px-4 py-2 border">Order Date</th>
                <th className="px-4 py-2 border">Total Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Items</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="px-4 py-2 border">{order.vendor}</td>
                  <td className="px-4 py-2 border">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{order.totalAmount}</td>
                  <td className="px-4 py-2 border">{order.status}</td>
                  <td className="px-4 py-2 border">
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.product} (Qty: {item.quantity}, Cost: {item.cost})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No purchase orders found.
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

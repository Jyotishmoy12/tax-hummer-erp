'use client';
import { useState, useEffect } from 'react';

export default function SalesPage() {
  const [salesOrders, setSalesOrders] = useState([]);

  useEffect(() => {
    async function fetchSalesOrders() {
      const res = await fetch('/api/sales-orders');
      const data = await res.json();
      if (data.success) {
        setSalesOrders(data.data);
      }
    }
    fetchSalesOrders();
  }, []);

  return (
    <div>
      <h1>Sales Orders Dashboard</h1>
      {salesOrders.length > 0 ? (
        salesOrders.map((order: any) => (
          <div key={order._id}>
            <p>Order ID: {order._id}</p>
            <p>Customer: {order.customer}</p>
            <p>Total Amount: {order.totalAmount}</p>
            <p>Status: {order.status}</p>
          </div>
        ))
      ) : (
        <p>No sales orders found.</p>
      )}
    </div>
  );
}

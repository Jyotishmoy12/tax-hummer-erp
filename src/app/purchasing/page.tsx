'use client';
import { useState, useEffect } from 'react';

export default function PurchasingPage() {
  const [vendorOrders, setVendorOrders] = useState([]);

  useEffect(() => {
    async function fetchVendorOrders() {
      const res = await fetch('/api/vendor-orders');
      const data = await res.json();
      if (data.success) {
        setVendorOrders(data.data);
      }
    }
    fetchVendorOrders();
  }, []);

  return (
    <div>
      <h1>Purchasing Module</h1>
      {vendorOrders.length > 0 ? (
        vendorOrders.map((order: any) => (
          <div key={order._id}>
            <p>Vendor: {order.vendor}</p>
            <p>Total Invoice: {order.totalInvoiceAmount}</p>
            <p>Status: {order.status}</p>
          </div>
        ))
      ) : (
        <p>No vendor orders found.</p>
      )}
    </div>
  );
}

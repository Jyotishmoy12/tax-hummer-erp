'use client';
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    async function fetchInventory() {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setInventoryItems(data.data);
      }
    }
    fetchInventory();
  }, []);

  return (
    <div>
      <h1>Inventory Module</h1>
      {inventoryItems.length > 0 ? (
        inventoryItems.map((item: any) => (
          <div key={item._id}>
            <p>
              {item.productName} - SKU: {item.sku} | Quantity: {item.quantity}
            </p>
          </div>
        ))
      ) : (
        <p>No inventory items found.</p>
      )}
    </div>
  );
}

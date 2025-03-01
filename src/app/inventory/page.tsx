'use client';
import { useState, useEffect } from 'react';
import PurchaseOrders from '../../components/PurchaseOrders';
import SupplierManagement from '../../components/SupplierManagement';
import StockValuation from '../../components/StockValuation';

export default function InventoryManagement() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reorderStatus, setReorderStatus] = useState({});

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await fetch('/api/inventory');
        const data = await res.json();
        if (data.success) {
          setInventoryItems(data.data);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const handleReorder = async (id) => {
    if (!confirm('Are you sure you want to reorder this item?')) return;
    try {
      // Assuming the reorder endpoint exists at /api/inventory/[id]/reorder
      const res = await fetch(`/api/inventory/${id}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setReorderStatus((prev) => ({ ...prev, [id]: 'Reorder placed successfully.' }));
      } else {
        setReorderStatus((prev) => ({ ...prev, [id]: 'Reorder failed: ' + data.error }));
      }
    } catch (error) {
      console.error('Error reordering item:', error);
      setReorderStatus((prev) => ({ ...prev, [id]: 'Reorder error.' }));
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-4xl mx-auto my-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Inventory Management</h2>
      {isLoading ? (
        <p>Loading inventory...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Product Name</th>
                <th className="px-4 py-2 border">SKU</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Reorder Level</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="px-4 py-2 border">{item.productName}</td>
                  <td className="px-4 py-2 border">{item.sku}</td>
                  <td className="px-4 py-2 border">{item.quantity}</td>
                  <td className="px-4 py-2 border">{item.reorderLevel || 0}</td>
                  <td className="px-4 py-2 border">
                    {item.quantity <= (item.reorderLevel || 0) ? (
                      <button
                        onClick={() => handleReorder(item._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Reorder
                      </button>
                    ) : (
                      <span className="text-green-500">Sufficient</span>
                    )}
                    {reorderStatus[item._id] && (
                      <div className="text-sm mt-1">{reorderStatus[item._id]}</div>
                    )}
                  </td>
                </tr>
              ))}
              {inventoryItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <PurchaseOrders/>
      <SupplierManagement/>
      

      <StockValuation/>
    </div>
  );
}

'use client';
import { useState } from 'react';

export default function StockValuation() {
  const [sku, setSku] = useState('');
  const [saleQuantity, setSaleQuantity] = useState(0);
  const [method, setMethod] = useState('FIFO');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleValuation = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const params = new URLSearchParams({
        sku,
        method,
        saleQuantity: saleQuantity.toString(),
      });
      const res = await fetch(`/api/inventory/valuation?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-2xl mx-auto my-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Stock Valuation</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Product SKU</label>
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          placeholder="Enter product SKU"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Sale Quantity</label>
        <input
          type="number"
          value={saleQuantity}
          onChange={(e) => setSaleQuantity(Number(e.target.value))}
          className="mt-1 p-2 border rounded w-full"
          placeholder="Enter quantity to value"
          min="1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Valuation Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        >
          <option value="FIFO">FIFO</option>
          <option value="LIFO">LIFO</option>
          <option value="Weighted">Weighted Average</option>
        </select>
      </div>
      <button
        onClick={handleValuation}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={isLoading}
      >
        {isLoading ? "Calculating..." : "Perform Valuation"}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <p><strong>Method:</strong> {result.method}</p>
          <p><strong>Sale Quantity:</strong> {result.saleQuantity}</p>
          <p>
            <strong>Cost of Goods Sold:</strong> {Number(result.costOfGoodsSold).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}

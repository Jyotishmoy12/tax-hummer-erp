'use client';
import { useState, useEffect } from 'react';

export default function BankReconciliationComponent() {
  const [reconciliationData, setReconciliationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReconciliation() {
      try {
        const res = await fetch('/api/bank-reconciliation');
        const data = await res.json();
        if (data.success) {
          setReconciliationData(data.data);
        }
      } catch (error) {
        console.error('Error fetching bank reconciliation data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReconciliation();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow max-w-4xl mx-auto my-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Bank Reconciliation</h2>
      {isLoading ? (
        <p>Loading reconciliation data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Statement ID</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Fraud Alert</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Matched Transaction</th>
              </tr>
            </thead>
            <tbody>
              {reconciliationData.map((item) => (
                <tr key={item.bankStatementId} className="border-b">
                  <td className="px-4 py-2 border">{item.bankStatementId}</td>
                  <td className="px-4 py-2 border">{item.status}</td>
                  <td className="px-4 py-2 border">{item.fraudAlert ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border">{item.statementAmount}</td>
                  <td className="px-4 py-2 border">
                    {item.matchedTransactionId ? item.matchedTransactionId : 'N/A'}
                  </td>
                </tr>
              ))}
              {reconciliationData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">No reconciliation data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

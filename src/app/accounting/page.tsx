'use client';
import { useState, useEffect } from 'react';

export default function AccountingPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>Accounting Module</h1>
      {transactions.length > 0 ? (
        transactions.map((txn: any) => (
          <div key={txn._id}>
            <p>{txn.description} | Debit: {txn.debit} | Credit: {txn.credit}</p>
          </div>
        ))
      ) : (
        <p>No transactions available.</p>
      )}
    </div>
  );
}

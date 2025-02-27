'use client';
import { useState, useEffect } from 'react';

export default function ITPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch('/api/system-logs');
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div>
      <h1>IT Admin Module</h1>
      {logs.length > 0 ? (
        logs.map((log: any) => (
          <div key={log._id}>
            <p>{log.timestamp}: {log.level} - {log.message}</p>
          </div>
        ))
      ) : (
        <p>No system logs available.</p>
      )}
    </div>
  );
}

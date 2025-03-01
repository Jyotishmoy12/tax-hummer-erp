'use client';
import { useState, useEffect } from 'react';

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/system-logs');
        const data = await res.json();
        if (data.success) {
          setLogs(data.data);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs?')) return;
    try {
      const res = await fetch('/api/system-logs', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLogs([]);
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">System Logs</h2>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading logs...</p>
        </div>
      ) : (
        <>
          <button
            onClick={handleClearLogs}
            className="mb-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear Logs
          </button>
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Timestamp</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Level</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Message</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-sm text-gray-700">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{log.level}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

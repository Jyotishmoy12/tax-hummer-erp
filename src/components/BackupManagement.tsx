'use client';
import { useState, useEffect } from 'react';

export default function BackupManagement() {
  const [backups, setBackups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function fetchBackups() {
      try {
        const res = await fetch('/api/backups');
        const data = await res.json();
        if (data.success) {
          setBackups(data.data);
        }
      } catch (error) {
        console.error('Error fetching backups:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBackups();
  }, []);

  const handleScheduleBackup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, description }),
      });
      const data = await res.json();
      if (data.success) {
        setBackups([data.data, ...backups]);
        setFileName('');
        setDescription('');
      }
    } catch (error) {
      console.error('Error scheduling backup:', error);
    }
  };

  const handleRestoreBackup = async (id) => {
    if (!confirm('Are you sure you want to restore this backup?')) return;
    try {
      const res = await fetch(`/api/backups/${id}/restore`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        alert('Backup restored successfully!');
      } else {
        alert('Error restoring backup: ' + data.message);
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Backup Management</h2>
      <form onSubmit={handleScheduleBackup} className="mb-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Backup File Name
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Optional: leave blank for auto-generated name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Backup description"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Schedule Backup
        </button>
      </form>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading backups...</p>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Backup History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">File Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Description</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup) => (
                  <tr key={backup._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {new Date(backup.backupDate).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">{backup.fileName}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{backup.status}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{backup.description}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleRestoreBackup(backup._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors"
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
                {backups.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-600">
                      No backups found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

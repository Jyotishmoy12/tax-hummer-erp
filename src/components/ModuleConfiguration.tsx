'use client';
import { useState, useEffect } from 'react';

interface ModuleConfig {
  accountingEnabled?: string;
  salesSetting?: string;
}

export default function ModuleConfiguration() {
  const [config, setConfig] = useState<ModuleConfig>({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ModuleConfig>({});

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/module-config');
        const data = await res.json();
        if (data.success) {
          setConfig(data.config);
          setFormData(data.config || {});
        }
      } catch (error) {
        console.error('Error fetching module configuration:', error);
      }
    }
    fetchConfig();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/module-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Module Configuration</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enable Accounting Module
            </label>
            <select
              name="accountingEnabled"
              value={formData.accountingEnabled || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select</option>
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sales Module Setting
            </label>
            <input
              type="text"
              name="salesSetting"
              value={formData.salesSetting || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter sales setting"
            />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <pre className="bg-gray-100 p-4 rounded-lg mb-6 text-gray-800 text-sm">
            {JSON.stringify(config, null, 2)}
          </pre>
          <button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Edit Configuration
          </button>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('generalUser');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (data.success) {
        // Determine redirect based on the user role from the response
        const userRole = data.data.user.role;
        if (userRole === 'accountant') {
          router.push('/accounting');
        } else if (userRole === 'inventoryManager') {
          router.push('/inventory');
        } else if (userRole === 'salesPersonnel') {
          router.push('/sales');
        } else if (userRole === 'hrStaff') {
          router.push('/hr');
        } else if (userRole === 'purchasingManager') {
          router.push('/purchasing');
        } else if (userRole === 'itAdmin') {
          router.push('/it');
        } else if (userRole === 'superadmin') {
          router.push('/dashboard');
        } else {
          // Fallback for general user or any other role
          router.push('/');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <label className="block mb-2">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            required
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            required
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            required
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Role</span>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          >
            <option value="generalUser">General User</option>
            <option value="superadmin">Super Admin</option>
            <option value="accountant">Accountant</option>
            <option value="inventoryManager">Inventory Manager</option>
            <option value="salesPersonnel">Sales Personnel</option>
            <option value="hrStaff">HR Staff</option>
            <option value="purchasingManager">Purchasing Manager</option>
            <option value="itAdmin">IT Admin</option>
          </select>
        </label>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
}

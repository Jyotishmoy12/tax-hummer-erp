'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        console.log('Login successful, user data:', data.data);
        
        // Determine redirect based on the user role from the response
        const userRole = data.data.user.role;
        console.log('User role:', userRole);
        
        // Redirect based on role
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
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
        <label className="block mb-4">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            required
          />
        </label>
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  TruckIcon, 
  MonitorIcon,
  PlusCircle,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ChevronDown,
  Search
} from 'lucide-react';
import ModuleConfiguration from '../../components/ModuleConfiguration';
import SystemLogs from '../../components/SystemLogs';
import BackupManagement from '../../components/BackupManagement';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // States for User Management Form
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });

  // Dashboard stats animation
  const [animatedStats, setAnimatedStats] = useState({
    transactions: 0,
    inventory: 0,
    salesOrders: 0,
    employees: 0,
    vendorOrders: 0,
    systemLogs: 0
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data concurrently including users
        const [
          transRes,
          inventoryRes,
          salesRes,
          empRes,
          vendorRes,
          logsRes,
          usersRes,
        ] = await Promise.all([
          fetch('/api/transactions'),
          fetch('/api/inventory'),
          fetch('/api/sales-orders'),
          fetch('/api/employees'),
          fetch('/api/vendor-orders'),
          fetch('/api/system-logs'),
          fetch('/api/users'),
        ]);

        const [
          transData,
          inventoryData,
          salesData,
          empData,
          vendorData,
          logsData,
          usersData,
        ] = await Promise.all([
          transRes.json(),
          inventoryRes.json(),
          salesRes.json(),
          empRes.json(),
          vendorRes.json(),
          logsRes.json(),
          usersRes.json(),
        ]);

        if (transData.success) setTransactions(transData.data);
        if (inventoryData.success) setInventory(inventoryData.data);
        if (salesData.success) setSalesOrders(salesData.data);
        if (empData.success) setEmployees(empData.data);
        if (vendorData.success) setVendorOrders(vendorData.data);
        if (logsData.success) setSystemLogs(logsData.data);
        if (usersData.success) setUsers(usersData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      let startTime = null;
      const duration = 1500; // 1.5 seconds for the animation
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        setAnimatedStats({
          transactions: Math.floor(progress * transactions.length),
          inventory: Math.floor(progress * inventory.length),
          salesOrders: Math.floor(progress * salesOrders.length),
          employees: Math.floor(progress * employees.length),
          vendorOrders: Math.floor(progress * vendorOrders.length),
          systemLogs: Math.floor(progress * systemLogs.length)
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimatedStats({
            transactions: transactions.length,
            inventory: inventory.length,
            salesOrders: salesOrders.length,
            employees: employees.length,
            vendorOrders: vendorOrders.length,
            systemLogs: systemLogs.length
          });
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isLoading, transactions, inventory, salesOrders, employees, vendorOrders, systemLogs]);

  // Handle form input changes
  const handleUserFormChange = (e) => {
    setUserFormData({
      ...userFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle adding a new user
  const handleAddUser = () => {
    setEditingUser(null);
    setUserFormData({ name: '', email: '', role: '', password: '' });
    setShowUserForm(true);
  };

  // Handle editing a user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '', // keep blank for security
    });
    setShowUserForm(true);
  };

  // Handle deleting a user
  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter((user) => user._id !== id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle form submission for adding/updating a user
  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingUser ? `/api/users/${editingUser._id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userFormData),
      });
      const data = await res.json();
      if (data.success) {
        if (editingUser) {
          setUsers(users.map((user) => (user._id === editingUser._id ? data.user : user)));
        } else {
          setUsers([...users, data.user]);
        }
        setShowUserForm(false);
        setEditingUser(null);
        setUserFormData({ name: '', email: '', role: '', password: '' });
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Refresh dashboard data
  const refreshData = () => {
    setRefreshing(true);
    // Trigger refetch by re-running the useEffect
    setIsLoading(true);
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    const roleColors = {
      superadmin: 'bg-purple-600',
      accountant: 'bg-green-600',
      inventoryManager: 'bg-amber-600',
      salesPersonal: 'bg-blue-600',
      hrStaff: 'bg-pink-600',
      purchasingManager: 'bg-teal-600',
      itAdmin: 'bg-indigo-600',
      generalUser: 'bg-gray-600'
    };
    return roleColors[role] || 'bg-gray-600';
  };

  // Get module icon based on name (if needed)
  const getModuleIcon = (name, size = 24) => {
    const icons = {
      'Accounting': <DollarSign size={size} className="text-green-600" />,
      'Inventory': <Package size={size} className="text-amber-600" />,
      'Sales': <ShoppingCart size={size} className="text-blue-600" />,
      'HR': <Users size={size} className="text-pink-600" />,
      'Purchasing': <TruckIcon size={size} className="text-teal-600" />,
      'IT Admin': <MonitorIcon size={size} className="text-indigo-600" />,
      'Dashboard': <BarChart3 size={size} className="text-purple-600" />
    };
    return icons[name] || null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-xl font-semibold text-purple-800 animate-pulse">
          Loading Tax Hummer ERP Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-20 pb-10">
      <div className="container mx-auto p-4">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 ">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-purple-600 p-3  mr-4">
              <BarChart3 size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent text-center">
                Tax Hummer ERP Dashboard
              </h1>
              <p className="text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <button 
            onClick={refreshData}
            className="flex items-center bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="mb-8 bg-white p-2 rounded-xl shadow-lg flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center px-4 py-2 rounded-lg mr-2 transition-all duration-300 ${
              activeTab === 'overview' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'hover:bg-purple-100 text-gray-700'
            }`}
          >
            <BarChart3 size={18} className="mr-2" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-4 py-2 rounded-lg mr-2 transition-all duration-300 ${
              activeTab === 'users' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'hover:bg-purple-100 text-gray-700'
            }`}
          >
            <Users size={18} className="mr-2" />
            User Management
          </button>
        </div>
        
        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Accounting Summary */}
              <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-105 border-t-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Accounting</h2>
                    <div className="text-3xl font-bold text-green-600 mb-4 transition-all">
                      {animatedStats.transactions}
                    </div>
                    <p className="text-gray-600">Total Transactions</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign size={30} className="text-green-600" />
                  </div>
                </div>
                {transactions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-800">Latest Transaction:</h3>
                    <p className="text-gray-600">{transactions[0].description}</p>
                    <div className="flex mt-2">
                      <span className="text-green-600 bg-green-100 text-sm px-2 py-1 rounded-md mr-2">
                        Debit: ${transactions[0].debit.toLocaleString()}
                      </span>
                      <span className="text-red-600 bg-red-100 text-sm px-2 py-1 rounded-md">
                        Credit: ${transactions[0].credit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Inventory Summary */}
              <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-105 border-t-4 border-amber-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Inventory</h2>
                    <div className="text-3xl font-bold text-amber-600 mb-4 transition-all">
                      {animatedStats.inventory}
                    </div>
                    <p className="text-gray-600">Total Items</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Package size={30} className="text-amber-600" />
                  </div>
                </div>
                {inventory.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-800">Latest Item:</h3>
                    <p className="text-gray-600">{inventory[0].productName}</p>
                    <div className="flex mt-2">
                      <span className="text-amber-600 bg-amber-100 text-sm px-2 py-1 rounded-md mr-2">
                        SKU: {inventory[0].sku}
                      </span>
                      <span className="text-blue-600 bg-blue-100 text-sm px-2 py-1 rounded-md">
                        Qty: {inventory[0].quantity}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sales Summary */}
              <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-105 border-t-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Sales</h2>
                    <div className="text-3xl font-bold text-blue-600 mb-4 transition-all">
                      {animatedStats.salesOrders}
                    </div>
                    <p className="text-gray-600">Total Orders</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <ShoppingCart size={30} className="text-blue-600" />
                  </div>
                </div>
                {salesOrders.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-800">Latest Order:</h3>
                    <p className="text-gray-600">{salesOrders[0].customer}</p>
                    <div className="mt-2">
                      <span className="text-blue-600 bg-blue-100 text-sm px-2 py-1 rounded-md">
                        Amount: ${salesOrders[0].totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* HR Summary */}
              <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-105 border-t-4 border-pink-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">HR Management</h2>
                    <div className="text-3xl font-bold text-pink-600 mb-4 transition-all">
                      {animatedStats.employees}
                    </div>
                    <p className="text-gray-600">Total Employees</p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <Users size={30} className="text-pink-600" />
                  </div>
                </div>
                {employees.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-800">Latest Employee:</h3>
                    <p className="text-gray-600">{employees[0].name}</p>
                    <div className="mt-2">
                      <span className="text-pink-600 bg-pink-100 text-sm px-2 py-1 rounded-md">
                        Position: {employees[0].position}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Purchasing Summary */}
              <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-105 border-t-4 border-teal-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Purchasing</h2>
                    <div className="text-3xl font-bold text-teal-600 mb-4 transition-all">
                      {animatedStats.vendorOrders}
                    </div>
                    <p className="text-gray-600">Total Vendor Orders</p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <TruckIcon size={30} className="text-teal-600" />
                  </div>
                </div>
                {vendorOrders.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-800">Latest Vendor Order:</h3>
                    <p className="text-gray-600">{vendorOrders[0].vendor}</p>
                    <div className="mt-2">
                      <span className="text-teal-600 bg-teal-100 text-sm px-2 py-1 rounded-md">
                        Invoice: ${vendorOrders[0].totalInvoiceAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* IT Admin Summary */}
              <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-105 border-t-4 border-indigo-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">IT Admin</h2>
                    <div className="text-3xl font-bold text-indigo-600 mb-4 transition-all">
                      {animatedStats.systemLogs}
                    </div>
                    <p className="text-gray-600">Total System Logs</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <MonitorIcon size={30} className="text-indigo-600" />
                  </div>
                </div>
                {systemLogs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-800">Latest Log:</h3>
                    <p className="text-gray-600 truncate">{systemLogs[0].message}</p>
                    <div className="mt-2 flex items-center">
                      <span className={`text-sm px-2 py-1 rounded-md ${
                        systemLogs[0].level === 'ERROR' 
                          ? 'bg-red-100 text-red-600' 
                          : systemLogs[0].level === 'WARNING'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                      }`}>
                        {systemLogs[0].level}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">
                        {new Date(systemLogs[0].timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'users' && (
          /* User Management Section */
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Users size={24} className="text-purple-600 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
              </div>
              <button
                onClick={handleAddUser}
                className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <PlusCircle size={18} className="mr-2" />
                Add User
              </button>
            </div>
            
            {/* Search and filter */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* User table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* User form modal */}
            {showUserForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {editingUser ? 'Edit User' : 'Add New User'}
                    </h3>
                    <button
                      onClick={() => setShowUserForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleUserFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={userFormData.name}
                        onChange={handleUserFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={userFormData.email}
                        onChange={handleUserFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <div className="relative">
                        <select
                          name="role"
                          value={userFormData.role}
                          onChange={handleUserFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Role</option>
                          <option value="superadmin">Super Admin</option>
                          <option value="accountant">Accountant</option>
                          <option value="inventoryManager">Inventory Manager</option>
                          <option value="salesPersonal">Sales Personal</option>
                          <option value="hrStaff">HR Staff</option>
                          <option value="purchasingManager">Purchasing Manager</option>
                          <option value="itAdmin">IT Admin</option>
                          <option value="generalUser">General User</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={userFormData.password}
                        onChange={handleUserFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowUserForm(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {editingUser ? 'Update User' : 'Add User'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Uncomment these components if needed */}
      {/* <ModuleConfiguration/>
      <SystemLogs/>
      <BackupManagement/> */}
    </div>
  );
}

"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart3, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  TruckIcon, 
  MonitorIcon, 
  LogIn, 
  UserPlus,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <BarChart3 size={18} /> },
    { name: 'Accounting', href: '/accounting', icon: <DollarSign size={18} /> },
    { name: 'Inventory', href: '/inventory', icon: <Package size={18} /> },
    { name: 'Sales', href: '/sales', icon: <ShoppingCart size={18} /> },
    { name: 'HR', href: '/hr', icon: <Users size={18} /> },
    { name: 'Purchasing', href: '/purchasing', icon: <TruckIcon size={18} /> },
    { name: 'IT', href: '/it', icon: <MonitorIcon size={18} /> },
  ];

  const authLinks = [
    { name: 'Login', href: '/auth/login', icon: <LogIn size={18} /> },
    { name: 'Register', href: '/auth/register', icon: <UserPlus size={18} /> },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Home className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Tax Hummer ERP
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium mx-1 transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-blue-400'
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              <div className="h-6 mx-2 border-l border-gray-700"></div>
              {authLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium mx-1 ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white'
                      : link.name === 'Register' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-blue-400'
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-blue-400 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </Link>
          ))}
          <div className="border-t border-gray-700 my-2 pt-2">
            {authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-blue-600 text-white'
                    : link.name === 'Register' 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white mt-2'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
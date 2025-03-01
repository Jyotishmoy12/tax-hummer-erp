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
    <nav className="fixed top-0 w-full z-50 bg-white shadow-lg border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-1.5 rounded-lg shadow-md group-hover:from-purple-600 group-hover:to-purple-800 transition-all duration-300">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2.5 text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-purple-900 transition-all duration-300">
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
                      ? 'bg-purple-100 text-purple-800 shadow-sm border border-purple-200'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <span className={`mr-1.5 ${isActive(link.href) ? 'text-purple-600' : 'text-purple-500'}`}>
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
              ))}
              <div className="h-6 mx-3 border-l border-purple-200"></div>
              {authLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium mx-1 transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-purple-600 text-white shadow-md'
                      : link.name === 'Register' 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md'
                        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <span className={`mr-1.5 ${
                    link.name === 'Register' || isActive(link.href) ? 'text-white' : 'text-purple-500'
                  }`}>{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-purple-700 hover:bg-purple-50 focus:outline-none transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? (
                <X className="block h-6 w-6 text-purple-600" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-inner border-b border-purple-100">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? 'bg-purple-100 text-purple-800 shadow-sm border border-purple-200'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <span className={`mr-3 ${isActive(link.href) ? 'text-purple-600' : 'text-purple-500'}`}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}
          <div className="border-t border-purple-100 my-2 pt-2">
            {authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-purple-600 text-white shadow-md'
                    : link.name === 'Register' 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md mt-2'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <span className={`mr-3 ${
                  link.name === 'Register' || isActive(link.href) ? 'text-white' : 'text-purple-500'
                }`}>{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
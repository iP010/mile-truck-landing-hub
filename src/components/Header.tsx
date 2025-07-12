
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);
  const location = useLocation();
  const { t, language } = useLanguage();
  const { admin, logout } = useAdmin();
  const isRTL = language === 'ar' || language === 'ur';

  const isActive = (path: string) => location.pathname === path;

  const managementItems = [
    { path: '/pricing-management', label: isRTL ? 'إدارة الأسعار' : 'Pricing Management' },
    { path: '/companies-management', label: isRTL ? 'إدارة الشركات' : 'Companies Management' },
    { path: '/drivers-management', label: isRTL ? 'إدارة السائقين' : 'Drivers Management' },
    { path: '/trip-pricing', label: isRTL ? 'أسعار الرحلات' : 'Trip Pricing' },
    { path: '/cities-vehicles-management', label: isRTL ? 'إدارة المدن' : 'Cities Management' },
    { path: '/price-calculator', label: isRTL ? 'حاسبة الأسعار' : 'Price Calculator' },
    { path: '/pricing-reports', label: isRTL ? 'التقارير' : 'Reports' },
    { path: '/driver-waitlist', label: isRTL ? 'قائمة انتظار السائقين' : 'Driver Waitlist' },
    { path: '/company-waitlist', label: isRTL ? 'قائمة انتظار الشركات' : 'Company Waitlist' },
  ];

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/contact', label: t.nav.contact },
    { path: '/drivers', label: t.nav.driverRegistration },
    { path: '/companies', label: t.nav.companyRegistration },
    ...(admin ? [
      { path: '/dashboard', label: isRTL ? 'لوحة التحكم' : 'Dashboard' }
    ] : []),
    { path: '/admin', label: t.nav.admin }
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const isManagementItemActive = managementItems.some(item => isActive(item.path));

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/60c60984-d736-4ced-a952-8138688cdfdd.png" 
              alt="Mile Truck Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Management Panel Dropdown */}
            {admin && (
              <div 
                className="relative"
                onMouseEnter={() => setIsManagementDropdownOpen(true)}
                onMouseLeave={() => setIsManagementDropdownOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isManagementItemActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  {isRTL ? 'لوحة الإدارة' : 'Management Panel'}
                  <ChevronDown size={16} className={`transition-transform ${isManagementDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isManagementDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-2">
                      {managementItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            isActive(item.path)
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <LanguageSelector />
            
            {/* Admin Section */}
            {admin && (
              <div className="flex items-center gap-3 border-l pl-4 ml-2">
                <Link
                  to="/admin-profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <User size={16} />
                  {admin.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  <LogOut size={16} />
                  {isRTL ? 'خروج' : 'Logout'}
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Management Panel */}
              {admin && (
                <div className="border-t pt-2 mt-2">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-900">
                    {isRTL ? 'لوحة الإدارة' : 'Management Panel'}
                  </div>
                  {managementItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-6 py-2 text-sm transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary text-white rounded-md mx-3'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/10 rounded-md mx-3'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
              
              {/* Mobile Admin Section */}
              {admin && (
                <div className="border-t pt-2 mt-2">
                  <Link
                    to="/admin-profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                  >
                    <User size={16} />
                    {admin.username}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors w-full"
                  >
                    <LogOut size={16} />
                    {isRTL ? 'خروج' : 'Logout'}
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

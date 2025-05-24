import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Building2, Calendar, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { supabase } from '../integrations/supabase/client';
import { Tables } from '../integrations/supabase/types';
import Header from '../components/Header';

type Driver = Tables<'drivers'>;
type Company = Tables<'companies'>;

const Admin = () => {
  const { t, language } = useLanguage();
  const { admin } = useAdmin();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState<'drivers' | 'companies'>('drivers');
  const [loading, setLoading] = useState(true);
  const isRTL = language === 'ar' || language === 'ur';

  // Redirect to login if not authenticated
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [driversResult, companiesResult] = await Promise.all([
        supabase.from('drivers').select('*').order('created_at', { ascending: false }),
        supabase.from('companies').select('*').order('created_at', { ascending: false })
      ]);

      if (driversResult.data) setDrivers(driversResult.data);
      if (companiesResult.data) setCompanies(companiesResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t.admin.title}
              </h1>
              <p className="text-gray-600">
                {isRTL ? 'إدارة بيانات السائقين والشركات' : 'Manage drivers and companies data'}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {t.admin.drivers}
                    </h3>
                    <p className="text-3xl font-bold text-primary">{drivers.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {t.admin.companies}
                    </h3>
                    <p className="text-3xl font-bold text-primary">{companies.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('drivers')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'drivers'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users size={18} />
                      {t.admin.drivers} ({drivers.length})
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('companies')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'companies'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 size={18} />
                      {t.admin.companies} ({companies.length})
                    </div>
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'drivers' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.admin.name}
                          </th>
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.admin.phone}
                          </th>
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.admin.details}
                          </th>
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.admin.registrationDate}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {drivers.map((driver) => (
                          <tr key={driver.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {driver.driver_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {driver.nationality}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center gap-1 mb-1">
                                  <Phone size={14} />
                                  {formatPhoneNumber(driver.phone_number)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  WhatsApp: {formatPhoneNumber(driver.whatsapp_number)}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div>
                                  {driver.truck_brand} - {driver.truck_type}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {driver.has_insurance ? 
                                    `${isRTL ? 'مؤمن' : 'Insured'}: ${driver.insurance_type}` : 
                                    `${isRTL ? 'غير مؤمن' : 'Not Insured'}`
                                  }
                                </div>
                                {driver.referral_code && (
                                  <div className="text-xs text-primary">
                                    {isRTL ? 'كود الإحالة' : 'Referral'}: {driver.referral_code}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar size={14} />
                                {formatDate(driver.created_at)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {drivers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        {isRTL ? 'لا توجد بيانات سائقين' : 'No drivers data available'}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.admin.name}
                          </th>
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.admin.phone}
                          </th>
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.admin.details}
                          </th>
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t.admin.registrationDate}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {companies.map((company) => (
                          <tr key={company.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {company.company_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {isRTL ? 'المدير' : 'Manager'}: {company.manager_name}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center gap-1 mb-1">
                                  <Phone size={14} />
                                  {formatPhoneNumber(company.phone_number)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  WhatsApp: {formatPhoneNumber(company.whatsapp_number)}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div>
                                  {company.truck_count} {isRTL ? 'شاحنة' : 'trucks'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {company.has_insurance ? 
                                    `${isRTL ? 'مؤمن' : 'Insured'}: ${company.insurance_type}` : 
                                    `${isRTL ? 'غير مؤمن' : 'Not Insured'}`
                                  }
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar size={14} />
                                {formatDate(company.created_at)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {companies.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        {isRTL ? 'لا توجد بيانات شركات' : 'No companies data available'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

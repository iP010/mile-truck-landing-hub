import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';
import { Users, Building2 } from 'lucide-react';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  const [driversCount, setDriversCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showDrivers, setShowDrivers] = useState(true);
  const [showCompanies, setShowCompanies] = useState(true);

  useEffect(() => {
    const storedDrivers = localStorage.getItem('dashboard_show_drivers');
    const storedCompanies = localStorage.getItem('dashboard_show_companies');
    if (storedDrivers !== null) setShowDrivers(storedDrivers === '1');
    if (storedCompanies !== null) setShowCompanies(storedCompanies === '1');
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const { count: drivers } = await supabase
        .from('drivers')
        .select('*', { count: 'exact', head: true });
      const { count: companies } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });
      setDriversCount(drivers ?? 0);
      setCompaniesCount(companies ?? 0);
    } catch (error) {
      console.error('Failed to fetch counts', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDrivers = () => {
    const value = !showDrivers;
    setShowDrivers(value);
    localStorage.setItem('dashboard_show_drivers', value ? '1' : '0');
  };

  const toggleCompanies = () => {
    const value = !showCompanies;
    setShowCompanies(value);
    localStorage.setItem('dashboard_show_companies', value ? '1' : '0');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isRTL ? 'لوحة التحكم' : 'Dashboard'}
        </h1>

        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showDrivers} onChange={toggleDrivers} />
            {isRTL ? 'عرض السائقين' : 'Show Drivers'}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showCompanies} onChange={toggleCompanies} />
            {isRTL ? 'عرض الشركات' : 'Show Companies'}
          </label>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showDrivers && (
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t.admin.drivers}
                  </h3>
                  <p className="text-3xl font-bold text-primary">{driversCount}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            )}
            {showCompanies && (
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t.admin.companies}
                  </h3>
                  <p className="text-3xl font-bold text-primary">{companiesCount}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

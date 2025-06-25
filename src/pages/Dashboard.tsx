import React, { useEffect, useState } from 'react';
import { Users, Building2 } from 'lucide-react';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../integrations/supabase/client';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';

  const [driverCount, setDriverCount] = useState<number | null>(null);
  const [companyCount, setCompanyCount] = useState<number | null>(null);
  const [showDrivers, setShowDrivers] = useState(true);
  const [showCompanies, setShowCompanies] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('dashboard_prefs');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        if (typeof prefs.showDrivers === 'boolean') setShowDrivers(prefs.showDrivers);
        if (typeof prefs.showCompanies === 'boolean') setShowCompanies(prefs.showCompanies);
      } catch {
        /* ignore */
      }
    }
    fetchCounts();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'dashboard_prefs',
      JSON.stringify({ showDrivers, showCompanies })
    );
  }, [showDrivers, showCompanies]);

  const fetchCounts = async () => {
    try {
      const [driversRes, companiesRes] = await Promise.all([
        supabase.from('drivers').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true })
      ]);
      if (driversRes.count !== null) setDriverCount(driversRes.count);
      if (companiesRes.count !== null) setCompanyCount(companiesRes.count);
    } catch (error) {
      console.error('Failed to fetch counts', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold">{t.dashboard.title}</h1>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="border rounded"
              checked={showDrivers}
              onChange={(e) => setShowDrivers(e.target.checked)}
            />
            {t.dashboard.showDrivers}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="border rounded"
              checked={showCompanies}
              onChange={(e) => setShowCompanies(e.target.checked)}
            />
            {t.dashboard.showCompanies}
          </label>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {showDrivers && (
            <div className="p-6 bg-white rounded-lg shadow flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{t.dashboard.drivers}</div>
                <div className="text-3xl font-bold">
                  {driverCount !== null ? driverCount : '—'}
                </div>
              </div>
              <Users size={32} className="text-primary" />
            </div>
          )}
          {showCompanies && (
            <div className="p-6 bg-white rounded-lg shadow flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{t.dashboard.companies}</div>
                <div className="text-3xl font-bold">
                  {companyCount !== null ? companyCount : '—'}
                </div>
              </div>
              <Building2 size={32} className="text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

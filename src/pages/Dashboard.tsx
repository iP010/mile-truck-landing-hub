import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Building2, TrendingUp, Calendar, Settings, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { getSupabaseClient } from '../integrations/supabase/client';
import { Tables } from '../integrations/supabase/types';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import DashboardCard from '../components/dashboard/DashboardCard';
import DashboardSettings from '../components/dashboard/DashboardSettings';
import DriversNationalityChart from '../components/dashboard/DriversNationalityChart';
import CompaniesChart from '../components/dashboard/CompaniesChart';
import DriversInsuranceChart from '../components/dashboard/DriversInsuranceChart';

type Driver = Tables<'drivers'>;
type Company = Tables<'companies'>;

interface DashboardStats {
  driversCount: number;
  companiesCount: number;
  recentDrivers: number;
  recentCompanies: number;
  totalTrucks: number;
  driversWithInsurance: number;
  companiesWithInsurance: number;
  totalPricingCompanies: number;
  activePricingCompanies: number;
}

interface DashboardConfig {
  showRecentStats: boolean;
  showTruckCount: boolean;
  refreshInterval: number;
  cardLayout: 'grid' | 'list';
}

interface NationalityData {
  nationality: string;
  count: number;
}

interface CompanyData {
  company_name: string;
  truck_count: number;
}

interface InsuranceTypeData {
  insurance_type: string;
  count: number;
}

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { admin } = useAdmin();
  const [stats, setStats] = useState<DashboardStats>({
    driversCount: 0,
    companiesCount: 0,
    recentDrivers: 0,
    recentCompanies: 0,
    totalTrucks: 0,
    driversWithInsurance: 0,
    companiesWithInsurance: 0,
    totalPricingCompanies: 0,
    activePricingCompanies: 0
  });
  const [nationalityData, setNationalityData] = useState<NationalityData[]>([]);
  const [companiesData, setCompaniesData] = useState<CompanyData[]>([]);
  const [driversInsuranceData, setDriversInsuranceData] = useState<InsuranceTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<DashboardConfig>({
    showRecentStats: true,
    showTruckCount: true,
    refreshInterval: 30000, // 30 seconds
    cardLayout: 'grid'
  });
  const isRTL = language === 'ar' || language === 'ur';

  // Redirect to login if not authenticated
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  useEffect(() => {
    loadStats();
    
    // Auto refresh based on settings
    if (settings.refreshInterval > 0) {
      const interval = setInterval(loadStats, settings.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [settings.refreshInterval]);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading dashboard settings:', error);
      }
    }
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      console.log('Loading dashboard stats...');

      // Use the new secure dashboard_stats view
      const { data: dashboardStats, error: statsError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();

      if (statsError) {
        console.error('Error loading dashboard stats:', statsError);
      }

      const [
        recentDriversResult, 
        recentCompaniesResult,
        driversDataResult,
        companiesDataResult
      ] = await Promise.all([
        supabase.from('drivers').select('id', { count: 'exact' })
          .gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('companies').select('id', { count: 'exact' })
          .gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('drivers').select('nationality, insurance_type'),
        supabase.from('companies').select('company_name, truck_count')
      ]);

      // Calculate total trucks: drivers (1 each) + companies' truck counts
      let totalTrucks = 0;
      const driversCount = dashboardStats?.total_drivers || 0;
      totalTrucks += driversCount; // Each driver has 1 truck
      
      if (companiesDataResult.data) {
        totalTrucks += companiesDataResult.data.reduce((sum, company) => sum + (company.truck_count || 0), 0);
      }

      // Process nationality data
      const nationalityMap = new Map<string, number>();
      const insuranceTypeMap = new Map<string, number>();

      if (driversDataResult.data) {
        driversDataResult.data.forEach(driver => {
          // Count by nationality
          const nationality = driver.nationality || (isRTL ? 'غير محدد' : 'Unknown');
          nationalityMap.set(nationality, (nationalityMap.get(nationality) || 0) + 1);
          
          // Count by insurance type
          const insuranceType = driver.insurance_type || (isRTL ? 'غير محدد' : 'Not Specified');
          insuranceTypeMap.set(insuranceType, (insuranceTypeMap.get(insuranceType) || 0) + 1);
        });
      }

      const nationalityData: NationalityData[] = Array.from(nationalityMap.entries()).map(([nationality, count]) => ({
        nationality,
        count
      }));

      const driversInsuranceData: InsuranceTypeData[] = Array.from(insuranceTypeMap.entries()).map(([insurance_type, count]) => ({
        insurance_type,
        count
      }));

      // Process companies data
      const companiesData: CompanyData[] = companiesDataResult.data?.map(company => ({
        company_name: company.company_name,
        truck_count: company.truck_count || 0
      })) || [];

      setStats({
        driversCount: Number(dashboardStats?.total_drivers || 0),
        companiesCount: Number(dashboardStats?.total_companies || 0),
        recentDrivers: recentDriversResult.count || 0,
        recentCompanies: recentCompaniesResult.count || 0,
        totalTrucks,
        driversWithInsurance: Number(dashboardStats?.drivers_with_insurance || 0),
        companiesWithInsurance: Number(dashboardStats?.companies_with_insurance || 0),
        totalPricingCompanies: Number(dashboardStats?.total_pricing_companies || 0),
        activePricingCompanies: Number(dashboardStats?.active_pricing_companies || 0)
      });

      setNationalityData(nationalityData);
      setCompaniesData(companiesData);
      setDriversInsuranceData(driversInsuranceData);

      console.log('Dashboard stats loaded successfully:', {
        driversCount: dashboardStats?.total_drivers,
        companiesCount: dashboardStats?.total_companies,
        totalTrucks,
        driversWithInsurance: dashboardStats?.drivers_with_insurance,
        companiesWithInsurance: dashboardStats?.companies_with_insurance
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = (newSettings: DashboardConfig) => {
    setSettings(newSettings);
    localStorage.setItem('dashboardSettings', JSON.stringify(newSettings));
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">{isRTL ? 'جاري تحميل البيانات...' : 'Loading dashboard...'}</p>
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                </h1>
                <p className="text-gray-600">
                  {isRTL ? 'نظرة عامة على بيانات النظام' : 'Overview of system data'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  onClick={loadStats}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
                  {isRTL ? 'تحديث' : 'Refresh'}
                </Button>
                
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  size="sm"
                >
                  <Settings size={16} className="mr-1" />
                  {isRTL ? 'إعدادات' : 'Settings'}
                </Button>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className={`grid gap-6 mb-8 ${
              settings.cardLayout === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
                : 'grid-cols-1 space-y-4'
            }`}>
              {/* Drivers Count */}
              <DashboardCard
                title={isRTL ? 'إجمالي السائقين' : 'Total Drivers'}
                value={formatNumber(stats.driversCount)}
                icon={Users}
                color="blue"
                trend={settings.showRecentStats ? {
                  value: stats.recentDrivers,
                  label: isRTL ? 'هذا الشهر' : 'This month'
                } : undefined}
                layout={settings.cardLayout}
                subtitle={isRTL ? `مؤمن: ${formatNumber(stats.driversWithInsurance)}` : `Insured: ${formatNumber(stats.driversWithInsurance)}`}
              />

              {/* Companies Count */}
              <DashboardCard
                title={isRTL ? 'إجمالي الشركات' : 'Total Companies'}
                value={formatNumber(stats.companiesCount)}
                icon={Building2}
                color="green"
                trend={settings.showRecentStats ? {
                  value: stats.recentCompanies,
                  label: isRTL ? 'هذا الشهر' : 'This month'
                } : undefined}
                layout={settings.cardLayout}
                subtitle={isRTL ? `مؤمن: ${formatNumber(stats.companiesWithInsurance)}` : `Insured: ${formatNumber(stats.companiesWithInsurance)}`}
              />

              {/* Total Trucks (Drivers + Companies) */}
              {settings.showTruckCount && (
                <DashboardCard
                  title={isRTL ? 'إجمالي الشاحنات' : 'Total Trucks'}
                  value={formatNumber(stats.totalTrucks)}
                  icon={TrendingUp}
                  color="purple"
                  subtitle={isRTL ? 'سائقين + شاحنات الشركات' : 'Drivers + Company Trucks'}
                  layout={settings.cardLayout}
                />
              )}

              {/* Pricing Companies */}
              <DashboardCard
                title={isRTL ? 'شركات الأسعار' : 'Pricing Companies'}
                value={formatNumber(stats.totalPricingCompanies)}
                icon={Calendar}
                color="orange"
                subtitle={isRTL ? `نشط: ${formatNumber(stats.activePricingCompanies)}` : `Active: ${formatNumber(stats.activePricingCompanies)}`}
                layout={settings.cardLayout}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              <DriversNationalityChart 
                data={nationalityData} 
                isRTL={isRTL}
              />
              <CompaniesChart 
                data={companiesData} 
                isRTL={isRTL}
              />
              <DriversInsuranceChart 
                data={driversInsuranceData} 
                isRTL={isRTL}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => window.location.href = '/admin'}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-12"
                >
                  <Users size={18} />
                  {isRTL ? 'إدارة السائقين' : 'Manage Drivers'}
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/admin'}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-12"
                >
                  <Building2 size={18} />
                  {isRTL ? 'إدارة الشركات' : 'Manage Companies'}
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/admin-profile'}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-12"
                >
                  <Settings size={18} />
                  {isRTL ? 'إعدادات الحساب' : 'Account Settings'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <DashboardSettings
          settings={settings}
          onUpdate={handleSettingsUpdate}
          onClose={() => setShowSettings(false)}
          isRTL={isRTL}
        />
      )}
    </div>
  );
};

export default Dashboard;

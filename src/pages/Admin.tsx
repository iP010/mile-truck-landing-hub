import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Building2, Calendar, Phone, Edit, Trash2, Download, UserPlus, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { supabase } from '../integrations/supabase/client';
import { Tables } from '../integrations/supabase/types';
import Header from '../components/Header';
import { Button } from '../components/ui/button';
import EditDriverModal from '../components/EditDriverModal';
import EditCompanyModal from '../components/EditCompanyModal';
import ExportModal from '../components/ExportModal';
import AdminManagementModal from '../components/AdminManagementModal';

type Driver = Tables<'drivers'>;
type Company = Tables<'companies'>;
type AdminUser = Tables<'admins'>;

const Admin = () => {
  const { t, language } = useLanguage();
  const { admin } = useAdmin();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [activeTab, setActiveTab] = useState<'drivers' | 'companies' | 'admins'>('drivers');
  const [loading, setLoading] = useState(true);
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set());
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [selectedAdmins, setSelectedAdmins] = useState<Set<string>>(new Set());
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
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
      const [driversResult, companiesResult, adminsResult] = await Promise.all([
        supabase.from('drivers').select('*').order('created_at', { ascending: false }),
        supabase.from('companies').select('*').order('created_at', { ascending: false }),
        supabase.from('admins').select('*').order('created_at', { ascending: false })
      ]);

      if (driversResult.data) setDrivers(driversResult.data);
      if (companiesResult.data) setCompanies(companiesResult.data);
      if (adminsResult.data) setAdmins(adminsResult.data);
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

  const handleSelectAllDrivers = () => {
    if (selectedDrivers.size === drivers.length) {
      setSelectedDrivers(new Set());
    } else {
      setSelectedDrivers(new Set(drivers.map(d => d.id)));
    }
  };

  const handleSelectAllCompanies = () => {
    if (selectedCompanies.size === companies.length) {
      setSelectedCompanies(new Set());
    } else {
      setSelectedCompanies(new Set(companies.map(c => c.id)));
    }
  };

  const handleSelectAllAdmins = () => {
    if (selectedAdmins.size === admins.length) {
      setSelectedAdmins(new Set());
    } else {
      setSelectedAdmins(new Set(admins.map(a => a.id)));
    }
  };

  const handleDriverSelect = (driverId: string) => {
    const newSelected = new Set(selectedDrivers);
    if (newSelected.has(driverId)) {
      newSelected.delete(driverId);
    } else {
      newSelected.add(driverId);
    }
    setSelectedDrivers(newSelected);
  };

  const handleCompanySelect = (companyId: string) => {
    const newSelected = new Set(selectedCompanies);
    if (newSelected.has(companyId)) {
      newSelected.delete(companyId);
    } else {
      newSelected.add(companyId);
    }
    setSelectedCompanies(newSelected);
  };

  const handleAdminSelect = (adminId: string) => {
    const newSelected = new Set(selectedAdmins);
    if (newSelected.has(adminId)) {
      newSelected.delete(adminId);
    } else {
      newSelected.add(adminId);
    }
    setSelectedAdmins(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (activeTab === 'drivers' && selectedDrivers.size > 0) {
      const confirmed = window.confirm(
        isRTL 
          ? `هل أنت متأكد من حذف ${selectedDrivers.size} سائق؟`
          : `Are you sure you want to delete ${selectedDrivers.size} driver(s)?`
      );
      if (confirmed) {
        await supabase.from('drivers').delete().in('id', Array.from(selectedDrivers));
        setSelectedDrivers(new Set());
        loadData();
      }
    } else if (activeTab === 'companies' && selectedCompanies.size > 0) {
      const confirmed = window.confirm(
        isRTL 
          ? `هل أنت متأكد من حذف ${selectedCompanies.size} شركة؟`
          : `Are you sure you want to delete ${selectedCompanies.size} company(ies)?`
      );
      if (confirmed) {
        await supabase.from('companies').delete().in('id', Array.from(selectedCompanies));
        setSelectedCompanies(new Set());
        loadData();
      }
    }
  };

  const handleDeleteSelectedAdmins = async () => {
    if (selectedAdmins.size > 0) {
      const confirmed = window.confirm(
        isRTL 
          ? `هل أنت متأكد من حذف ${selectedAdmins.size} مدير؟`
          : `Are you sure you want to delete ${selectedAdmins.size} admin(s)?`
      );
      if (confirmed) {
        await supabase.from('admins').delete().in('id', Array.from(selectedAdmins));
        setSelectedAdmins(new Set());
        loadData();
      }
    }
  };

  const handleDriverUpdate = (updatedDriver: Driver) => {
    setDrivers(drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d));
    setEditingDriver(null);
  };

  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    setEditingCompany(null);
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
                {isRTL ? 'إدارة بيانات السائقين والشركات والمديرين' : 'Manage drivers, companies and admins data'}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {isRTL ? 'المديرين' : 'Admins'}
                    </h3>
                    <p className="text-3xl font-bold text-primary">{admins.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
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
                  <button
                    onClick={() => setActiveTab('admins')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'admins'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield size={18} />
                      {isRTL ? 'المديرين' : 'Admins'} ({admins.length})
                    </div>
                  </button>
                </nav>
              </div>

              {/* Action Bar */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    {activeTab === 'admins' ? (
                      <>
                        <Button
                          onClick={() => setShowAdminModal(true)}
                          size="sm"
                        >
                          <UserPlus size={16} className="mr-1" />
                          {isRTL ? 'إضافة مدير' : 'Add Admin'}
                        </Button>
                        <Button
                          onClick={handleSelectAllAdmins}
                          variant="outline"
                          size="sm"
                        >
                          {selectedAdmins.size === admins.length 
                            ? (isRTL ? 'إلغاء تحديد الكل' : 'Deselect All')
                            : (isRTL ? 'تحديد الكل' : 'Select All')
                          }
                        </Button>
                        {selectedAdmins.size > 0 && (
                          <Button
                            onClick={handleDeleteSelectedAdmins}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 size={16} className="mr-1" />
                            {isRTL ? `حذف المحدد (${selectedAdmins.size})` : `Delete Selected (${selectedAdmins.size})`}
                          </Button>
                        )}
                      </>
                    ) : (
                      // ... keep existing code for drivers and companies action buttons
                      <>
                        {activeTab === 'drivers' ? (
                          <>
                            <Button
                              onClick={handleSelectAllDrivers}
                              variant="outline"
                              size="sm"
                            >
                              {selectedDrivers.size === drivers.length 
                                ? (isRTL ? 'إلغاء تحديد الكل' : 'Deselect All')
                                : (isRTL ? 'تحديد الكل' : 'Select All')
                              }
                            </Button>
                            {selectedDrivers.size > 0 && (
                              <Button
                                onClick={handleDeleteSelected}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 size={16} className="mr-1" />
                                {isRTL ? `حذف المحدد (${selectedDrivers.size})` : `Delete Selected (${selectedDrivers.size})`}
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={handleSelectAllCompanies}
                              variant="outline"
                              size="sm"
                            >
                              {selectedCompanies.size === companies.length 
                                ? (isRTL ? 'إلغاء تحديد الكل' : 'Deselect All')
                                : (isRTL ? 'تحديد الكل' : 'Select All')
                              }
                            </Button>
                            {selectedCompanies.size > 0 && (
                              <Button
                                onClick={handleDeleteSelected}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 size={16} className="mr-1" />
                                {isRTL ? `حذف المحدد (${selectedCompanies.size})` : `Delete Selected (${selectedCompanies.size})`}
                              </Button>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                  
                  {activeTab !== 'admins' && (
                    <Button
                      onClick={() => setShowExportModal(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Download size={16} className="mr-1" />
                      {isRTL ? 'تصدير' : 'Export'}
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'admins' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                            <input
                              type="checkbox"
                              checked={selectedAdmins.size === admins.length && admins.length > 0}
                              onChange={handleSelectAllAdmins}
                              className="rounded"
                            />
                          </th>
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {isRTL ? 'اسم المستخدم' : 'Username'}
                          </th>
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {isRTL ? 'البريد الإلكتروني' : 'Email'}
                          </th>
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {isRTL ? 'الدور' : 'Role'}
                          </th>
                          <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                            {isRTL ? 'تاريخ الإنشاء' : 'Created Date'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {admins.map((adminUser) => (
                          <tr key={adminUser.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedAdmins.has(adminUser.id)}
                                onChange={() => handleAdminSelect(adminUser.id)}
                                className="rounded"
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {adminUser.username}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {adminUser.email}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                adminUser.role === 'super_admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {adminUser.role === 'super_admin' 
                                  ? (isRTL ? 'مدير أعلى' : 'Super Admin')
                                  : (isRTL ? 'مدير' : 'Admin')
                                }
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar size={14} />
                                {formatDate(adminUser.created_at)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {admins.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        {isRTL ? 'لا توجد بيانات مديرين' : 'No admins data available'}
                      </div>
                    )}
                  </div>
                ) : (
                  // ... keep existing code for drivers and companies tables
                  <>
                    {activeTab === 'drivers' ? (
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                                <input
                                  type="checkbox"
                                  checked={selectedDrivers.size === drivers.length && drivers.length > 0}
                                  onChange={handleSelectAllDrivers}
                                  className="rounded"
                                />
                              </th>
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
                              <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                                {isRTL ? 'الإجراءات' : 'Actions'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {drivers.map((driver) => (
                              <tr key={driver.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    checked={selectedDrivers.has(driver.id)}
                                    onChange={() => handleDriverSelect(driver.id)}
                                    className="rounded"
                                  />
                                </td>
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
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <Button
                                    onClick={() => setEditingDriver(driver)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Edit size={16} />
                                  </Button>
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
                              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                                <input
                                  type="checkbox"
                                  checked={selectedCompanies.size === companies.length && companies.length > 0}
                                  onChange={handleSelectAllCompanies}
                                  className="rounded"
                                />
                              </th>
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
                              <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                                {isRTL ? 'الإجراءات' : 'Actions'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {companies.map((company) => (
                              <tr key={company.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    checked={selectedCompanies.has(company.id)}
                                    onChange={() => handleCompanySelect(company.id)}
                                    className="rounded"
                                  />
                                </td>
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
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <Button
                                    onClick={() => setEditingCompany(company)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Edit size={16} />
                                  </Button>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editingDriver && (
        <EditDriverModal
          driver={editingDriver}
          onClose={() => setEditingDriver(null)}
          onUpdate={handleDriverUpdate}
        />
      )}

      {editingCompany && (
        <EditCompanyModal
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onUpdate={handleCompanyUpdate}
        />
      )}

      {showExportModal && (
        <ExportModal
          data={activeTab === 'drivers' ? drivers : companies}
          type={activeTab}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showAdminModal && (
        <AdminManagementModal
          onClose={() => setShowAdminModal(false)}
          onSuccess={() => {
            setShowAdminModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default Admin;

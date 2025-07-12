
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Power, PowerOff } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { getSupabaseClient } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tables } from '../integrations/supabase/types';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

type CompanyPricing = Tables<'companies_pricing'>;
type TripPricing = Tables<'trip_pricing'>;

interface CompanyWithTrips extends CompanyPricing {
  trip_pricing: TripPricing[];
}

const NewPricingManagement = () => {
  const { admin } = useAdmin();
  const { language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ur';
  const supabase = getSupabaseClient();

  const [companies, setCompanies] = useState<CompanyWithTrips[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newInsuranceType, setNewInsuranceType] = useState('');

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('companies_pricing')
        .select(`
          *,
          trip_pricing (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading companies:', error);
        toast.error(isRTL ? 'خطأ في تحميل بيانات الشركات' : 'Error loading companies data');
        return;
      }

      setCompanies(data || []);
    } catch (error) {
      console.error('Unexpected error loading companies:', error);
      toast.error(isRTL ? 'خطأ غير متوقع في تحميل البيانات' : 'Unexpected error loading data');
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async () => {
    if (!newCompanyName.trim()) {
      toast.error(isRTL ? 'يرجى إدخال اسم الشركة' : 'Please enter company name');
      return;
    }

    try {
      const { error } = await supabase
        .from('companies_pricing')
        .insert({
          company_name: newCompanyName.trim(),
          insurance_type: newInsuranceType.trim() || null,
          membership_number: `${Date.now()}`, // رقم عضوية مؤقت
          is_editing_enabled: false
        });

      if (error) {
        console.error('Error adding company:', error);
        toast.error(isRTL ? 'خطأ في إضافة الشركة' : 'Error adding company');
        return;
      }

      toast.success(isRTL ? 'تم إضافة الشركة بنجاح' : 'Company added successfully');
      setNewCompanyName('');
      setNewInsuranceType('');
      setShowAddForm(false);
      loadCompanies();
    } catch (error) {
      console.error('Unexpected error adding company:', error);
      toast.error(isRTL ? 'خطأ غير متوقع' : 'Unexpected error');
    }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذه الشركة؟' : 'Are you sure you want to delete this company?')) {
      return;
    }

    try {
      // حذف رحلات الشركة أولاً
      await supabase
        .from('trip_pricing')
        .delete()
        .eq('company_pricing_id', id);

      // ثم حذف الشركة
      const { error } = await supabase
        .from('companies_pricing')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting company:', error);
        toast.error(isRTL ? 'خطأ في حذف الشركة' : 'Error deleting company');
        return;
      }

      toast.success(isRTL ? 'تم حذف الشركة بنجاح' : 'Company deleted successfully');
      loadCompanies();
    } catch (error) {
      console.error('Unexpected error deleting company:', error);
      toast.error(isRTL ? 'خطأ غير متوقع' : 'Unexpected error');
    }
  };

  const toggleEditingStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('companies_pricing')
        .update({ is_editing_enabled: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating editing status:', error);
        toast.error(isRTL ? 'خطأ في تحديث حالة التحرير' : 'Error updating editing status');
        return;
      }

      toast.success(isRTL ? 'تم تحديث حالة التحرير بنجاح' : 'Editing status updated successfully');
      loadCompanies();
    } catch (error) {
      console.error('Unexpected error updating status:', error);
      toast.error(isRTL ? 'خطأ غير متوقع' : 'Unexpected error');
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.membership_number.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/admin-dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isRTL ? 'العودة للوحة التقارير' : 'Back to Dashboard'}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isRTL ? 'إدارة أسعار الشركات' : 'Companies Pricing Management'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة شركات الأسعار والرحلات' : 'Manage pricing companies and trips'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle>
                {isRTL ? 'شركات الأسعار' : 'Pricing Companies'}
                <Badge variant="secondary" className="ml-2">
                  {filteredCompanies.length}
                </Badge>
              </CardTitle>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {isRTL ? 'إضافة شركة' : 'Add Company'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Form */}
            {showAddForm && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder={isRTL ? 'اسم الشركة' : 'Company Name'}
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                  />
                  <Input
                    placeholder={isRTL ? 'نوع التأمين (اختياري)' : 'Insurance Type (Optional)'}
                    value={newInsuranceType}
                    onChange={(e) => setNewInsuranceType(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addCompany}>
                    <Save className="h-4 w-4 mr-2" />
                    {isRTL ? 'حفظ' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddForm(false);
                    setNewCompanyName('');
                    setNewInsuranceType('');
                  }}>
                    <X className="h-4 w-4 mr-2" />
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                </div>
              </div>
            )}

            <div className="mb-6">
              <Input
                placeholder={isRTL ? 'البحث باسم الشركة أو رقم العضوية...' : 'Search by company name or membership number...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 
                  (isRTL ? 'لا توجد نتائج للبحث' : 'No search results found') :
                  (isRTL ? 'لا توجد شركات مسجلة' : 'No companies registered')
                }
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCompanies.map((company) => (
                  <div key={company.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold text-lg">{company.company_name}</h3>
                          <Badge variant="secondary">
                            {isRTL ? 'رقم العضوية:' : 'Member #'} {company.membership_number}
                          </Badge>
                          <Badge variant={company.is_editing_enabled ? "default" : "secondary"}>
                            {company.is_editing_enabled ? 
                              (isRTL ? 'التحرير مفعل' : 'Editing Enabled') : 
                              (isRTL ? 'التحرير معطل' : 'Editing Disabled')
                            }
                          </Badge>
                        </div>
                        {company.insurance_type && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">{isRTL ? 'نوع التأمين:' : 'Insurance Type:'}</span> {company.insurance_type}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">{isRTL ? 'عدد الرحلات:' : 'Trip Count:'}</span> {company.trip_pricing?.length || 0}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={company.is_editing_enabled ? "destructive" : "default"}
                          onClick={() => toggleEditingStatus(company.id, company.is_editing_enabled)}
                        >
                          {company.is_editing_enabled ? (
                            <>
                              <PowerOff className="h-4 w-4 mr-2" />
                              {isRTL ? 'إيقاف التحرير' : 'Disable Editing'}
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-2" />
                              {isRTL ? 'تفعيل التحرير' : 'Enable Editing'}
                            </>
                          )}
                        </Button>
                        <Link to={`/company-pricing?company=${company.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            {isRTL ? 'إدارة الرحلات' : 'Manage Trips'}
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCompany(company.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewPricingManagement;

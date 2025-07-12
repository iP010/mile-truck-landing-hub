import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Download, Plus, Eye } from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/utils/translations";

interface CompanyPricing {
  id: string;
  company_name: string;
  membership_number: string;
  insurance_type: string | null;
  is_editing_enabled: boolean;
  created_at: string;
}

export default function PricingManagement() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [companies, setCompanies] = useState<CompanyPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    insurance_type: ""
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('companies_pricing')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async () => {
    if (!formData.company_name.trim()) {
      toast.error('اسم الشركة مطلوب');
      return;
    }

    console.log('Starting to add company...');
    console.log('Admin data in localStorage:', localStorage.getItem('admin'));
    
    try {
      const supabase = getSupabaseClient();
      console.log('Got Supabase client');
      
      // Get the next membership number
      console.log('Calling generate_membership_number...');
      const { data: membershipData, error: membershipError } = await supabase
        .rpc('generate_membership_number');

      console.log('Membership number result:', { membershipData, membershipError });
      
      if (membershipError) throw membershipError;

      console.log('Inserting company data...');
      const { error } = await supabase
        .from('companies_pricing')
        .insert({
          company_name: formData.company_name.trim(),
          membership_number: membershipData,
          insurance_type: formData.insurance_type || null
        });

      console.log('Insert result:', { error });

      if (error) throw error;

      toast.success('تم إضافة الشركة بنجاح');
      setFormData({ company_name: "", insurance_type: "" });
      setShowAddForm(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('خطأ في إضافة الشركة');
    }
  };

  const toggleEditingEnabled = async (id: string, currentState: boolean) => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('companies_pricing')
        .update({ is_editing_enabled: !currentState })
        .eq('id', id);

      if (error) throw error;

      toast.success(`تم ${!currentState ? 'تفعيل' : 'إيقاف'} التحرير`);
      fetchCompanies();
    } catch (error) {
      console.error('Error updating editing state:', error);
      toast.error('خطأ في تحديث حالة التحرير');
    }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشركة؟')) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('companies_pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('تم حذف الشركة بنجاح');
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('خطأ في حذف الشركة');
    }
  };

  const exportData = async (format: 'csv' | 'excel' | 'sql') => {
    try {
      const supabase = getSupabaseClient();
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies_pricing')
        .select('*');

      const { data: pricingData, error: pricingError } = await supabase
        .from('trip_pricing')
        .select(`
          *,
          companies_pricing(company_name, membership_number)
        `);

      if (companiesError || pricingError) throw companiesError || pricingError;

      // Format data for export
      const exportData = pricingData?.map(item => ({
        Location: `${item.from_city} - ${item.to_city}`,
        'Transporter name': item.companies_pricing?.company_name || '',
        'Type of vehicle': item.vehicle_type,
        Price: item.price,
        'Membership Number': item.companies_pricing?.membership_number || ''
      })) || [];

      if (format === 'csv') {
        const csv = [
          'Location,Transporter name,Type of vehicle,Price,Membership Number',
          ...exportData.map(row => 
            `"${row.Location}","${row['Transporter name']}","${row['Type of vehicle']}","${row.Price}","${row['Membership Number']}"`
          )
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pricing_data.csv';
        a.click();
      }

      toast.success(`تم تصدير البيانات بصيغة ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('خطأ في تصدير البيانات');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة أسعار الرحلات</h1>
        <div className="flex gap-2">
          <Button onClick={() => exportData('csv')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button onClick={() => exportData('excel')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button onClick={() => exportData('sql')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            SQL
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            إضافة شركة
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة شركة جديدة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company_name">اسم الشركة</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="أدخل اسم الشركة"
              />
            </div>
            <div>
              <Label htmlFor="insurance_type">نوع التأمين</Label>
              <Select
                value={formData.insurance_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, insurance_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التأمين" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="شامل">شامل</SelectItem>
                  <SelectItem value="ضد الغير">ضد الغير</SelectItem>
                  <SelectItem value="بدون تأمين">بدون تأمين</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCompany}>إضافة</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>إلغاء</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {companies.map((company) => (
          <Card key={company.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{company.company_name}</h3>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">رقم العضوية: {company.membership_number}</Badge>
                    {company.insurance_type && (
                      <Badge variant="outline">{company.insurance_type}</Badge>
                    )}
                    <Badge variant={company.is_editing_enabled ? "default" : "destructive"}>
                      {company.is_editing_enabled ? "التحرير مفعل" : "التحرير معطل"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={company.is_editing_enabled}
                    onCheckedChange={() => toggleEditingEnabled(company.id, company.is_editing_enabled)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/pricing/${company.membership_number}`, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/pricing/${company.membership_number}/edit`, '_blank')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCompany(company.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">لا توجد شركات مضافة حتى الآن</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
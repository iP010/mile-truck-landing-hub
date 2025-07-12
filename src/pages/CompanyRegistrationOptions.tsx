import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { getSupabaseClient } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

interface OptionItem {
  id: string;
  name: string;
  is_active: boolean;
  display_order: number | null;
  created_at: string;
}

const CompanyRegistrationOptions = () => {
  const { admin } = useAdmin();
  const supabase = getSupabaseClient();
  
  const [activeTab, setActiveTab] = useState<'insurance_types' | 'cities'>('insurance_types');
  const [items, setItems] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<OptionItem | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  const tabTitles = {
    insurance_types: 'أنواع التأمين',
    cities: 'المدن'
  };

  const tableNames: Record<string, 'insurance_types' | 'cities'> = {
    insurance_types: 'insurance_types',
    cities: 'cities'
  };

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const tableName = tableNames[activeTab];
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItemName.trim()) {
      toast.error('يرجى إدخال الاسم');
      return;
    }

    try {
      const tableName = tableNames[activeTab];
      const insertData: any = {
        name: newItemName.trim(),
        is_active: true,
        display_order: items.length + 1
      };

      // For insurance_types table, add the type field
      if (activeTab === 'insurance_types') {
        insertData.type = 'company'; // Default type for company insurance
      }

      const { error } = await supabase
        .from(tableName)
        .insert(insertData);

      if (error) throw error;

      toast.success('تم إضافة العنصر بنجاح');
      setNewItemName('');
      setShowAddForm(false);
      loadItems();
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('خطأ في إضافة العنصر');
    }
  };

  const updateItem = async (item: OptionItem) => {
    try {
      const tableName = tableNames[activeTab];
      const { error } = await supabase
        .from(tableName)
        .update({
          name: item.name,
          is_active: item.is_active
        })
        .eq('id', item.id);

      if (error) throw error;

      toast.success('تم تحديث العنصر بنجاح');
      setEditingItem(null);
      loadItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('خطأ في تحديث العنصر');
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;

    try {
      const tableName = tableNames[activeTab];
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('تم حذف العنصر بنجاح');
      loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('خطأ في حذف العنصر');
    }
  };

  const toggleActiveStatus = async (item: OptionItem) => {
    try {
      const tableName = tableNames[activeTab];
      const { error } = await supabase
        .from(tableName)
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;

      toast.success('تم تحديث الحالة بنجاح');
      loadItems();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('خطأ في تحديث الحالة');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/admin-dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للوحة التقارير
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">إدارة خيارات تسجيل الشركات</h1>
          <p className="text-muted-foreground">إدارة أنواع التأمين والمدن</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
          {Object.entries(tabTitles).map(([key, title]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {title}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{tabTitles[activeTab]}</CardTitle>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة جديد
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Form */}
            {showAddForm && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="اسم العنصر الجديد"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  />
                  <Button onClick={addItem}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddForm(false);
                    setNewItemName('');
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Items List */}
            {loading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">لا توجد عناصر</div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    {editingItem?.id === item.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        />
                        <Button size="sm" onClick={() => updateItem(editingItem)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.name}</span>
                          <Badge variant={item.is_active ? "default" : "secondary"}>
                            {item.is_active ? 'مفعل' : 'معطل'}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleActiveStatus(item)}
                          >
                            {item.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
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

export default CompanyRegistrationOptions;
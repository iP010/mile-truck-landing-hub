
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { getSupabaseClient } from '../integrations/supabase/client';
import Header from '../components/Header';
import { Button } from '../components/ui/button';

interface OptionItem {
  id: string;
  name: string;
  is_active: boolean;
  display_order: number | null;
  created_at: string;
}

const CitiesVehiclesManagement = () => {
  const { language } = useLanguage();
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const supabase = getSupabaseClient();
  
  const [activeTab, setActiveTab] = useState<'nationalities' | 'truck_brands' | 'truck_types' | 'insurance_types' | 'cities' | 'vehicle_types'>('nationalities');
  const [items, setItems] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<OptionItem | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const isRTL = language === 'ar' || language === 'ur';

  // Redirect to login if not authenticated
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  const tabTitles = {
    nationalities: isRTL ? 'الجنسيات' : 'Nationalities',
    truck_brands: isRTL ? 'ماركات الشاحنات' : 'Truck Brands',
    truck_types: isRTL ? 'أنواع الشاحنات' : 'Truck Types',
    insurance_types: isRTL ? 'أنواع التأمين' : 'Insurance Types',
    cities: isRTL ? 'المدن' : 'Cities',
    vehicle_types: isRTL ? 'أنواع المركبات' : 'Vehicle Types'
  };

  const tableNames: Record<string, string> = {
    nationalities: 'driver_nationalities',
    truck_brands: 'truck_brands',
    truck_types: 'truck_types',
    insurance_types: 'insurance_types',
    cities: 'cities',
    vehicle_types: 'vehicle_types'
  };

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const tableName = tableNames[activeTab];
      console.log('Loading items from table:', tableName);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('id, name, is_active, display_order, created_at')
        .order('display_order', { ascending: true, nullsFirst: true });

      if (error) {
        console.error('Error loading items:', error);
        alert(isRTL ? 'خطأ في تحميل البيانات' : 'Error loading data');
        setItems([]);
        return;
      }

      console.log('Loaded items:', data);
      setItems(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert(isRTL ? 'خطأ غير متوقع' : 'Unexpected error');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newItemName.trim()) return;

    try {
      const tableName = tableNames[activeTab];
      const maxOrder = Math.max(...items.map(item => item.display_order || 0), 0);
      
      const insertData: any = {
        name: newItemName.trim(),
        display_order: maxOrder + 1,
        is_active: true
      };

      // Add type field for insurance_types
      if (activeTab === 'insurance_types') {
        insertData.type = 'driver'; // Default to driver type
      }

      const { error } = await supabase
        .from(tableName)
        .insert([insertData]);

      if (error) {
        console.error('Error adding item:', error);
        alert(isRTL ? 'خطأ في الإضافة' : 'Error adding item');
        return;
      }

      setNewItemName('');
      setShowAddForm(false);
      loadItems();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleEdit = async (item: OptionItem) => {
    if (!editingItem) return;

    try {
      const tableName = tableNames[activeTab];
      const { error } = await supabase
        .from(tableName)
        .update({ name: editingItem.name })
        .eq('id', editingItem.id);

      if (error) {
        console.error('Error updating item:', error);
        alert(isRTL ? 'خطأ في التحديث' : 'Error updating item');
        return;
      }

      setEditingItem(null);
      loadItems();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    const confirmed = window.confirm(
      isRTL ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?'
    );

    if (!confirmed) return;

    try {
      const tableName = tableNames[activeTab];
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error deleting item:', error);
        alert(isRTL ? 'خطأ في الحذف' : 'Error deleting item');
        return;
      }

      loadItems();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const toggleActive = async (item: OptionItem) => {
    try {
      const tableName = tableNames[activeTab];
      const { error } = await supabase
        .from(tableName)
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) {
        console.error('Error toggling active status:', error);
        alert(isRTL ? 'خطأ في التحديث' : 'Error updating status');
        return;
      }

      loadItems();
    } catch (error) {
      console.error('Unexpected error:', error);
    }
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <Button
                  onClick={() => navigate('/admin')}
                  variant="outline"
                  size="sm"
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {isRTL ? 'العودة للوحة التحكم' : 'Back to Admin'}
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isRTL ? 'إدارة خيارات التسجيل' : 'Registration Options Management'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {isRTL ? 'إدارة الجنسيات وأنواع الشاحنات والتأمين' : 'Manage nationalities, truck types, and insurance options'}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex flex-wrap">
                  {Object.entries(tabTitles).map(([key, title]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === key
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {title}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {tabTitles[activeTab]}
                  </h2>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    variant="default"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isRTL ? 'إضافة جديد' : 'Add New'}
                  </Button>
                </div>

                {/* Add Form */}
                {showAddForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder={isRTL ? 'اسم العنصر الجديد' : 'New item name'}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button onClick={handleAdd} size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        {isRTL ? 'حفظ' : 'Save'}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowAddForm(false);
                          setNewItemName('');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                          {isRTL ? 'الاسم' : 'Name'}
                        </th>
                        <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                          {isRTL ? 'الحالة' : 'Status'}
                        </th>
                        <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                          {isRTL ? 'الترتيب' : 'Order'}
                        </th>
                        <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                          {isRTL ? 'الإجراءات' : 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            {editingItem?.id === item.id ? (
                              <input
                                type="text"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-900">
                                {item.name}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleActive(item)}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {item.is_active ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.display_order || '-'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {editingItem?.id === item.id ? (
                                <>
                                  <Button onClick={() => handleEdit(item)} size="sm" variant="outline">
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    onClick={() => setEditingItem(null)}
                                    size="sm"
                                    variant="outline"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => setEditingItem(item)}
                                    size="sm"
                                    variant="outline"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDelete(item.id)}
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {isRTL ? 'لا توجد عناصر' : 'No items found'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitiesVehiclesManagement;

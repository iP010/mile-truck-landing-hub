
import { supabase } from '../integrations/supabase/client';

// Define the table names as a union type
type TableName = 'drivers' | 'companies' | 'admins';

// تنفيذ الاستعلامات مع Supabase
export const executeQuery = async (
  table: TableName, 
  operation: 'select' | 'insert' | 'update' | 'delete', 
  data?: any, 
  filters?: any
) => {
  try {
    switch (operation) {
      case 'select':
        const { data: selectData, error: selectError } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false });
        
        if (selectError) throw selectError;
        return selectData;

      case 'insert':
        const { data: insertData, error: insertError } = await supabase
          .from(table)
          .insert(data)
          .select();
        
        if (insertError) throw insertError;
        return insertData;

      case 'update':
        const { data: updateData, error: updateError } = await supabase
          .from(table)
          .update(data)
          .eq('id', filters.id)
          .select();
        
        if (updateError) throw updateError;
        return updateData;

      case 'delete':
        const { data: deleteData, error: deleteError } = await supabase
          .from(table)
          .delete()
          .in('id', filters.ids);
        
        if (deleteError) throw deleteError;
        return deleteData;

      default:
        throw new Error('Unsupported operation');
    }
  } catch (error) {
    console.error('Database operation error:', error);
    throw error;
  }
};

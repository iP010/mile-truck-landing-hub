
// API Configuration for MySQL connection
const API_BASE_URL = 'https://yourdomain.com/api'; // قم بتغيير هذا إلى رابط استضافتك

// تنفيذ الاستعلامات مع MySQL API
export const executeQuery = async (
  table: 'drivers' | 'companies' | 'admins', 
  operation: 'select' | 'insert' | 'update' | 'delete', 
  data?: any, 
  filters?: any
) => {
  try {
    let url = `${API_BASE_URL}/${table}.php`;
    let options: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    switch (operation) {
      case 'select':
        options.method = 'GET';
        break;

      case 'insert':
        options.method = 'POST';
        options.body = JSON.stringify(data);
        break;

      case 'update':
        options.method = 'PUT';
        options.body = JSON.stringify({ ...data, id: filters.id });
        break;

      case 'delete':
        options.method = 'DELETE';
        options.body = JSON.stringify({ ids: filters.ids });
        break;

      default:
        throw new Error('Unsupported operation');
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'API request failed');
    }

    return result;
  } catch (error) {
    console.error('Database operation error:', error);
    throw error;
  }
};

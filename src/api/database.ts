
import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database';

// إنشاء اتصال بقاعدة البيانات
let connection: mysql.Connection | null = null;

export const connectDB = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection(dbConfig);
      console.log('Connected to MySQL database');
    }
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// تنفيذ الاستعلامات
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const conn = await connectDB();
    const [results] = await conn.execute(query, params);
    return results;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

// إغلاق الاتصال
export const closeConnection = async () => {
  if (connection) {
    await connection.end();
    connection = null;
    console.log('Database connection closed');
  }
};

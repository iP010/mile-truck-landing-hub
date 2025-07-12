
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const Admin = () => {
  const { admin } = useAdmin();

  // Redirect to login if not authenticated
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  // Redirect to the new admin dashboard
  return <Navigate to="/admin-dashboard" replace />;
};

export default Admin;

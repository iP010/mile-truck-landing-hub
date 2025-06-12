
type AdminRole = 'super_admin' | 'admin' | 'supervisor';

export const AdminPermissions = {
  // القائد - جميع الصلاحيات
  canManageAdmins: (role: AdminRole) => role === 'super_admin',
  canDeleteAdmins: (role: AdminRole) => role === 'super_admin',
  canEditAdmins: (role: AdminRole) => role === 'super_admin',
  canViewAdmins: (role: AdminRole) => role === 'super_admin' || role === 'admin',
  canAddAdmins: (role: AdminRole) => role === 'super_admin',
  
  // إدارة السائقين والشركات
  canManageDrivers: (role: AdminRole) => role === 'super_admin' || role === 'admin' || role === 'supervisor',
  canDeleteDrivers: (role: AdminRole) => role === 'super_admin' || role === 'admin',
  canEditDrivers: (role: AdminRole) => role === 'super_admin' || role === 'admin' || role === 'supervisor',
  canViewDrivers: (role: AdminRole) => true, // جميع الأدوار يمكنها عرض السائقين
  
  canManageCompanies: (role: AdminRole) => role === 'super_admin' || role === 'admin' || role === 'supervisor',
  canDeleteCompanies: (role: AdminRole) => role === 'super_admin' || role === 'admin',
  canEditCompanies: (role: AdminRole) => role === 'super_admin' || role === 'admin' || role === 'supervisor',
  canViewCompanies: (role: AdminRole) => true, // جميع الأدوار يمكنها عرض الشركات
  
  // تصدير البيانات
  canExportData: (role: AdminRole) => role === 'super_admin' || role === 'admin' || role === 'supervisor',
  
  // التحقق من إمكانية تحرير مدير معين
  canEditSpecificAdmin: (currentUserRole: AdminRole, targetAdminRole: AdminRole) => {
    if (currentUserRole === 'super_admin') return true;
    if (currentUserRole === 'admin') {
      // المدير يستطيع تحرير المشرفين فقط
      return targetAdminRole === 'supervisor';
    }
    return false; // المشرف لا يستطيع تحرير أي مدير
  },
  
  // التحقق من إمكانية حذف مدير معين
  canDeleteSpecificAdmin: (currentUserRole: AdminRole, targetAdminRole: AdminRole) => {
    if (currentUserRole === 'super_admin') return true;
    return false; // فقط القائد يستطيع حذف المديرين
  }
};

export const getRoleDisplayName = (role: AdminRole, isRTL: boolean) => {
  switch (role) {
    case 'super_admin':
      return isRTL ? 'القائد' : 'Super Admin';
    case 'admin':
      return isRTL ? 'مدير' : 'Admin';
    case 'supervisor':
      return isRTL ? 'مشرف' : 'Supervisor';
    default:
      return role;
  }
};

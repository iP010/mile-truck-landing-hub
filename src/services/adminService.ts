
import { supabase } from '../integrations/supabase/client';
import { hashPassword, verifyPassword } from '../utils/passwordUtils';
import { createAdminSession, cleanupAllSessions } from '../utils/sessionUtils';
import { Admin, LoginResult, PasswordUpdateResult } from '../types/admin';

export const getAdminById = async (adminId: string): Promise<Admin | null> => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, username, email, role')
      .eq('id', adminId)
      .single();

    if (error || !data) {
      console.error('Admin fetch error:', error);
      return null;
    }

    return data as Admin;
  } catch (error) {
    console.error('Admin fetch error:', error);
    return null;
  }
};

export const authenticateAdmin = async (username: string, password: string): Promise<LoginResult> => {
  try {
    console.log('Attempting login for username:', username);
    
    // استعلام بسيط للحصول على بيانات المدير
    const { data: adminData, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username.trim())
      .maybeSingle();

    console.log('Query result:', { adminData, fetchError });

    if (fetchError) {
      console.error('Database query error:', fetchError);
      return { success: false, error: 'خطأ في الاتصال بقاعدة البيانات' };
    }

    if (!adminData) {
      console.log('No admin found with username:', username);
      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }

    console.log('Admin found successfully:', { 
      id: adminData.id, 
      username: adminData.username,
      passwordType: adminData.password_hash === 'Zz115599' ? 'plain' : 'hashed'
    });

    // التحقق من كلمة المرور
    let isPasswordValid = false;
    
    if (adminData.password_hash === 'Zz115599') {
      // كلمة مرور افتراضية غير مشفرة
      console.log('Checking against default plain password');
      if (password === 'Zz115599') {
        isPasswordValid = true;
        console.log('Plain password matched, will update to hashed');
        
        // تشفير كلمة المرور وتحديثها
        try {
          const hashedPassword = await hashPassword(password);
          const { error: updateError } = await supabase
            .from('admins')
            .update({ password_hash: hashedPassword, updated_at: new Date().toISOString() })
            .eq('id', adminData.id);

          if (updateError) {
            console.error('Failed to update password hash:', updateError);
          } else {
            console.log('Password successfully hashed and updated');
          }
        } catch (hashError) {
          console.error('Password hashing error:', hashError);
        }
      }
    } else {
      // كلمة مرور مشفرة
      console.log('Verifying hashed password');
      try {
        isPasswordValid = await verifyPassword(password, adminData.password_hash);
        console.log('Password verification result:', isPasswordValid);
      } catch (verifyError) {
        console.error('Password verification error:', verifyError);
        return { success: false, error: 'فشل في التحقق من كلمة المرور' };
      }
    }

    if (!isPasswordValid) {
      console.log('Password verification failed');
      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }

    console.log('Password verified successfully, creating session');

    // تنظيف الجلسات المنتهية الصلاحية أولاً
    try {
      await cleanupAllSessions();
      console.log('Expired sessions cleaned up successfully');
    } catch (cleanupError) {
      console.warn('Failed to cleanup expired sessions:', cleanupError);
      // نستمر حتى لو فشل التنظيف
    }

    // إنشاء جلسة جديدة
    console.log('Attempting to create new session for admin ID:', adminData.id);
    const sessionId = await createAdminSession(adminData.id);
    
    if (!sessionId) {
      console.error('Failed to create session - no session ID returned');
      return { success: false, error: 'فشل في إنشاء الجلسة' };
    }

    // حفظ الجلسة
    localStorage.setItem('admin_session_id', sessionId);
    
    console.log('Login successful, session created and saved:', sessionId);
    return { success: true };
  } catch (error) {
    console.error('Login exception:', error);
    return { success: false, error: 'حدث خطأ غير متوقع' };
  }
};

export const updateAdminPassword = async (adminId: string, newPassword: string): Promise<PasswordUpdateResult> => {
  try {
    const hashedPassword = await hashPassword(newPassword);
    
    const { error } = await supabase
      .from('admins')
      .update({ 
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', adminId);

    if (error) {
      console.error('Password update error:', error);
      return { success: false, error: 'فشل في تحديث كلمة المرور' };
    }

    // تنظيف جميع الجلسات لهذا المدير (إجبار إعادة تسجيل الدخول)
    await cleanupAllSessions(adminId);
    
    return { success: true };
  } catch (error) {
    console.error('Password update error:', error);
    return { success: false, error: 'فشل في تحديث كلمة المرور' };
  }
};


import { supabase } from '../integrations/supabase/client';

export const SESSION_DURATION_MINUTES = 10; // 10 دقائق كما هو مطلوب

export const createAdminSession = async (adminId: string): Promise<string | null> => {
  try {
    console.log('Creating session for admin:', adminId);
    
    // إنشاء جلسة جديدة مع انتهاء صلاحية لمدة 10 دقائق
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + SESSION_DURATION_MINUTES);
    
    const sessionData = {
      admin_id: adminId,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    };
    
    console.log('Session data to insert:', sessionData);
    console.log('Current time:', new Date().toISOString());
    console.log('Expires at:', expiresAt.toISOString());
    
    const { data, error } = await supabase
      .from('admin_sessions')
      .insert(sessionData)
      .select('id')
      .single();
    
    if (error) {
      console.error('Session creation error details:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null;
    }
    
    if (!data?.id) {
      console.error('No session ID returned from insert');
      return null;
    }
    
    console.log('Session created successfully with ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Session creation exception:', error);
    return null;
  }
};

export const validateAdminSession = async (sessionId: string): Promise<{
  isValid: boolean;
  adminId?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('admin_id, expires_at')
      .eq('id', sessionId)
      .single();
    
    if (error || !data) {
      console.log('Session not found or error:', error);
      return { isValid: false };
    }
    
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    if (now > expiresAt) {
      console.log('Session expired, cleaning up');
      // الجلسة منتهية الصلاحية، تنظيفها
      await supabase.from('admin_sessions').delete().eq('id', sessionId);
      return { isValid: false };
    }
    
    console.log('Session is valid');
    return {
      isValid: true,
      adminId: data.admin_id
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return { isValid: false };
  }
};

export const cleanupAllSessions = async (adminId?: string): Promise<void> => {
  try {
    if (adminId) {
      // تنظيف الجلسات لمدير محدد
      await supabase.from('admin_sessions').delete().eq('admin_id', adminId);
      console.log('Cleaned up sessions for admin:', adminId);
    } else {
      // تنظيف جميع الجلسات المنتهية الصلاحية
      await supabase.from('admin_sessions').delete().lt('expires_at', new Date().toISOString());
      console.log('Cleaned up expired sessions');
    }
  } catch (error) {
    console.error('Session cleanup error:', error);
  }
};

export const extendSession = async (sessionId: string): Promise<boolean> => {
  try {
    const validation = await validateAdminSession(sessionId);
    if (!validation.isValid) {
      return false;
    }
    
    const newExpiresAt = new Date();
    newExpiresAt.setMinutes(newExpiresAt.getMinutes() + SESSION_DURATION_MINUTES);
    
    const { error } = await supabase
      .from('admin_sessions')
      .update({ expires_at: newExpiresAt.toISOString() })
      .eq('id', sessionId);
    
    if (!error) {
      console.log('Session extended successfully');
    }
    
    return !error;
  } catch (error) {
    console.error('Session extension error:', error);
    return false;
  }
};

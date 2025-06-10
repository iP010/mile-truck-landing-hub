
import { supabase } from '../integrations/supabase/client';

export const SESSION_DURATION_MINUTES = 10; // 10 minutes as requested

export const createAdminSession = async (adminId: string): Promise<string | null> => {
  try {
    // Clean up expired sessions first
    await supabase.from('admin_sessions').delete().lt('expires_at', new Date().toISOString());
    
    // Create new session with 10-minute expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + SESSION_DURATION_MINUTES);
    
    const { data, error } = await supabase
      .from('admin_sessions')
      .insert({
        admin_id: adminId,
        expires_at: expiresAt.toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Session creation error:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Session creation error:', error);
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
      return { isValid: false };
    }
    
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    if (now > expiresAt) {
      // Session expired, clean it up
      await supabase.from('admin_sessions').delete().eq('id', sessionId);
      return { isValid: false };
    }
    
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
      // Clean up sessions for specific admin
      await supabase.from('admin_sessions').delete().eq('admin_id', adminId);
    } else {
      // Clean up all expired sessions
      await supabase.from('admin_sessions').delete().lt('expires_at', new Date().toISOString());
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
    
    return !error;
  } catch (error) {
    console.error('Session extension error:', error);
    return false;
  }
};

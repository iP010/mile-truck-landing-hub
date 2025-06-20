
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// نفس الثوابت القديمة
const SUPABASE_URL = "https://ipplhxdvvpcsksqznjsb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwcGxoeGR2dnBjc2tzcXpuanNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwODM2NTEsImV4cCI6MjA2MzY1OTY1MX0.ReJ1niDZJ7I5syGOV4Red_rFn5LYMqmLtOR3gV9Fwzg";

// دالة fetch مخصصة لإضافة ترويسة session-id و apikey على الطلبات للسيرفر
const customFetch = async (input: RequestInfo, init?: RequestInit) => {
  const sessionId = localStorage.getItem('admin_session_id');
  let newInit: RequestInit = { ...init };
  newInit.headers = {
    ...(init?.headers || {}),
    // ترويسة supabase key مطلوبة دائماً (حتى بدون تسجيل دخول)
    apikey: SUPABASE_PUBLISHABLE_KEY,
    // Supabase يلتقط هذه الترويسة ويستخدمها في دوال security definer
    ...(sessionId ? { 'x-admin-session-id': sessionId } : {}),
  };
  return fetch(input, newInit);
};

// عند إنشاء Client نمرر custom fetch بدل fetch الافتراضي
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    global: {
      fetch: customFetch,
    },
  }
);

// شرح: لا حاجة لأي تغيير في بقية المشروع - الآن جميع العمليات تلقائيًا تعتمد session id و apikey في headers!

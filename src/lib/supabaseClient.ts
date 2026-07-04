import { createClient } from '@supabase/supabase-js'

export const ASG_SUPABASE_CONFIG = {
  url: 'https://prktqmhssywmwdmtekpj.supabase.co',
  anonKey: 'sb_publishable_HJTIPzdh-f-6WdxLcmowIQ_mgpkF0RW',
  storageBucket: 'asg-content',
  adminEmails: ['arjungangwariitpkd@gmail.com']
}

export const supabase = createClient(ASG_SUPABASE_CONFIG.url, ASG_SUPABASE_CONFIG.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
})

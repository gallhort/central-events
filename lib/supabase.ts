import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Browser client (public anon key)
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Server client (service role key - use only in server-side code)
export function createServerClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Upload a file to Supabase Storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Buffer,
  contentType?: string
) {
  const client = createServerClient();
  const { data, error } = await client.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true,
  });

  if (error) throw error;

  const { data: urlData } = client.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

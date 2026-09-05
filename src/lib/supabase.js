import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log to verify in the browser console:
console.log("LOADED SUPABASE URL:", supabaseUrl);

if (!supabaseUrl || supabaseUrl.includes("your_project_id")) {
  console.error(
    "⚠️ VITE_SUPABASE_URL is missing or using placeholder 'your_project_id'. Please check your .env file in the project root."
  );
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || "",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const CLOUD_PROJECT_REF = "ymnxfchnhkbtxffenqzx";
const CLOUD_URL = `https://${CLOUD_PROJECT_REF}.supabase.co`;
const CLOUD_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbnhmY2huaGtidHhmZmVucXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDc1NjAsImV4cCI6MjA5NDQyMzU2MH0.chLRC-ZcTkPOipuXWbwfMuzF9gxfomiLBFfZ2MkBjC0";

const configuredUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const configuredKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const isCurrentCloudUrl = configuredUrl?.includes(CLOUD_PROJECT_REF);

export const authClient = createClient<Database>(
  isCurrentCloudUrl ? configuredUrl! : CLOUD_URL,
  isCurrentCloudUrl && configuredKey ? configuredKey : CLOUD_PUBLISHABLE_KEY,
  {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
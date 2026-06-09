import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Award coins for completed pomodoro work time. Server-side validated.
// Cap per call to avoid abuse: max 120 coins per single call (=2h of work).
export const awardCoins = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const data = input as { amount?: number };
    const amount = Math.max(0, Math.min(120, Math.floor(Number(data?.amount ?? 0))));
    return { amount };
  })
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    if (data.amount <= 0) return { coins: 0 };

    // Read current then update — RLS bypass via admin to ensure write.
    const { data: profile, error: readErr } = await supabaseAdmin
      .from("profiles")
      .select("coins")
      .eq("id", userId)
      .maybeSingle();
    if (readErr) throw new Error(readErr.message);

    const current = profile?.coins ?? 0;
    const next = current + data.amount;

    if (!profile) {
      const { error: insErr } = await supabaseAdmin
        .from("profiles")
        .insert({ id: userId, coins: next });
      if (insErr) throw new Error(insErr.message);
    } else {
      const { error: updErr } = await supabaseAdmin
        .from("profiles")
        .update({ coins: next })
        .eq("id", userId);
      if (updErr) throw new Error(updErr.message);
    }
    return { coins: next };
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase } = context as { userId: string; supabase: any };
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, coins")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { profile: data ?? { id: userId, display_name: null, coins: 0 } };
  });

export const getLeaderboard = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, display_name, coins")
    .order("coins", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return { rows: data ?? [] };
});

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const data = input as { display_name?: string };
    return { display_name: data?.display_name?.trim().slice(0, 30) || null };
  })
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    if (!data.display_name) throw new Error("Display name cannot be empty");

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ display_name: data.display_name })
      .eq("id", userId);
      
    if (error) throw new Error(error.message);
    return { success: true, display_name: data.display_name };
  });

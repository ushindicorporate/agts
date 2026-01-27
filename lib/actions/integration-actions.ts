import { createClient } from "../supabase/server";

// lib/actions/integration-actions.ts
export async function getIntegrationStatus(provider: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data } = await supabase
    .from('user_integrations')
    .select('id, updated_at')
    .eq('user_id', user?.id)
    .eq('provider', provider)
    .single();

  return !!data;
}
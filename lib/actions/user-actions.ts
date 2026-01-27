'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Définition du type pour l'équipe AGTS
export type AGTSUser = {
  id: string;
  full_name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'agent' | 'finance';
  avatar_url: string | null;
  odoo_user_id: number | null;
  phone_number: string | null;
  created_at: string;
};

/**
 * Récupère tous les membres de l'équipe AGTS
 * Cette fonction est sécurisée par les RLS de Supabase
 */
export async function getTeamMembers(): Promise<AGTSUser[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("App Metadata (Role):", user?.app_metadata);
  console.log("User Role:", user?.app_metadata?.role);

  // On récupère les données de la table profiles
  // L'ordre alphabétique est préférable pour une liste d'utilisateurs
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true });

    console.log(data);
    
  if (error) {
    console.error("Erreur récupération équipe:", error.message);
    // En mode entreprise, on retourne un tableau vide plutôt que de faire crasher l'UI
    return [];
  }

  return data as AGTSUser[];
}

export async function getMyProfile(): Promise<AGTSUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data as AGTSUser;
}

export async function updateMyProfile(formData: { full_name: string; phone_number: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false };

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: formData.full_name,
      phone_number: formData.phone_number,
    })
    .eq('id', user.id);

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/dashboard/settings');
  return { success: true };
}
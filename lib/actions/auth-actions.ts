'use server'
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const supabase = await createClient();
  
  // Déconnexion de Supabase
  await supabase.auth.signOut();
  
  // Redirection vers la page de login
  return redirect("/login");
}
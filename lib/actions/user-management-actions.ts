// lib/actions/user-management-actions.ts
'use server'

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function inviteNewUser(data: { 
  email: string, 
  full_name: string, 
  role: string, 
  password?: string 
}) {
  const supabaseAdmin = createAdminClient();

  try {
    // Si un mot de passe est fourni, on utilise createUser (plus direct)
    // Sinon on utilise inviteUserByEmail (envoi de lien)
    if (data.password && data.password.length > 0) {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { full_name: data.full_name },
        app_metadata: { role: data.role }
      });
      if (authError) throw authError;
    } else {
      const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
        data: { full_name: data.full_name },
        // @ts-ignore
        app_metadata: { role: data.role }
      });
      if (inviteError) throw inviteError;
    }

    revalidatePath('/dashboard/settings/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Action pour renvoyer le mail
export async function resendInvitation(email: string) {
  const supabaseAdmin = createAdminClient();
  try {
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetUserPassword(userId: string, newPassword: string) {
  const supabaseAdmin = createAdminClient();

  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Erreur reset password:", error);
    return { success: false, error: error.message };
  }
}
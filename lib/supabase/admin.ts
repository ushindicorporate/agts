// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

// ATTENTION : Utilisez la SERVICE_ROLE_KEY (à ajouter dans votre .env)
// Elle permet de contourner toutes les politiques RLS pour l'administration
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Key secrète uniquement côté serveur
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
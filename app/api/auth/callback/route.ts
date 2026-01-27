import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    
    // 1. Échange du code contre une session Supabase
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      const providerToken = data.session.provider_token; // Access Token Google
      const providerRefreshToken = data.session.provider_refresh_token; // Refresh Token
      const user = data.session.user;

      // 2. Si la connexion vient de Google, on persiste les jetons
      if (user.app_metadata.provider === 'google' && providerToken) {
        // Calcul de l'expiration (souvent 1h pour Google)
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 3600);

        await supabase.from('user_integrations').upsert({
          user_id: user.id,
          provider: 'google',
          access_token: providerToken,
          refresh_token: providerRefreshToken, // CRUCIAL
          expires_at: expiresAt.toISOString(),
          scopes: user.identities?.[0]?.identity_data?.iss ? [] : [] // Optionnel
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Retour à l'accueil en cas d'erreur
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 });

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    // 1. Échanger le code contre les tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // 2. Récupérer l'utilisateur actuel via Supabase Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    // 3. Stocker les tokens dans la table user_integrations
    const { error } = await supabase.from('user_integrations').upsert({
      user_id: user.id,
      provider: 'google',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token, // Persiste la connexion
      expires_at: new Date(tokens.expiry_date!).toISOString(),
      updated_at: new Date().toISOString()
    });

    if (error) throw error;

    // 4. Rediriger l'utilisateur vers les paramètres
    return NextResponse.redirect(new URL('/dashboard/settings/connections', request.url));
  } catch (error) {
    console.error('Google Callback Error:', error);
    return NextResponse.redirect(new URL('/dashboard/settings/connections?error=google_failed', request.url));
  }
}
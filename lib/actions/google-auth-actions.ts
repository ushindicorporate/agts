// lib/actions/google-auth-actions.ts
'use server'

import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function getGoogleAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/gmail.send'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Indispensable pour avoir le REFRESH_TOKEN
    scope: scopes,
    prompt: 'consent', // Force Google à redonner le refresh_token à chaque fois
  });

  return url;
}
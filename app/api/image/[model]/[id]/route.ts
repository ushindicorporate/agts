import { NextRequest, NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo-client'; // Ton helper XML-RPC

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  const { model, id } = await params;

  try {
    // 1. On demande l'image à Odoo via ton helper sécurisé
    // On utilise image_512 ou image_128 selon le besoin
    const records = await odooCall(model, 'read', [
      [parseInt(id)],
      ['image_512']
    ]) as any[];

    if (!records || records.length === 0 || !records[0].image_512) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // 2. Odoo renvoie du Base64, on le transforme en Buffer binaire
    const base64Data = records[0].image_512;
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // 3. On renvoie l'image avec les bons headers pour le cache
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png', // Odoo stocke souvent en PNG
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400', // Cache de 7 jours
      },
    });
  } catch (error) {
    console.error('Image Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
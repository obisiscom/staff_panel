import { NextResponse } from 'next/server';
import { getAuthCookieAsync, parseJwtClaims } from '@/lib/auth';
import { refreshTokenIfNeeded } from '@/lib/refreshToken';

export async function GET() {
  // Token'ı yenilemeyi dene
  const tokenRefreshed = await refreshTokenIfNeeded();
  
  if (!tokenRefreshed) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const token = await getAuthCookieAsync();
  
  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Token'daki claims'leri çıkar
    const userClaims = parseJwtClaims(token);
    
    return NextResponse.json({
      id: userClaims.id,
      email: userClaims.email,
      role: userClaims.role
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
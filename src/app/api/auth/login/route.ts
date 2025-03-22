import { NextResponse } from 'next/server';
import { setAuthCookiesAsync, parseJwtClaims } from '@/lib/auth';
import { LoginResponse } from '@/types/auth';
import { API } from '@/constants/api';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        // Backend API'ye istek gönder
        const response = await fetch(`${API.BASE_URL}${API.AUTH.LOGIN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: 'Giriş başarısız' },
                { status: response.status }
            );
        }

        const data: LoginResponse = await response.json();

        // Token'ı cookie'ye kaydet
        await setAuthCookiesAsync(data);

        // Token'daki claims'leri çıkar
        const userClaims = parseJwtClaims(data.accessToken.token);

        // Kullanıcı bilgilerini döndür (token hariç)
        return NextResponse.json({
            user: {
                id: userClaims.id,
                email: userClaims.email,
                role: userClaims.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
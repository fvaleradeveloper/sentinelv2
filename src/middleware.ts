import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const loginAttempts = new Map<string, { count: number; blockedUntil: number }>();

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutos

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? '127.0.0.1';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting para rutas de login
  if (pathname === '/api/auth/callback' && request.method === 'POST') {
    const ip = getClientIP(request);
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (record) {
      if (record.blockedUntil > now) {
        return NextResponse.json(
          { error: 'Demasiados intentos. Intenta de nuevo más tarde.' },
          { status: 429 }
        );
      }
      if (record.count >= MAX_ATTEMPTS) {
        record.blockedUntil = now + BLOCK_DURATION_MS;
        record.count = 0;
        loginAttempts.set(ip, record);
        return NextResponse.json(
          { error: 'IP bloqueada temporalmente por múltiples intentos fallidos.' },
          { status: 429 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};

export function recordFailedLogin(ip: string): void {
  const record = loginAttempts.get(ip) ?? { count: 0, blockedUntil: 0 };
  record.count += 1;
  loginAttempts.set(ip, record);
}

export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}
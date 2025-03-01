// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('Middleware triggered for:', req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next).*)'],
};

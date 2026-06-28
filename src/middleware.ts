import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pass through all requests — no redirects needed
  // bootforge.vercel.app is the primary domain
  return NextResponse.next();
}

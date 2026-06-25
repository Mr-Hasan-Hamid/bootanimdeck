import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');

  if (host === 'bootforge.vercel.app') {
    const url = request.nextUrl.clone();
    url.host = 'bootanimdeck.vercel.app';
    // Use an explicit HTTP 301 redirect instead of Next.js default 308/307
    return NextResponse.redirect(url.toString(), 301);
  }

  return NextResponse.next();
}

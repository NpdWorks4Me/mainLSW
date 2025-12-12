import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

const ADMIN_HOST = process.env.NEXT_PUBLIC_ADMIN_HOST || 'admin.littlespaceworld.com';

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get('host') || '';

  // When someone visits admin.littlespaceworld.com → rewrite to the /admin path
  if (host.includes(ADMIN_HOST) && !url.pathname.startsWith('/admin')) {
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

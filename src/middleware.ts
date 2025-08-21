import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// skip api, static, _next, public files
	if (
		pathname.startsWith('/api') ||
		pathname.startsWith('/_next') ||
		pathname.startsWith('/static') ||
		pathname.includes('.')
	) {
		return NextResponse.next();
	}

	// Protect /dashboard and its subpaths
	if (pathname.startsWith('/dashboard')) {
		// getToken reads JWT from cookie set by NextAuth
		const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
		if (!token) {
			// Not authenticated -> redirect to /login (preserve return url)
			const loginUrl = new URL('/login', req.url);
			loginUrl.searchParams.set('callbackUrl', req.nextUrl.href);
			return NextResponse.redirect(loginUrl);
		}
		// Authenticated -> ok
		return NextResponse.next();
	}

	// Default: let it pass
	return NextResponse.next();
}

export const config = {
	// apply to everything under /dashboard
	matcher: ['/dashboard/:path*'],
};

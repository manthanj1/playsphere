import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // 1. Get the authentication token from cookies
  const token = request.cookies.get('token')?.value;

  // 2. Define the paths that authenticated users should NOT access
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup');

  // 3. If the user has a token and tries to access login/signup, redirect to home
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/select-city', request.url));
  }

  // 4. (Optional) You can also protect dashboard routes here
  // const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile');
  // if (!token && isProtectedRoute) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

// 5. Configure the matcher to run middleware only on specific routes
export const config = {
  // Matcher allows you to filter Middleware to run on specific paths.
  // It's a best practice to avoid running middleware on static files and images.
  matcher: [
    '/login',
    '/signup',
    // '/profile/:path*', // Uncomment to protect profile routes too
    
    // Alternatively, use negative lookahead to match all routes except statics:
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

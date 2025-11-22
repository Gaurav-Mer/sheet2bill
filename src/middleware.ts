import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    // 1. Create the response object
    const res = NextResponse.next()
    // 2. Create the Supabase client
    const supabase = createMiddlewareClient({ req, res })

    // 3. Refresh session if needed
    // This is the MAGIC line. It checks the cookie.
    // If it's expired, it refreshes it and updates 'res' with the new cookie.
    // If there is no session (public user), it simply does nothing.
    await supabase.auth.getSession()

    // 4. Pass the request forward
    // We are NOT adding any redirect logic here.
    // Your existing getServerSideProps will handle the "Redirect to Login"
    // if the user tries to access a protected page.
    return res
}

// 5. Configure where this runs
// We exclude static files, images, and the favicon to save resources.
// But we include ALL other pages (public and private) to ensure session health.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (optional: if you don't want middleware on API routes)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
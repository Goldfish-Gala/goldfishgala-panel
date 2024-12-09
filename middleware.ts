import { NextRequest, NextResponse } from 'next/server';
import store from './store';
import { login, logout } from './store/authSlice';
import { getUser } from './api/api-user';

// Define the type for protected routes
type ProtectedRoutes = {
    [key: number]: string[];
};

const protectedRoutes: ProtectedRoutes = {
    1: [
        '/dashboard',
        '/',
        '/fish-registration',
        '/invoice/preview',
        '/invoices',
        '/payment-success',
        '/registered-fishes',
        '/users',
        '/profile',
    ],
    2: [
        '/',
        '/dashboard',
        '/fish-registration',
        '/invoice/preview',
        '/invoices',
        '/payment-success',
        '/registered-fishes',
        '/users',
        '/profile',
    ],
    3: [
        '/',
        '/dashboard',
        '/fish-registration',
        '/invoice/preview',
        '/invoices',
        '/payment-success',
        '/registered-fishes',
        '/users',
        '/profile',
        '/admin',
        '/judges',
    ],
    4: ['/', '/dashboard', '/users', '/profile', '/judges'],
};

export async function middleware(req: NextRequest) {
    const authCookie = req.cookies.get('token');

    if (req.nextUrl.pathname.startsWith('/_next/')) {
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    if (authCookie) {
        try {
            const userProfile = await getUser(authCookie.value);

            if (userProfile.success) {
                store.dispatch(login());

                const roleId = userProfile.data[0].role_id;

                if (typeof roleId === 'number') {
                    const requestedPath = req.nextUrl.pathname;
                    const isAuthorized = protectedRoutes[roleId]?.some((route) => {
                        return requestedPath === route || requestedPath.startsWith(`${route}/`);
                    });

                    if (isAuthorized) {
                        return NextResponse.next();
                    } else {
                        return NextResponse.redirect(new URL('/_error', req.url));
                    }
                }
            } else {
                store.dispatch(logout());
                return NextResponse.redirect(new URL('/auth/failed', req.url));
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            store.dispatch(logout());
            return NextResponse.redirect(new URL('/auth', req.url));
        }
    } else {
        store.dispatch(logout());
        return NextResponse.redirect(new URL('/auth', req.url));
    }
}

export const config = {
    matcher: [
        '/admin/:path',
        '/judges/:path',
        '/',
        '/dashboard',
        '/fish-registration',
        '/invoice/preview',
        '/invoices',
        '/payment-success',
        '/registered-fishes',
        '/users',
        '/profile',
    ],
};

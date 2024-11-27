import { NextRequest, NextResponse } from 'next/server';
import store from './store';
import { login, logout } from './store/authSlice';
import { getUser } from './api/api-user';

// Define the type for protected routes
type ProtectedRoutes = {
    [key: number]: string[];
};

const protectedRoutes: ProtectedRoutes = {
    1: ['/dashboard', '/'],
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
        '/fish-candidates',
        '/fish-score',
        '/selected-nominees',
        '/winner-selection',
    ],
    4: ['/fish-candidates', '/fish-score', '/selected-nominees', '/winner-selection', '/', '/dashboard'],
};

export async function middleware(req: NextRequest) {
    const authCookie = req.cookies.get('token');

    if (authCookie) {
        try {
            const userProfile = await getUser(authCookie.value);
            console.log(' userProfile', userProfile);

            if (userProfile.success) {
                store.dispatch(login());

                const roleId = userProfile.data[0].role_id;

                if (typeof roleId === 'number') {
                    const requestedPath = req.nextUrl.pathname;
                    if (protectedRoutes[roleId]?.includes(requestedPath)) {
                        return NextResponse.next();
                    } else {
                        return NextResponse.redirect(new URL('/_error', req.url));
                    }
                } else {
                    return NextResponse.redirect(new URL('/_error', req.url));
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
        '/fish-candidates',
        '/fish-score',
        '/selected-nominees',
        '/winner-selection',
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

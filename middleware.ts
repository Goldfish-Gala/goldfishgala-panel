import { NextRequest, NextResponse } from 'next/server';
import store from './store';
import { login, logout, setProfile } from './store/authSlice';
import { getUser } from './api/api-user';

export async function middleware(req: NextRequest) {
    const authCookie = req.cookies.get('token');

    let response = NextResponse.next();

    if (authCookie) {
        try {
            const userProfile = await getUser(authCookie.value);

            if (userProfile.success) {
                store.dispatch(login());
                return response;
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
    matcher: ['/', '/users', '/event', '/profile', '/dashboard'],
};

import { NextRequest, NextResponse } from 'next/server';
import store from './store';
import { login, logout, setProfile } from './store/authSlice';
import { getUser } from './api/api-config';

export async function middleware(req: NextRequest) {
    const authCookie = req.cookies.get('token');

    let response = NextResponse.next();

    if (authCookie) {
        try {
            const userProfile = await getUser(`token=${authCookie.value}`);
            // console.log('user', userProfile.data[0]);

            if (userProfile.success) {
                store.dispatch(login());
                response.cookies.set('authCookies', authCookie.value, {
                    httpOnly: false,
                    path: '/',
                    maxAge: 60 * 60 * 24,
                });
                if (userProfile.data[0].user_is_first_login) {
                    return NextResponse.redirect(new URL('/pre-member', req.url));
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

    return response;
}

export const config = {
    matcher: ['/', '/users', '/event', '/profile', '/dashboard'],
};

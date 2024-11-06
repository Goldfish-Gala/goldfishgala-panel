import { NextRequest, NextResponse } from 'next/server';
import store from './store';
import { login, logout, setProfile } from './store/authSlice';
import { getUser } from './api/api-user';

export async function middleware(req: NextRequest) {
    let response = NextResponse.next();
    try {
        const userProfile = await getUser();

        if (userProfile.success) {
            store.dispatch(login());
        } else {
            store.dispatch(logout());
            return NextResponse.redirect(new URL('/auth', req.url));
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        store.dispatch(logout());
        return NextResponse.redirect(new URL('/auth', req.url));
    }

    return response;
}

export const config = {
    matcher: ['/', '/users', '/event', '/profile', '/dashboard'],
};

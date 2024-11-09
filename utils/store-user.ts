import { Dispatch } from 'redux';
import { setProfile } from '@/store/authSlice';
import { getUser } from '@/api/api-user';

interface Router {
    push: (url: string) => void;
}

export const storeUser = async (authCookie: string | undefined, dispatch: Dispatch) => {
    try {
        const userProfile = await getUser(authCookie);

        if (userProfile) {
            dispatch(setProfile({ user: userProfile.data[0] }));
            return userProfile.data[0];
        } else {
            return null;
        }
    } catch (error: any) {
        console.error('Error fetching user profile:', error.message || error);
        return false;
    }
};

export const fetchUserProfile = async (authCookie: string | undefined, dispatch: Dispatch, router: Router) => {
    try {
        if (authCookie) {
            await storeUser(authCookie, dispatch);
            return true;
        } else {
            router.push('/auth');
        }
    } catch (error) {
        throw error;
    }
};

export const fetchUserComponent = async (authCookie: string | undefined, dispatch: Dispatch, router: Router) => {
    try {
        if (authCookie) {
            const userProfile = await storeUser(authCookie, dispatch);
            return userProfile;
        } else {
            router.push('/auth');
        }
    } catch (error) {
        throw error;
    }
};

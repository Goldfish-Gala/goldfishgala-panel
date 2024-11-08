import { Dispatch } from 'redux';
import { setProfile } from '@/store/authSlice';
import { getUser } from '@/api/api-user';

interface Router {
    push: (url: string) => void;
}

export const storeUser = async (authCookie: string | undefined, dispatch: Dispatch): Promise<boolean> => {
    try {
        const userProfile = await getUser(authCookie);

        if (userProfile) {
            dispatch(setProfile({ user: userProfile.data[0] }));
            return true;
        } else {
            return false;
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
        } else {
            router.push('/auth');
        }
    } catch (error) {
        throw error;
    }
};

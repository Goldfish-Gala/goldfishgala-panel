import { Dispatch } from 'redux';
import { getUser } from '@/api/api-config';
import { setProfile } from '@/store/authSlice';

export const storeUser = async (cookie: string | any, dispatch: Dispatch): Promise<boolean> => {
    try {
        const userProfile = await getUser(`token=${cookie}`);

        if (userProfile.success) {
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

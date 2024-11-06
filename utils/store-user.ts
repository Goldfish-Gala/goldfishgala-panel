import { Dispatch } from 'redux';
import { setProfile } from '@/store/authSlice';
import { getUser } from '@/api/api-user';

export const storeUser = async (dispatch: Dispatch): Promise<boolean> => {
    try {
        const userProfile = await getUser();

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

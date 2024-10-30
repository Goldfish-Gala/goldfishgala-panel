'use client';
import { useEffect, useState } from 'react';
import Loading from '@/components/layouts/loading';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '@/store/authSlice';
import { useCookies } from 'next-client-cookies';
import { storeUser } from '@/utils/store-user';
import { IRootState } from '@/store';

const UserComponent = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: IRootState) => state.auth.user);
    const [loading, setLoading] = useState(true);
    const cookies = useCookies();
    const authCookie = cookies?.get('token');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (authCookie) {
                const userProfile = await storeUser(authCookie, dispatch);

                if (userProfile) {
                    if (user?.user_is_first_login) {
                        router.replace('/pre-member');
                    } else {
                        router.replace('/dashboard');
                    }
                } else {
                    router.replace('/auth');
                }
            } else {
                router.replace('/auth');
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [authCookie, dispatch, router, user?.user_is_first_login]);

    if (loading) {
        return <Loading />;
    }

    return null;
};

export default UserComponent;

'use client';
import { useEffect, useState } from 'react';
import { getUser } from '@/api/api-config';
import Loading from '@/components/layouts/loading';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setProfile } from '@/store/authSlice';
import { useCookies } from 'next-client-cookies';
import { storeUser } from '@/utils/storeUser';

const UserComponent = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const cookies = useCookies();
    const authCookie = cookies.get('authCookies');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (authCookie) {
                const userProfile = await storeUser(authCookie, dispatch);

                if (userProfile) {
                    router.replace('/dashboard');
                } else {
                    router.replace('/auth');
                }
            } else {
                router.replace('/auth');
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [authCookie, dispatch, router]);

    if (loading) {
        return <Loading />;
    }

    return null;
};

export default UserComponent;

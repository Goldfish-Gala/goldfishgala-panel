'use client';
import { useEffect, useState } from 'react';
import Loading from '@/components/layouts/loading';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useCookies } from 'next-client-cookies';
import { fetchUserComponent } from '@/utils/store-user';

const UserComponent = () => {
    const dispatch = useDispatch();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (authCookie) {
                const userProfile = await fetchUserComponent(authCookie, dispatch, router);
                if (userProfile) {
                    if (userProfile.role_id === 4) {
                    }
                    if (userProfile.user_is_first_login) {
                        router.replace('/pre-member');
                    } else if (userProfile.role_id === 4) {
                        router.replace('/judges/fish-candidates');
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
        fetchUser();
    }, [authCookie, dispatch, router]);

    if (loading) {
        return <Loading />;
    }

    return null;
};

export default UserComponent;

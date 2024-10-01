'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import Loading from '@/components/layouts/loading';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import { storeUser } from '@/utils/storeUser'; // Ensure you have imported this

const Dashboard = () => {
    const user = useSelector((state: IRootState) => state.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();
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
        };

        if (!user) {
            fetchUserProfile();
        }
    }, [authCookie, dispatch, router, user]);

    if (!user) {
        return (
            <div className="overflow-x-hidden">
                <Loading />
            </div>
        );
    }

    return <div>Welcome, {user.user_id}</div>;
};

export default Dashboard;

'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import Loading from '@/components/layouts/loading';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';

const Dashboard = () => {
    const user = useSelector((state: IRootState) => state.auth.user);
    const router = useRouter();

    const cookies = useCookies();
    const authCookie = cookies.get('authCookies');
    console.log('cookie client', authCookie);

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

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

'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import Loading from '@/components/layouts/loading';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import { storeUser } from '@/utils/storeUser';

const Dashboard = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const user = useSelector((state: IRootState) => state.auth.user);

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

    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    if (!user) {
        return (
            <div className="overflow-x-hidden">
                <Loading />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col items-start justify-between">
            <div className="self-end">{formattedDate}</div>
            <div className="-mt-6 flex h-full flex-col justify-center gap-8 px-2">
                <div>
                    <p className="font-bold sm:text-base">Halo {user.user_fname}</p>
                    <p className="text-lg font-bold md:text-xl">Selamat datang di Goldfish Gala</p>
                </div>
                <p className="font-bold">
                    Kami ada untuk menciptakan ruang di mana para penggemar ikan koki dapat mengekspresikan diri mereka
                    dalam hobby
                </p>
            </div>
        </div>
    );
};

export default Dashboard;

'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import Loading from '@/components/layouts/loading';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import { storeUser } from '@/utils/storeUser';
import IconInstagram from '../icon/icon-instagram';

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
        <div
            className="panel grid h-full grid-cols-1 content-between overflow-hidden before:absolute before:-right-44 before:bottom-0 before:top-0 before:m-auto before:h-[110%] before:w-[80%] before:rounded-full before:bg-[#1937cc]"
            style={{
                background: 'linear-gradient(0deg,#00c6fb -227%,#005bea)',
            }}
        >
            <div className="z-[7] mb-16 flex h-full w-full flex-col items-start justify-between text-white-light">
                <div className="self-end">{formattedDate}</div>
                <div className="flex h-full flex-col justify-between px-2 md:justify-center md:gap-8">
                    <div>
                        <p className="font-bold sm:text-base">Halo {user.user_fname}</p>
                        <p className="text-lg font-bold md:text-xl">Selamat datang di Goldfish Gala</p>
                    </div>
                    <p className="font-bold">
                        Kami ada untuk menciptakan ruang di mana para penggemar ikan koki dapat mengekspresikan diri
                        mereka dalam hobby
                    </p>
                    <div className="bottom-8 flex items-center justify-center gap-2 md:absolute">
                        <p>Follow Kami di {''}</p>
                        <a
                            href="https://www.instagram.com/goldfishgala/profilecard/?igsh=MTB4c253MnhtYndxMA=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-0.5 font-bold"
                        >
                            <IconInstagram />
                            <p>goldfishgala</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

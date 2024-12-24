'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import Loading from '@/components/layouts/loading';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import { fetchUserProfile } from '@/utils/store-user';
import IconInstagram from '../icon/icon-instagram';

const Dashboard = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const user = useSelector((state: IRootState) => state.auth.user);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
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
            className="panel grid h-full grid-cols-1 content-between overflow-hidden before:absolute before:-right-44 before:bottom-0 before:top-0 before:m-auto before:h-[110%] before:w-[80%] before:rounded-full before:bg-black-dark-light"
            style={{
                background: 'linear-gradient(135deg, #F1C376, #D9B563, #FFDE4D)',
            }}
        >
            <div className="z-[7] mb-16 flex h-full w-full flex-col items-start justify-between text-white">
                <div className="self-end">{formattedDate}</div>
                <div className="flex h-full flex-col justify-between px-2 md:justify-center md:gap-8">
                    <div>
                        <p className="font-bold sm:text-base">Halo {`${user.user_fname} ${user.user_lname}`},</p>
                        <p className="text-lg font-bold md:text-xl">Selamat datang di Goldfish Gala</p>
                    </div>
                    <p className="font-bold">
                        Goldfish Gala merupakan ajang pamer keunikan dan keindahan Ikan koki, memberikan kesempatan
                        kepada para penghobi untuk menunjukkan taste mereka terhadap ikan Koki dan membangun sebuah
                        komunitas yang saling mendukung dan terhubung.
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

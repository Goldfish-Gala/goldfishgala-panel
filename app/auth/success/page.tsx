'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthSuccess = () => {
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
        }, 1000);

        if (countdown === 0) {
            router.push('/');
        }
        return () => clearInterval(timer);
    }, [countdown, router]);

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/hero.png)] bg-cover bg-left bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img
                    src="/assets/images/auth/coming-soon-object1.png"
                    alt="image"
                    className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
                />
                <img
                    src="/assets/images/auth/coming-soon-object2.png"
                    alt="image"
                    className="absolute left-24 top-0 h-40 md:left-[30%]"
                />
                <img
                    src="/assets/images/auth/coming-soon-object3.png"
                    alt="image"
                    className="absolute right-0 top-0 h-[300px]"
                />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[500px] rounded-md dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex min-h-[300px] flex-col justify-center rounded-md bg-white/60 px-6 py-4 backdrop-blur-lg dark:bg-black/50">
                        <div className="mx-auto flex h-[180px] w-full flex-col items-center justify-around">
                            <h1 className="dark:text-shadow-dark-mode text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">
                                Otentikasi Berhasil!
                            </h1>
                            <div className="flex flex-col items-center gap-2">
                                <p className="font-bold dark:text-white md:text-lg">Mengalihkan setelah:</p>
                                <p className="font-bold text-dark dark:text-white md:text-lg">{countdown} detik</p>{' '}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthSuccess;

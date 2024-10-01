'use client'; // Declare as a client component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthSuccess = () => {
    const [countdown, setCountdown] = useState(5);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
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
                    <div className="relative flex min-h-[400px] flex-col justify-center rounded-md bg-white/60 px-6 py-4 backdrop-blur-lg dark:bg-black/50">
                        <div className="mx-auto flex h-[180px] w-full flex-col items-center justify-around">
                            <h1
                                className="text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl"
                                style={{ textShadow: '4px 4px 10px rgba(0, 0, 0, 0.8)' }}
                            >
                                Otentikasi Berhasil!
                            </h1>
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-small dark:text-white lg:text-base">Mengalihkan setelah:</p>
                                <p className="text-base dark:text-white lg:text-lg">{countdown} detik</p>{' '}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthSuccess;

/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const AuthSuccess = () => {
    const [countdown, setCountdown] = useState(3);
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
                <Image
                    layout="fill"
                    src="/assets/images/auth/bg-gradient.png"
                    alt="image"
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-6 py-10 dark:bg-[#060818] sm:px-16">

                <Image
                    src="/assets/images/auth/coming-soon-object1.png"
                    alt="coming soon object 1"
                    width={893}
                    height={893}
                    className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
                />
                <Image
                    src="/assets/images/auth/coming-soon-object2.png"
                    alt="coming soon object 2"
                    width={160}
                    height={160}
                    className="absolute left-24 top-0 h-40 md:left-[30%]"
                />
                <Image
                    src="/assets/images/auth/coming-soon-object3.png"
                    alt="coming soon object 3"
                    width={300}
                    height={300}
                    className="absolute right-0 top-0 h-[300px]"
                />
                <Image
                    src="/assets/images/auth/polygon-object.svg"
                    alt="polygon object"
                    width={150}
                    height={150}
                    className="absolute bottom-0 end-[28%]"
                />
                <div className="relative w-full max-w-[500px] rounded-md dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex min-h-[400px] flex-col justify-center rounded-md bg-white/60 px-6 py-4 backdrop-blur-3xl dark:bg-black/50">
                        <div className="mx-auto flex h-[300px] w-full flex-col items-center justify-around">
                            <div className="main-logo flex shrink-0 items-center mb-8">
                                <Image
                                    width={400}
                                    height={400}
                                    className="w-40 flex-none dark:hidden"
                                    src="/assets/images/desktop-logo.png"
                                    alt="logo"
                                />
                                <Image
                                    width={400}
                                    height={400}
                                    className="hidden w-40 flex-none dark:block"
                                    src="/assets/images/logo.png"
                                    alt="logo"
                                />
                            </div>
                            <h1 className="text-2xl font-extrabold !leading-snug bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 md:text-3xl">
                                Login Success !
                            </h1>
                            <p className="mt-2 text-center text-md text-white">
                                You will be redirected to the Dashboard Panel in a few seconds.
                            </p>
                            <div className="flex flex-col items-center gap-2">
                                <p className="font-bold text-dark dark:text-white md:text-lg">{countdown} seconds</p>{' '}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthSuccess;

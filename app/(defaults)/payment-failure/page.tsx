'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PaymentSuccess = () => {
    const [countdown, setCountdown] = useState(3);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
        }, 1000);

        if (countdown === 0) {
            router.push('/dashboard');
        }
        return () => clearInterval(timer);
    }, [countdown, router]);

    return (
        <div className="flex min-h-[750px] w-full items-center justify-center">
            <div className="mx-auto flex h-[250px] w-full max-w-[400px] flex-col items-center justify-around rounded-md bg-white/60 py-10 backdrop-blur-3xl dark:bg-black/50">
                <div className="mx-auto flex h-[300px] w-full flex-col items-center justify-around">
                    <h1 className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-xl font-extrabold !leading-snug text-transparent md:text-2xl">
                        Payment Failed !
                    </h1>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-md mt-2 text-center text-dark dark:text-white">
                            You will be redirected in a few seconds.
                        </p>
                        <div>
                            <p className="font-bold text-dark dark:text-white md:text-lg">{countdown} seconds</p>{' '}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;

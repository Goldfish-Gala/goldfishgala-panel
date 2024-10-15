'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PaymentSuccess = () => {
    const [countdown, setCountdown] = useState(5);
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
            <div className="mx-auto flex h-[250px] flex-col items-center justify-around rounded-md bg-white/60 px-16 py-10 backdrop-blur-lg dark:bg-black/50">
                <h1 className="dark:text-shadow-dark-mode text-xl font-extrabold uppercase !leading-snug text-primary md:text-2xl">
                    Pembayaran Berhasil!
                </h1>
                <div className="flex flex-col items-center gap-2">
                    <p className="font-bold dark:text-white md:text-lg">Mengalihkan setelah:</p>
                    <p className="font-bold text-dark dark:text-white md:text-lg">{countdown} detik</p>{' '}
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;

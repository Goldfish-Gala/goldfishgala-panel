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
            router.push('/registered-fishes');
        }
        return () => clearInterval(timer);
    }, [countdown, router]);

    return (
        <div className="flex min-h-[750px] w-full items-center justify-center">
            <div className="mx-auto flex h-[250px] w-[320px] flex-col items-center justify-around rounded-md bg-white/60 py-10 backdrop-blur-3xl dark:bg-black/50">
                <h1 className="dark:text-shadow-dark-mode text-lg font-extrabold uppercase !leading-snug text-primary md:text-xl">
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogClose, DialogContent } from '@/components/UI/Modal';
import { X } from 'lucide-react';

export default function SessionExpiration() {
    const SESSION_DURATION = 55 * 1000 * 60;
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const router = useRouter();

    useEffect(() => {
        const sessionExpirationTimestamp = sessionStorage.getItem('sessionExpiration');
        const now = Date.now();

        if (sessionExpirationTimestamp) {
            if (Number(sessionExpirationTimestamp) > now) {
                setTimeLeft(Number(sessionExpirationTimestamp) - now);
            }
        } else {
            const newExpiration = now + SESSION_DURATION;
            sessionStorage.setItem('sessionExpiration', newExpiration.toString());
            setTimeLeft(SESSION_DURATION);
        }
    }, [SESSION_DURATION, router]);

    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft <= 0) {
            setSessionExpired(true);
        } else {
            const timer = setInterval(() => {
                setTimeLeft((prev) => (prev && prev > 1000 ? prev - 1000 : 0));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (!sessionExpired) return;

        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [sessionExpired]);

    // Redirect to login after countdown ends
    useEffect(() => {
        if (sessionExpired && countdown === 0) {
            sessionStorage.removeItem('sessionExpiration');
            setSessionExpired(false);
            router.push('/auth');
        }
    }, [sessionExpired, countdown, router]);

    return (
        <>
            {sessionExpired && (
                <Dialog open={sessionExpired}>
                    <DialogContent className="min-h-[250px] min-w-[310px] bg-white dark:border-black dark:bg-black">
                        <div className="mx-auto flex h-[300px] w-full flex-col items-center justify-around">
                            <h1 className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-xl font-extrabold !leading-snug text-transparent md:text-2xl">
                                Session Expired!
                            </h1>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="text-md mt-2 text-center text-dark dark:text-white">
                                    You will be redirected in a few seconds.
                                </p>
                                <div>
                                    <p className="font-bold text-dark dark:text-white md:text-lg">
                                        {countdown} seconds
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogClose />
                </Dialog>
            )}
        </>
    );
}

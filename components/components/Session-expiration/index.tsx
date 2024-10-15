'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/UI/Modal';
import { X } from 'lucide-react';

export default function SessionExpiration() {
    const [timeLeft, setTimeLeft] = useState(3600);
    const [sessionExpired, setSessionExpired] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (timeLeft === 0) {
            setSessionExpired(true);
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (sessionExpired) {
            setTimeout(() => {
                setSessionExpired(false);
                router.push('/auth');
            }, 5000);
        }
    }, [sessionExpired, router]);

    return (
        <>
            {sessionExpired && (
                <div>
                    <Dialog open={sessionExpired}>
                        <DialogContent className={'min-h-[250px] min-w-[300px] bg-white dark:bg-dark'}>
                            <div className="flex flex-col items-center justify-around">
                                <p className="dark:text-shadow-dark-mode text-2xl font-extrabold !leading-snug text-secondary dark:text-secondary-light md:text-3xl">
                                    Sesi berakhir
                                </p>
                                <p className="font-bold text-dark dark:text-white">
                                    Mengalihkan ke halaman otentikasi...
                                </p>
                            </div>
                        </DialogContent>
                        <DialogClose></DialogClose>
                    </Dialog>
                </div>
            )}
        </>
    );
}

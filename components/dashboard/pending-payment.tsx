'use client';

import { useCookies } from 'next-client-cookies';
import IconClock from '../icon/icon-clock';
import IconCircle from '../icon/menu/icon-circle';
import { getAllevent, getOneEvent } from '@/api/api-event';
import SpinnerWithText from '../UI/Spinner';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { storeUser } from '@/utils/storeUser';
import { getAllEventRegistered } from '@/api/api-registered-event';

const PendingPayment = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('authCookies');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (authCookie) {
                const userProfile = await storeUser(authCookie, dispatch);
                if (userProfile) {
                    router.push('/dashboard');
                } else {
                    router.push('/auth');
                }
            } else {
                router.push('/auth');
            }
        };

        if (!user) {
            fetchUserProfile();
        }
    }, [authCookie, dispatch, router, user]);

    const fetchPendingPayment = async (): Promise<UserRegDetailType[]> => {
        const getAllUserEvent = await getAllEventRegistered(authCookie, user?.user_id);
        if (getAllUserEvent.success) {
            const pendingRegPayment = getAllUserEvent.data.filter(
                (event: UserRegDetailType) => event.user_reg_status_code === 'pending_payment_reg'
            );
            return pendingRegPayment;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['pendingPayment'],
        queryFn: () => fetchPendingPayment(),
        enabled: !!authCookie,
    });

    return (
        <div className={`panel lg:col-span-2 ${data?.length === 0 ? 'hidden' : ''}`}>
            <div className="mb-5">
                <h5 className="text-lg font-semibold dark:text-white-light">Tagihan pembayaran</h5>
            </div>
            {isPending ? (
                <div className="flex min-h-[336px] w-full flex-col items-center justify-center md:min-h-[348px]">
                    <SpinnerWithText text="Memuat..." />
                </div>
            ) : (
                <div className="flex h-full w-full flex-col items-center gap-8 px-6 pb-4 xl:gap-10">
                    <div className="flex w-full flex-col items-center gap-8 font-semibold text-white-dark xl:mt-8">
                        <p className="text-sm font-bold text-dark dark:text-white-dark md:text-base lg:text-lg xl:text-xl">
                            Anda memiliki {data?.length} tagihan belum terbayar
                        </p>
                    </div>
                    <button className="btn btn-primary mb-5" onClick={() => router.push(`/invoice`)}>
                        Lihat Detail
                    </button>
                </div>
            )}
        </div>
    );
};

export default PendingPayment;

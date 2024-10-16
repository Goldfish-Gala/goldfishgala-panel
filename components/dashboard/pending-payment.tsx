'use client';

import { useCookies } from 'next-client-cookies';
import SpinnerWithText from '../UI/Spinner';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { storeUser } from '@/utils/storeUser';
import { getAllEventRegistered } from '@/api/api-registered-event';

const PendingPayment = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);

    const fetchUserProfile = useCallback(async () => {
        try {
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
        } catch (error) {
            throw error;
        }
    }, [authCookie, dispatch, router]);

    useEffect(() => {
        if (!user) {
            fetchUserProfile();
        }
    }, [fetchUserProfile, user]);

    const fetchPendingPayment = async (): Promise<UserRegDetailType[]> => {
        const getAllUserEvent = await getAllEventRegistered(authCookie, user?.user_id);
        if (getAllUserEvent.success) {
            return getAllUserEvent.data.Pending;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['pendingPayment'],
        queryFn: () => fetchPendingPayment(),
        enabled: !!authCookie && !!user?.user_id,
    });

    return (
        <div className={`panel lg:col-span-1 ${data?.length === 0 ? 'hidden' : ''}`}>
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
                        <p className="text-xs font-bold text-info dark:text-white-dark md:text-sm lg:text-base xl:text-lg">
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

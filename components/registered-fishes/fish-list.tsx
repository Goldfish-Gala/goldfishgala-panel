/* eslint-disable @next/next/no-img-element */
'use client';

import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerWithText from '../UI/Spinner';
import Link from 'next/link';
import { getAllUserRegByStatus } from '@/api/payment/api-payment';

const FishList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const fetchRegisteredFishes = async (): Promise<UserRegDetailType[]> => {
        const getAllUserEvent = await getAllUserRegByStatus(authCookie, user?.user_id, undefined, 'paid');
        if (getAllUserEvent.success) {
            return getAllUserEvent.data;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, data, error } = useQuery({
        queryKey: ['registeredFish'],
        queryFn: () => fetchRegisteredFishes(),
        enabled: !!authCookie && !!user?.user_id,
        refetchOnWindowFocus: false,
    });

    const flattenedFishes: FlattenedFishType[] = useMemo(() => {
        if (!data) return [];
        return data.flatMap((registration) =>
            registration.fishes.map((fish) => ({
                ...registration,
                fish,
            }))
        );
    }, [data]);

    if (isPending) {
        return (
            <div className="flex min-h-[75vh] w-full flex-col items-center justify-center">
                <SpinnerWithText text="Memuat..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[75vh] w-full flex-col items-center justify-center text-red-500">
                <p>Error: {error.message}</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="panel flex min-h-[75vh] w-full flex-col items-center justify-center text-red-500">
                <p>Belum ada ikan yang terdaftar</p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {flattenedFishes.map((item, index) => {
                    const { fish, event_name } = item;
                    return (
                        <div
                            className={`panel flex h-full items-center justify-between rounded-md p-5 shadow-lg`}
                            key={fish.fish_id}
                        >
                            <div className="text-dark dark:text-white">
                                <p className="text-xl font-extrabold capitalize">{fish.fish_name}</p>
                                <p className="mt-1 text-sm font-semibold capitalize">Event : {event_name}</p>
                            </div>
                            <Link href={`/fish-detail/${fish.fish_id}`}>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm border-1 border-white bg-gradient-to-r from-[#1e9afe] to-[#3d38e1] text-sm text-white hover:bg-gradient-to-l"
                                >
                                    Detail
                                </button>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default FishList;

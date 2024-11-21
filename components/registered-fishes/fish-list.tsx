/* eslint-disable @next/next/no-img-element */
'use client';

import { getAllUserRegByStatus } from '@/api/api-payment';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerWithText from '../UI/Spinner';

const FishList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);
    const [fishDetail, setFishDetail] = useState<UserRegDetailType | undefined>(undefined);
    const [open, setOpen] = useState(false);

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

    const handleDetail = (fishId: string) => {
        router.push(`/fish-detail/${fishId}`);
    };

    const gradients = [
        'bg-gradient-to-r from-cyan-500 to-cyan-400',
        'bg-gradient-to-r from-violet-500 to-violet-400',
        'bg-gradient-to-r from-blue-500 to-blue-400',
        'bg-gradient-to-r from-fuchsia-500 to-fuchsia-400',
    ];

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

    return (
        <>
            <div className="mb-5 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {flattenedFishes.map((item, index) => {
                    const { fish, event_name } = item;
                    const bgClass = gradients[index % gradients.length];
                    return (
                        <div
                            className={`panel ${bgClass} flex h-full items-center justify-between rounded-md p-5 shadow-lg`}
                            key={fish.fish_id}
                        >
                            <div className="text-white">
                                <p className="text-xl font-extrabold">{fish.fish_name}</p>
                                <p className="mt-1 text-sm font-semibold">Event : {event_name}</p>
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm border-1 border-white bg-gradient-to-r from-[#1e9afe] to-[#3d38e1] text-sm text-white hover:bg-gradient-to-l"
                                onClick={() => handleDetail(fish.fish_id)}
                            >
                                Detail
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default FishList;

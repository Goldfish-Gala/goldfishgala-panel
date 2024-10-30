/* eslint-disable @next/next/no-img-element */
'use client';

import { getAllUserRegByStatus } from '@/api/api-payment';
import { IRootState } from '@/store';
import { storeUser } from '@/utils/store-user';
import { useQuery } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconMale from '../icon/icon-male';
import IconFemale from '../icon/icon-female';
import Loading from '../layouts/loading';
import SpinnerWithText from '../UI/Spinner';
import FishDetailModal from './fish-detail-modal';

const FishList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);
    const [fishDetail, setFishDetail] = useState<UserRegDetailType | undefined>(undefined);
    const [open, setOpen] = useState(false);

    const fetchUserProfile = useCallback(async () => {
        try {
            if (authCookie) {
                await storeUser(authCookie, dispatch);
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

    const fetchRegisteredFishes = async (): Promise<UserRegDetailType[]> => {
        const getAllUserEvent = await getAllUserRegByStatus(authCookie, user?.user_id, undefined, 'paid_reg');
        if (getAllUserEvent.success) {
            return getAllUserEvent.data;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['pendingPayment'],
        queryFn: () => fetchRegisteredFishes(),
        enabled: !!authCookie && !!user?.user_id,
    });

    const handleDetail = (fishId: string) => {
        const filterFish = data?.filter((fish) => fish.fish_id === fishId);
        if (filterFish) {
            setFishDetail(filterFish[0]);
            setOpen(true);
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-[75vh] w-full flex-col items-center justify-center">
                <SpinnerWithText text="Memuat..." />
            </div>
        );
    }

    return (
        <>
            <div className="mb-5 grid grid-cols-1 gap-8 lg:grid-cols-4">
                {data?.map((fish) => {
                    if (!fish) return null;
                    return (
                        <div className="panel h-full" key={fish.fish_id}>
                            <div className="-m-5 mb-5 flex justify-between p-5">
                                <div className="flex">
                                    <div className="media-aside align-self-start">
                                        <div className="shrink-0 rounded-full ring-2 ring-white-light dark:ring-dark ltr:mr-4 rtl:ml-4">
                                            <img
                                                src={fish.fish_image1}
                                                alt="fish image"
                                                className="h-14 w-14 rounded-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-base font-extrabold">{fish.fish_name}</p>
                                        <p className="mt-1 text-sm font-semibold text-white-dark">{fish.event_name}</p>
                                    </div>
                                </div>
                                <div className="pt-1">
                                    {fish.fish_gender === 'male' ? <IconMale /> : <IconFemale />}
                                </div>
                            </div>
                            <div className="pb-8 text-center font-semibold">
                                <div className="absolute bottom-0 -mx-5 flex w-full items-center justify-between p-5">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-lg m-auto w-fit border-0 bg-gradient-to-r  from-[#3d38e1] to-[#1e9afe] !py-2 hover:bg-gradient-to-l"
                                        onClick={() => handleDetail(fish.fish_id)}
                                    >
                                        Lihat detail
                                    </button>
                                </div>
                            </div>
                            <FishDetailModal data={fishDetail} open={open} setOpen={setOpen} isLoading={isPending} />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default FishList;

'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import Swal from 'sweetalert2';
import SpinnerWithText from '@/components/UI/Spinner';
import { getAllEventPrice } from '@/api/event-price/api-event-price';
import { getChampionByEventPriceApi } from '@/api/champion/api-champions';
import { Separator } from '@/components/UI/Separator';
import ChampionCandidates from './champion-candidate';

const ChampionSizeList = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [eventPriceId, setEventPriceId] = useState(searchParams.get('event-price-id') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'asc');
    
    useEffect(() => {
        const params = new URLSearchParams();
        params.set('event-price-id', eventPriceId);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        if (window.location.href !== newUrl) {
            window.history.replaceState(null, '', newUrl);
        }
    }, [eventPriceId, router]);

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const fetchSizeCategory = async (): Promise<EventPriceType[]> => {
        const eventPrices = await getAllEventPrice(sort, authCookie);
        if (eventPrices.success) return eventPrices.data;
        throw new Error('Failed to fetch event prices');
    };

    const fetchChampionCategory = async (): Promise<ChampionBestAwardType[]> => {
        const eventPrices = await getChampionByEventPriceApi(authCookie, eventPriceId);
        if (eventPrices.success) return eventPrices.data;
        throw new Error('Failed to fetch event prices');
    };

    const {
        data: eventPrices,
        isPending,
        isSuccess,
    } = useQuery({
        queryKey: ['allEventPrices'],
        queryFn: fetchSizeCategory,
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
    });

    useEffect(() => {
        if (isSuccess && eventPrices && eventPrices.length > 0 && !searchParams.get('event-price-id')) {
            setEventPriceId(eventPrices[0].event_price_id);
        }
    }, [isSuccess, eventPrices, searchParams]);

    const { data: championCategory, isPending: isChampPending } = useQuery({
        queryKey: ['championBySize', eventPriceId],
        queryFn: fetchChampionCategory,
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
    });

    if (!eventPrices || !championCategory) {
        return (
            <div className="flex min-h-[650px] min-w-[320px] items-center justify-center">
                <SpinnerWithText text="Loading..." />
            </div>
        );
    }

    return (
        <div className="mt-6 flex w-full flex-col">
            <div className="panel mb-2 flex w-[300px] items-center justify-center gap-4 px-1 py-2">
                <div className="flex gap-2">
                    <label className="pt-1.5 font-semibold">Size Category :</label>
                    <select
                        className="rounded bg-dark-light text-black dark:bg-white"
                        value={eventPriceId}
                        onChange={(e) => setEventPriceId(e.target.value)}
                    >
                        {eventPrices.map((item) => (
                            <option key={item.event_price_id} value={item.event_price_id}>
                                {item.event_price_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="panel flex gap-5 overflow-x-auto">
                {championCategory.length === 0 ? (
                    <div className="flex min-h-[200px] w-full items-center justify-center">
                        <p className="text-danger">Winner for current size not decided yet</p>
                    </div>
                ) : (
                    <>
                        {championCategory?.map((item, index) => (
                            <div key={item.champion_category_id}>
                                <div className="pb-6">
                                    <ChampionCandidates item={item} />
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChampionSizeList;

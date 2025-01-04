'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import Swal from 'sweetalert2';
import SpinnerWithText from '@/components/UI/Spinner';
import { getAllEventPrice } from '@/api/event-price/api-event-price';
import { getAllCategoryByEventPriceApi, getAllChampions } from '@/api/champion/api-champions';
import ChampionCandidates from './champion-candidate';
import { Separator } from '@/components/UI/Separator';

const ChampionSelectionList = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [eventPriceId, setEventPriceId] = useState(searchParams.get('event-price-id') || '');

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
        const eventPrices = await getAllEventPrice(authCookie);
        if (eventPrices.success) return eventPrices.data;
        throw new Error('Failed to fetch event prices');
    };

    const fetchChampionCategory = async (): Promise<ChampionCategoryType[]> => {
        const eventPrices = await getAllCategoryByEventPriceApi(authCookie, eventPriceId);
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

    const { data: championCategory, isPending: isChampCategoryPending } = useQuery({
        queryKey: ['championCategory', eventPriceId],
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
        <div className="flex w-full flex-col">
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
            <div className="panel flex flex-col gap-5">
                {championCategory?.map((item, index) => (
                    <div key={item.champion_category_id}>
                        <p className="mb-2 text-base font-bold text-primary">{item.champion_category_name}</p>
                        <div className="pb-6">
                            <ChampionCandidates
                                categoryId={item.champion_category_id}
                                fishSize={item.event_price_name}
                                categoryName={item.champion_category_name}
                            />
                        </div>
                        {index < championCategory.length - 1 && (
                            <Separator className="my-0 h-0.5 bg-white-dark/55 p-0" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChampionSelectionList;

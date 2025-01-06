'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import SpinnerWithText from '@/components/UI/Spinner';
import { getAllEventPrice } from '@/api/event-price/api-event-price';
import { getChampionByEventPriceApi } from '@/api/champion/api-champions';
import BestAwardCandidates from './best-award-candidate';

const BestAwardSelection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [isBestAwardSmallExist, setBestAwardSmallExist] = useState(false);
    const [isBestAwardMediumExist, setBestAwardMediumExist] = useState(false);
    const [isBestAwardLargeExist, setBestAwardLargeExist] = useState(false);
    const [sort, setSort] = useState(searchParams.get('sort') || 'asc');
    const [eventPriceId, setEventPriceId] = useState(searchParams.get('event-price-id') || '');

    useEffect(() => {
        const params = new URLSearchParams();
        params.set('event-price-id', eventPriceId);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        if (window.location.href !== newUrl) {
            window.history.replaceState(null, '', newUrl);
        }
    }, [eventPriceId, router]);

    const fetchSizeCategory = async (): Promise<EventPriceType[]> => {
        const eventPrices = await getAllEventPrice(sort, authCookie);
        if (eventPrices.success) return eventPrices.data;
        throw new Error('Failed to fetch event prices');
    };

    const fetchChampionBestAward = async (): Promise<ChampionBestAwardType[]> => {
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

    const { data: bestAwards, isPending: isBestAwardPending } = useQuery({
        queryKey: ['bestAwardCandidate', eventPriceId],
        queryFn: fetchChampionBestAward,
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
    });

    if (!eventPrices || isBestAwardPending) {
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

            {bestAwards?.length === 0 ? (
                <div className="flex min-h-[650px] w-full items-center justify-center">
                    <p className="text-danger">No data available</p>
                </div>
            ) : (
                <div className="panel grid max-w-[100%] grid-cols-1 gap-5 overflow-x-auto md:grid-cols-2 xl:grid-cols-3">
                    {bestAwards?.map((item) => (
                        <div key={item.champion_id}>
                            <div className="pb-6">
                                <BestAwardCandidates
                                    bestAward={item}
                                    isBestAwardSmallExist={isBestAwardSmallExist}
                                    isBestAwardMediumExist={isBestAwardMediumExist}
                                    isBestAwardLargeExist={isBestAwardLargeExist}
                                    setBestAwardSmallExist={setBestAwardSmallExist}
                                    setBestAwardMediumExist={setBestAwardMediumExist}
                                    setBestAwardLargeExist={setBestAwardLargeExist}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BestAwardSelection;

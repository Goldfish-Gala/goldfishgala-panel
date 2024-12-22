'use client';

import { useInfiniteQuery, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useCookies } from 'next-client-cookies';
import Swal from 'sweetalert2';
import { getAllFishCandidateApi, selectFishNominateApi } from '@/api/nomination/api-nomination';
import SpinnerWithText from '@/components/UI/Spinner';
import IGEmbed from '@/components/components/ig-embed/embed';
import ConfirmationModal from '@/components/components/confirmation-modal';
import { getAllEventPrice } from '@/api/event-price/api-event-price';
import { error } from 'console';
import ChampionsComp from './champion-category';
import WinnerCard from './size-card';
import { getAllChampions } from '@/api/champion/api-champions';

const WinnerList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [isChampion, setChampion] = useState(true);
    const [isFetching, setFetching] = useState(false);

    const fetchChampions = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getAllChampions(authCookie);
            if (response.data.length === 0) {
                setChampion(false);
                setFetching(false);
            }
        } catch (error) {
            console.error(error);
            setChampion(false);
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchChampions();
    }, [fetchChampions]);

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

    const fetchAllWinners = async (): Promise<EventPriceType[]> => {
        const eventPrices = await getAllEventPrice(authCookie);
        if (eventPrices.success) return eventPrices.data;
        throw new Error('Failed to fetch event prices');
    };

    const { data, isPending } = useQuery({
        queryKey: ['allEventPrices'],
        queryFn: fetchAllWinners,
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
    });

    if (!data || isFetching) {
        return (
            <div className="flex min-h-[650px] min-w-[320px] items-center justify-center">
                <SpinnerWithText text="Loading..." />
            </div>
        );
    }

    if (!isChampion) {
        return (
            <div className="flex min-h-[650px] min-w-[500px] items-center justify-center">
                <p className="text-danger">Champions not announced yet</p>
            </div>
        );
    }

    return (
        <>
            {data.map((item) => (
                <div className="panel" key={item.event_price_id}>
                    <WinnerCard
                        eventPriceId={item.event_price_id}
                        eventPriceName={item.event_price_name}
                        authCookie={authCookie}
                    />
                </div>
            ))}
        </>
    );
};

export default WinnerList;

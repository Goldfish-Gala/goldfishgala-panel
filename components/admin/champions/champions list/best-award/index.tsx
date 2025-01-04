'use client';

import { getBestAwardApi, getGrandChampionApi } from '@/api/champion/api-champions';
import IGEmbed from '@/components/components/ig-embed/embed';
import SpinnerWithText from '@/components/UI/Spinner';
import { useQuery } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { useState } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
import BestAwardCard from './best-award-card';

const BestAwardList = () => {
    const cookies = useCookies();
    const authCookie = cookies?.get('token');

    const fetchBestAwards = async (): Promise<ChampionBestAwardType[]> => {
        const bestAwards = await getBestAwardApi(authCookie);
        if (bestAwards.success) return bestAwards.data;
        throw new Error('Failed to fetch event prices');
    };

    const { data, isPending, isSuccess, isFetching } = useQuery({
        queryKey: ['bestAward'],
        queryFn: fetchBestAwards,
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
    });

    if (isFetching) {
        return (
            <div className="flex min-h-[650px] min-w-[320px] items-center justify-center">
                <SpinnerWithText text="Loading..." />
            </div>
        );
    }

    if (data?.length === 0) {
        return (
            <div className="panel flex min-h-[300px] w-full flex-col items-start justify-start text-dark dark:text-white-dark">
                <p className="text-lg font-bold text-primary">Best Award</p>
                <p className="my-auto self-center text-danger">Best Award not decided yet</p>
            </div>
        );
    }

    return (
        <div className="panel flex w-full flex-col items-start justify-start text-dark dark:text-white-dark">
            <p className="text-lg font-bold text-primary">Best Awards</p>
            <div className="my-auto mt-4 flex flex-col gap-4 self-center xl:flex-row">
                {data?.map((item) => (
                    <div key={item.champion_id}>
                        <BestAwardCard item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestAwardList;

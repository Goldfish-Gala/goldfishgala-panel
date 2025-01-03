'use client';

import { getGrandChampionApi } from '@/api/champion/api-champions';
import IGEmbed from '@/components/components/ig-embed/embed';
import SpinnerWithText from '@/components/UI/Spinner';
import { useQuery } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { useState } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';

const GrandChampionList = () => {
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [isGrandChampionExist, setGrandChampionExist] = useState(false);

    const fetchGrandChampion = async (): Promise<ChampionBestAwardType> => {
        const grandChampion = await getGrandChampionApi(authCookie);
        console.log('data ', grandChampion);
        if (grandChampion.success) return grandChampion.data[0];
        throw new Error('Failed to fetch event prices');
    };

    const { data, isPending, isSuccess, isFetching } = useQuery({
        queryKey: ['grandChampion'],
        queryFn: fetchGrandChampion,
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

    if (!data) {
        return (
            <div className="panel flex min-h-[300px] w-full grid-cols-1 flex-col items-start justify-start text-dark dark:text-white-dark">
                <p className="text-lg font-bold text-primary">Grand Champion</p>
                <p className="my-auto self-center text-danger">Grand champion not decided yet</p>
            </div>
        );
    }

    return (
        <div className="panel flex w-full grid-cols-1 flex-col items-start justify-start text-dark dark:text-white-dark">
            <p className="text-lg font-bold text-primary">Grand Champion</p>
            <div className="my-auto mt-4 self-center">
                <InstagramEmbed url={data?.fish_submission_link} width={328} />
            </div>
        </div>
    );
};

export default GrandChampionList;

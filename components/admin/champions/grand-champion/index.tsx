'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useCookies } from 'next-client-cookies';
import SpinnerWithText from '@/components/UI/Spinner';
import { getGrandChampionApi } from '@/api/champion/api-champions';
import GrandChampionCandidate from './grand-champion-candidate';

const GrandChampionSelection = () => {
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [isGrandChampionExist, setGrandChampionExist] = useState(false);

    const fetchGrandChampion = async (): Promise<ChampionBestAwardType[]> => {
        const grandChampion = await getGrandChampionApi(authCookie);
        if (grandChampion.success) return grandChampion.data;
        throw new Error('Failed to fetch event prices');
    };

    const { data, isPending, isSuccess } = useQuery({
        queryKey: ['grandChampion'],
        queryFn: fetchGrandChampion,
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
    });

    if (!data) {
        return (
            <div className="flex min-h-[650px] min-w-[320px] items-center justify-center">
                <SpinnerWithText text="Loading..." />
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col">
            {data?.length === 0 ? (
                <div className="flex min-h-[650px] w-full items-center justify-center">
                    <p className="text-danger">No data available</p>
                </div>
            ) : (
                <div className="panel grid grid-cols-4 gap-5">
                    {data?.map((item) => (
                        <div key={item.champion_id}>
                            <div className="pb-6">
                                <GrandChampionCandidate
                                    bestAward={item}
                                    isGrandChampionExist={isGrandChampionExist}
                                    setGrandChampionExist={setGrandChampionExist}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GrandChampionSelection;

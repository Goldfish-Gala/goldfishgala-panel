'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'next-client-cookies';
import { IRootState } from '@/store';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { fetchUserProfile } from '@/utils/store-user';
import SpinnerWithText from '../UI/Spinner';
import { useInView } from 'react-intersection-observer';
import FishCard from './fish-score-card';
import { getAllFishNominatedApi } from '@/api/nomination/api-nomination';

const FishScore = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const { ref, inView } = useInView();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const user = useSelector((state: IRootState) => state.auth.user);
    const queryClient = useQueryClient();
    const [limit, setLimit] = useState(Number(searchParams.get('limit') || 6));
    const [sort, setSort] = useState(searchParams.get('sort') || 'asc');
    const [isDataChange, setDataChange] = useState(false);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const fetchAllFish = async ({ pageParam = 1 }: { pageParam: number }): Promise<FishScorePaginationType> => {
        const fishes = await getAllFishNominatedApi(pageParam, limit, sort, authCookie);
        if (fishes.success) return fishes;
        throw new Error('Failed to fetch fish data');
    };

    const { data, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
        queryKey: ['allFishNominated', { limit, sort }],
        queryFn: fetchAllFish,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
        enabled: !!user,
        staleTime: 5 * 50 * 1000,
        refetchOnWindowFocus: false,
    });

    const prevIsDataChangeRef = useRef(isDataChange);

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['allFishNominated', { limit, sort }] });
        prevIsDataChangeRef.current = isDataChange;
    }, [isDataChange, refetch]);

    useEffect(() => {
        const params = new URLSearchParams();
        params.set('limit', limit.toString());
        params.set('sort', sort);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        if (window.location.href !== newUrl) {
            window.history.replaceState(null, '', newUrl);
        }
    }, [limit, sort, router]);

    useEffect(() => {
        if (data?.pages) {
            const lastPage = data.pages[data.pages.length - 1];
            if (lastPage.data.length === 3) {
                queryClient.invalidateQueries({ queryKey: ['allFishNominated', { limit }] });
            }
        }
    }, [data, limit, queryClient, sort]);

    useEffect(() => {
        if (inView && data?.pages[data.pages.length - 1].pagination.hasNextPage) {
            fetchNextPage();
        }
    }, [inView, data, fetchNextPage]);

    if (!data) {
        return (
            <div className="flex min-h-[650px] min-w-[320px] flex-col items-center justify-center ">
                <SpinnerWithText text="Loading..." />
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col">
            <div className="panel mb-2 flex w-[300px] items-center justify-center gap-4 px-1 py-2">
                <div className="flex gap-2">
                    <label className="pt-1.5 font-semibold">Limit :</label>
                    <select
                        className="rounded bg-dark-light dark:bg-white"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                    >
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={12}>12</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <label className="pt-1.5 font-semibold">Sort by :</label>
                    <select
                        className="rounded bg-dark-light dark:bg-white"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="asc">Newest</option>
                        <option value="desc">Oldest</option>
                    </select>
                </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {data?.pages.map((page) =>
                    (sort === 'desc' ? [...page.data].reverse() : page.data).map((fish) => (
                        <FishCard key={fish.fish_id} fish={fish} setDataChange={setDataChange} />
                    ))
                )}
            </div>
            <button
                ref={ref}
                disabled={isFetchingNextPage || !data.pages[data.pages.length - 1].pagination.hasNextPage}
                className="btn2 btn-gradient2 mx-auto mt-6 text-base"
                onClick={() => fetchNextPage()}
            >
                {!data.pages[data.pages.length - 1].pagination.hasNextPage
                    ? 'No more data'
                    : isFetchingNextPage
                    ? 'Loading...'
                    : 'Load More'}
            </button>
        </div>
    );
};

export default FishScore;

'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useCookies } from 'next-client-cookies';
import Swal from 'sweetalert2';
import SpinnerWithText from '../UI/Spinner';
import { getAllFishCandidateApi, selectFishNominateApi } from '@/api/api-nomination';
import ConfirmationModal from '../components/confirmation-modal';
import IGEmbed from '../components/ig-embed/embed';

const FishCandidates = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const queryClient = useQueryClient();
    const { ref, inView } = useInView();
    const [limit, setLimit] = useState(Number(searchParams.get('limit') || 6));
    const [sort, setSort] = useState(searchParams.get('sort') || 'asc');
    const [openModal, setOpenModal] = useState(false);
    const [selectedFishId, setSelectedFishId] = useState('');
    const [isLoading, setLoading] = useState(false);

    const fetchAllFish = async ({ pageParam = 1 }: { pageParam?: number }): Promise<FishPaginationType> => {
        const fishes = await getAllFishCandidateApi(pageParam, limit, sort, authCookie);
        if (fishes.success) return fishes;
        throw new Error('Failed to fetch fish data');
    };

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['allFishCandidates', { limit, sort }],
        queryFn: fetchAllFish,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const params = new URLSearchParams();
        params.set('limit', limit.toString());
        params.set('sort', sort);
        router.replace(`?${params.toString()}`);
    }, [limit, sort, router]);

    useEffect(() => {
        if (data?.pages) {
            const lastPage = data.pages[data.pages.length - 1];
            if (lastPage.data.length === 3) {
                queryClient.invalidateQueries({ queryKey: ['allFishCandidates'] });
            }
        }
    }, [data, limit, queryClient]);

    useEffect(() => {
        if (inView && data?.pages[data.pages.length - 1].pagination.hasNextPage) {
            fetchNextPage();
        }
    }, [inView, data, fetchNextPage]);

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

    const handleModalOpen = (fishId: string) => {
        setSelectedFishId(fishId);
        setOpenModal(true);
    };

    const handleConfirmSelection = async () => {
        setLoading(true);
        try {
            const response = await selectFishNominateApi(selectedFishId, authCookie);
            if (response) {
                queryClient.setQueryData(['allFishCandidates', { limit, sort }], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            data: page.data.map((fish: any) =>
                                fish.fish_id === selectedFishId ? { ...fish, exiting: true } : fish
                            ),
                        })),
                    };
                });

                setTimeout(() => {
                    queryClient.setQueryData(['allFishCandidates', { limit, sort }], (oldData: any) => {
                        if (!oldData) return oldData;
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page: any) => ({
                                ...page,
                                data: page.data.filter((fish: any) => fish.fish_id !== selectedFishId),
                            })),
                        };
                    });
                    queryClient.invalidateQueries({ queryKey: ['allSelectedNominees', { limit, sort }] });
                }, 600);

                showMessage('Fish selected successfully!');
                setOpenModal(false);
            }
        } catch {
            showMessage('Failed to select fish.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!data) {
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {data?.pages.map((page) =>
                    (sort === 'desc' ? [...page.data].reverse() : page.data).map((fish) => (
                        <IGEmbed
                            url={fish.fish_submission_link}
                            key={fish.fish_id}
                            fish={fish}
                            username={fish.user_name}
                            handleModal={handleModalOpen}
                            isLoading={isLoading}
                            buttonText="Select as nominee"
                        />
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

            <ConfirmationModal
                open={openModal}
                setOpen={setOpenModal}
                title="Confirmation"
                mainText="Are you sure you want to select this fish?"
                isLoading={isLoading}
                cancelButton="Cancel"
                confirmButton={isLoading ? 'Submitting...' : 'Yes'}
                handleConfirm={handleConfirmSelection}
            />
        </div>
    );
};

export default FishCandidates;

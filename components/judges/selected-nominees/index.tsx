'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { useRouter, useSearchParams } from 'next/navigation';
import IGEmbed from '../../components/ig-embed/embed';
import { useEffect, useState } from 'react';
import SpinnerWithText from '../../UI/Spinner';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../components/confirmation-modal';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useInView } from 'react-intersection-observer';
import { cancelFishNomineesApi, getAllSelectedFishApi } from '@/api/nomination/api-nomination';
import { fetchOngoingEventPhase } from '@/utils/store-event';

const SelectedFishes = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const user = useSelector((state: IRootState) => state.auth.user);
    const event_reg_phase = useSelector((state: IRootState) => state.event.event_reg_phase);
    const { ref, inView } = useInView();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const queryClient = useQueryClient();
    const [limit, setLimit] = useState(Number(searchParams.get('limit') || 6));
    const [sort, setSort] = useState(searchParams.get('sort') || 'asc');
    const [openModal, setOpenModal] = useState(false);
    const [selectedFishId, setSelectedFishId] = useState('');
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    useEffect(() => {
        if (!event_reg_phase) {
            fetchOngoingEventPhase(authCookie, dispatch);
        }
    }, [event_reg_phase, authCookie, dispatch]);

    const fetchAllFish = async ({ pageParam = 1 }: { pageParam: number }): Promise<FishPaginationType> => {
        const fishes = await getAllSelectedFishApi(user, pageParam, limit, sort, authCookie);
        if (fishes.success) return fishes;
        throw new Error('Failed to fetch fish data');
    };

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['allSelectedNominees', { limit, sort }],
        queryFn: fetchAllFish,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
        enabled: !!user,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
    });

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
                queryClient.invalidateQueries({ queryKey: ['allSelectedNominees', { limit }] });
            }
        }
    }, [data, limit, queryClient, sort]);

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

    const handleOpenModal = (fish_id: string) => {
        setSelectedFishId(fish_id);
        setOpenModal(true);
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const response = await cancelFishNomineesApi(selectedFishId, authCookie);
            if (response.success) {
                queryClient.setQueryData(['allSelectedNominees', { limit, sort }], (oldData: any) => {
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
                    queryClient.setQueryData(['allSelectedNominees', { limit, sort }], (oldData: any) => {
                        if (!oldData) return oldData;
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page: any) => ({
                                ...page,
                                data: page.data.filter((fish: any) => fish.fish_id !== selectedFishId),
                            })),
                        };
                    });

                    queryClient.invalidateQueries({ queryKey: ['allFishCandidates', { limit, sort }] });
                }, 600);

                showMessage('Success remove fish!');
                setOpenModal(false);
            } else {
                showMessage(response.response.data.message, 'error');
                setOpenModal(false);
            }
        } catch {
            showMessage('Failed!', 'error');
        } finally {
            setLoading(false);
        }
    };

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
                        className="rounded bg-dark-light text-black dark:bg-white"
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
                        className="rounded bg-dark-light text-black dark:bg-white"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="asc">Newest</option>
                        <option value="desc">Oldest</option>
                    </select>
                </div>
            </div>
            {data.pages[0].data.length < 1 ? (
                <div className="panel flex h-[50vh] w-full items-center justify-center">
                    <p className="text-danger">No fish selected yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {data?.pages.map((page) =>
                        (sort === 'desc' ? [...page.data].reverse() : page.data).map((fish) => (
                            <IGEmbed
                                url={fish.fish_submission_link}
                                key={fish.fish_id}
                                fish={fish}
                                username={fish.owner_name}
                                handleModal={handleOpenModal}
                                isLoading={isLoading}
                                buttonText="Remove from nominees"
                                eventPhase={event_reg_phase === 'nominate_phase'}
                            />
                        ))
                    )}
                </div>
            )}
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
                mainText="Are you sure?"
                isLoading={isLoading}
                cancelButton="Cancel"
                confirmButton={isLoading ? 'Submitting...' : 'Yes'}
                handleConfirm={handleConfirm}
            />
        </div>
    );
};

export default SelectedFishes;

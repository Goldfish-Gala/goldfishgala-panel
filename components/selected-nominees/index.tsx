'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import IGEmbed from '../components/ig-embed/embed';
import { useEffect, useState } from 'react';
import SpinnerWithText from '../UI/Spinner';
import Swal from 'sweetalert2';
import ConfirmationModal from '../components/confirmation-modal';
import { cancelFishNomineesApi, getAllSelectedFishApi } from '@/api/api-nomination';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';

const SelectedFishes = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const user = useSelector((state: IRootState) => state.auth.user);
    const [isLastPage, setLastPage] = useState(false);
    const [open, setOpen] = useState(false);
    const [fishId, setFishId] = useState('');
    const [isLoading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const fetchAllFish = async ({ pageParam }: { pageParam: number }): Promise<FishCandidateType> => {
        const fishes = await getAllSelectedFishApi(user, pageParam, authCookie);
        if (fishes.success) {
            return fishes;
        }
        throw new Error('No fish data');
    };

    const { data, fetchNextPage } = useInfiniteQuery({
        queryKey: ['allSelectedNominees'],
        queryFn: fetchAllFish,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.length > 0 ? allPages.length + 1 : undefined;
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!user,
    });

    useEffect(() => {
        if (data?.pages) {
            const lastPage = data.pages[data.pages.length - 1];
            if (lastPage.data.length === 0) {
                setLastPage(true);
            }
        }
    }, [data]);

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

    const handleModal = (fish_id: string) => {
        setFishId(fish_id);
        setOpen(true);
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const response = await cancelFishNomineesApi(fishId, authCookie);
            if (response) {
                queryClient.setQueryData(['allSelectedNominees'], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                            ...page,
                            data: page.data.map((fish: any) =>
                                fish.fish_id === fishId ? { ...fish, exiting: true } : fish
                            ),
                        })),
                    };
                });

                setTimeout(() => {
                    queryClient.setQueryData(['allSelectedNominees'], (oldData: any) => {
                        if (!oldData) return oldData;
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page: any) => ({
                                ...page,
                                data: page.data.filter((fish: any) => fish.fish_id !== fishId),
                            })),
                        };
                    });

                    queryClient.invalidateQueries({ queryKey: ['allFishCandidates'] });
                }, 600);

                showMessage('Success!');
                setOpen(false);
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {data?.pages.map((page) =>
                    page.data.map((fish) => (
                        <IGEmbed
                            url={fish.fish_submission_link}
                            key={fish.fish_id}
                            fish={fish}
                            handleModal={handleModal}
                            isLoading={isLoading}
                            buttonText="Remove from nominees"
                        />
                    ))
                )}
            </div>
            <button
                disabled={isLastPage}
                className="btn2 btn-gradient2 mx-auto mt-6 text-base"
                onClick={() => fetchNextPage()}
            >
                {isLastPage ? 'No More Data' : 'Load More'}
            </button>
            <ConfirmationModal
                open={open}
                setOpen={setOpen}
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

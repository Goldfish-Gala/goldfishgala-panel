/* eslint-disable @next/next/no-img-element */
'use client';

import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerWithText from '@/components/UI/Spinner';
import { deleteEvent, getAllEvent, getOneEvent, updateEventIsActive } from '@/api/event-reg/api-event';
import { formatedDate } from '@/utils/date-format';
import IconCircle from '@/components/icon/menu/icon-circle';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import Swal from 'sweetalert2';
import { formatMataUang } from '@/utils/curency-format';
import CreateEventModal from './components-create-cummunity-modal';
import UpdateEventModal from './components-update-event-modal';
import { deleteCommunityApi, getCummunityList } from '@/api/community/api-community';
import IconCopy from '@/components/icon/icon-copy';

const CommunityList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);
    const queryClient = useQueryClient();
    const [group, setGroup] = useState<CommunityType | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [dataChange, setDataChange] = useState(false);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
        Swal.fire({
            toast: true,
            position: 'top',
            icon: type,
            title: msg,
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
    };

    const getAllEvents = async (): Promise<CommunityType[]> => {
        const allCommunity = await getCummunityList(authCookie);
        if (allCommunity.success) {
            return allCommunity.data;
        }
        throw new Error('No community available');
    };

    const { isPending, data, error, refetch } = useQuery({
        queryKey: ['communityList'],
        queryFn: () => getAllEvents(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
    });

    const handleCopy = async (link: string) => {
        if (navigator.clipboard && link) {
            await navigator.clipboard.writeText(link);
            showMessage('Copied!');
        }
    };

    const handleUpdate = async (item: CommunityType) => {
        setGroup(item);
        setOpenUpdateModal(true);
    };

    const deleteEvents = async (id: string) => {
        try {
            const confirmResult = await Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone. Do you want to delete this event?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                preConfirm: async () => {
                    try {
                        const deleteOneEvent = await deleteCommunityApi(authCookie, id);

                        if (deleteOneEvent.success) {
                            return true;
                        } else {
                            Swal.showValidationMessage(
                                deleteOneEvent.response.data.message || 'Failed to delete event.'
                            );
                            return false;
                        }
                    } catch (error: any) {
                        Swal.showValidationMessage(
                            error?.message || 'An unexpected error occurred while deleting the event.'
                        );
                        return false;
                    }
                },
            });

            if (confirmResult.isConfirmed) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Event deleted successfully.',
                    timer: 2000,
                    showConfirmButton: false,
                });
                refetch();
            } else {
                await Swal.fire({
                    icon: 'info',
                    title: 'Cancelled',
                    text: 'The event was not deleted.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (error: any) {
            console.error('Error deleting event:', error);

            await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error?.message || 'An unexpected error occurred while deleting the event.',
            });
        }
    };

    useEffect(() => {
        if (dataChange) {
            refetch();
            setDataChange(false);
        }
    }, [dataChange, refetch]);

    if (isPending) {
        return (
            <div className="flex min-h-[75vh] w-full flex-col items-center justify-center">
                <SpinnerWithText text="Memuat..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[75vh] w-full flex-col items-center justify-center text-red-500">
                <p>Error: {error.message}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-5 flex flex-row items-center justify-between px-3">
                <h6 className="text-lg font-bold">Communities</h6>
                <button type="button" className="btn btn-primary" onClick={() => setOpenModal(true)}>
                    Create New
                </button>
            </div>
            {data.length === 0 ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center font-semibold text-danger">
                    <p className="text-lg font-extrabold capitalize">No data</p>
                    <p className="mt-1 text-sm font-semibold capitalize">No group community available</p>
                </div>
            ) : (
                <div className="xl:grid-4 mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                    {data?.map((item) => {
                        return (
                            <div
                                className="panel flex min-h-[200px] flex-col justify-between font-semibold"
                                key={item.group_community_id}
                            >
                                <div className="flex flex-row justify-between">
                                    <p className="text-xl font-extrabold capitalize text-primary">
                                        {item.group_platform}
                                    </p>
                                    <div className="flex flex-row gap-2">
                                        <div className="group relative">
                                            <button
                                                className="btn2 btn-gradient3 h-7 w-7 p-1"
                                                onClick={() => deleteEvents(item.group_community_id)}
                                            >
                                                <IconTrashLines />
                                            </button>
                                            <span className="absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                Delete
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <input
                                        className="form-input w-full rounded-md bg-white-light p-1 px-2 dark:bg-dark dark:text-white-light"
                                        type="text"
                                        id="invitation-link"
                                        value={item.group_link_invitation}
                                        readOnly
                                    />
                                    <button type="button" onClick={() => handleCopy(item.group_link_invitation)}>
                                        <div
                                            className={`border-1.5 flex gap-1 rounded-md border-white bg-white-light p-1 text-sm text-black hover:bg-dark-light active:scale-90 dark:bg-dark-dark-light dark:text-white dark:hover:bg-white-dark`}
                                        >
                                            <IconCopy />
                                        </div>
                                    </button>
                                </div>
                                <button type="button" className="btn btn-secondary" onClick={() => handleUpdate(item)}>
                                    Update
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            <UpdateEventModal
                open={openUpdateModal}
                setOpen={setOpenUpdateModal}
                item={group}
                setDataChange={setDataChange}
            />
            <CreateEventModal open={openModal} setOpen={setOpenModal} setDataChange={setDataChange} />
        </div>
    );
};

export default CommunityList;

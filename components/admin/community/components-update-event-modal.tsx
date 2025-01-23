'use client';

import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, use, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import Image from 'next/image';
import { formatedDate } from '@/utils/date-format';
import IconVisit from '@/components/icon/icon-visit';
import { blockUserApi, updateAdminUserApi, updateUserApi } from '@/api/user/api-user';
import { useCookies } from 'next-client-cookies';
import Swal from 'sweetalert2';
import { Spinner } from '@/components/UI/Spinner/spinner';
import IconChecks from '@/components/icon/icon-checks';
import { it } from 'node:test';
import { updateCommunityApi } from '@/api/community/api-community';
import { getAllEvent } from '@/api/event-reg/api-event';

interface UpdateEventModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
    item: CommunityType | null;
}

const UpdateEventModal = ({ open, setOpen, item, setDataChange }: UpdateEventModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [event, setEvent] = useState<AllEvents[]>([]);
    const [id, setId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setFetching] = useState(false);
    const [updating, setUpdating] = useState(false);
    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { isDirty },
    } = useForm({
        defaultValues: {
            event_id: '',
            group_platform: '',
            group_link_invitation: '',
        },
    });

    const fetchAllEvent = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getAllEvent(authCookie);
            if (response.data) {
                setEvent(response.data);
                setFetching(false);
            }
        } catch (error) {
            setFetching(false);
        }
    }, [authCookie]);

    useEffect(() => {
        fetchAllEvent();
    }, [fetchAllEvent]);

    useEffect(() => {
        if (item) {
            reset({
                event_id: item.event_id,
                group_platform: item.group_platform,
                group_link_invitation: item.group_link_invitation,
            });
            setId(item.group_community_id);
        }
    }, [open, item, reset]);

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

    const onSubmit = async (formData: { event_id: string; group_platform: string; group_link_invitation: string }) => {
        setUpdating(true);
        const body = {
            event_id: formData.event_id,
            group_platform: formData.group_platform,
            group_link_invitation: formData.group_link_invitation,
        };
        try {
            const response = await updateCommunityApi(authCookie, id, body);
            if (!response.success) {
                showMessage(`Update failed, 'error' `);
                return;
            }
            showMessage('Group Updated Successfully');
            reset({
                event_id: item?.event_id,
                group_platform: item?.group_platform,
                group_link_invitation: item?.group_link_invitation,
            });
            setOpen(false);
            setDataChange((prev) => !prev);
            setUpdating(false);
        } catch (error) {
            console.error(error);
            setUpdating(false);
            showMessage('An error occurred during submission!', 'error');
        }
    };

    return (
        <div className="mb-5">
            <div className="flex flex-wrap items-center justify-center gap-2">
                <div>
                    <Transition appear show={open} as={Fragment}>
                        <Dialog as="div" open={open} onClose={() => setOpen(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0" />
                            </Transition.Child>
                            <div id="zoomIn_up_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                                <div className="flex min-h-screen items-center justify-center px-4">
                                    <Dialog.Panel className="panel animate__animated animate__zoomInUp my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 pb-6 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-end p-2">
                                            <button
                                                onClick={() => setOpen(false)}
                                                type="button"
                                                className="text-white-dark hover:text-dark"
                                            >
                                                <IconX />
                                            </button>
                                        </div>
                                        <div className="p-2 px-8">
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium">Event ID</label>
                                                    <div className="pb-1 text-black">
                                                        <Controller
                                                            name="event_id"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    id="event_id"
                                                                    {...field}
                                                                    options={event.map((item) => ({
                                                                        value: item.event_id,
                                                                        label: item.event_id,
                                                                    }))}
                                                                    value={
                                                                        event
                                                                            .map((item) => ({
                                                                                value: item.event_id,
                                                                                label: item.event_id,
                                                                            }))
                                                                            .find(
                                                                                (option) => option.value === field.value
                                                                            ) || null
                                                                    }
                                                                    onChange={(selectedOption: any) => {
                                                                        field.onChange(selectedOption.value);
                                                                    }}
                                                                    menuPortalTarget={document.body}
                                                                    styles={{
                                                                        menuPortal: (base: any) => ({
                                                                            ...base,
                                                                            zIndex: 999,
                                                                        }),
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium">Platform</label>
                                                    <div className="pb-1 text-black">
                                                        <Controller
                                                            name="group_platform"
                                                            control={control}
                                                            render={({ field }) => {
                                                                const options = [
                                                                    { value: 'whatsapp', label: 'Whatsapp' },
                                                                    { value: 'telegram', label: 'Telegram' },
                                                                ];
                                                                const selectedOption = options.find(
                                                                    (option) => option.value === field.value
                                                                );

                                                                return (
                                                                    <Select
                                                                        id="group_platform"
                                                                        {...field}
                                                                        options={options}
                                                                        value={selectedOption}
                                                                        onChange={(selectedOption: any) => {
                                                                            field.onChange(selectedOption?.value);
                                                                        }}
                                                                        menuPortalTarget={document.body}
                                                                        styles={{
                                                                            menuPortal: (base: any) => ({
                                                                                ...base,
                                                                                zIndex: 999,
                                                                            }),
                                                                        }}
                                                                    />
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium">Invitation link</label>
                                                    <input
                                                        type="text"
                                                        {...register('group_link_invitation', {
                                                            required: 'Invitation link is required',
                                                        })}
                                                        className="w-full rounded border px-3 py-2"
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        className="rounded bg-gray-300 px-4 py-2"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn-primary rounded px-4 py-2 text-white"
                                                        disabled={updating || !isDirty}
                                                    >
                                                        {updating ? 'Submitting...' : 'Submit'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Dialog.Panel>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </div>
        </div>
    );
};

export default UpdateEventModal;

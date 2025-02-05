import { getAllEventPrice } from '@/api/event-price/api-event-price';
import { createEvent, getAllEvent } from '@/api/event-reg/api-event';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { getAllEventRegs } from '@/api/event-reg/api-event-reg';
import { formatedDate } from '@/utils/date-format';
import { formatMataUang } from '@/utils/curency-format';
import { useSearchParams } from 'next/navigation';
import { createCommunityApi } from '@/api/community/api-community';
import SpinnerWithText from '@/components/UI/Spinner';
import { get } from 'lodash';

interface CreateEventModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
}

const CreateEventModal = ({ open, setOpen, setDataChange }: CreateEventModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const [isFetching, setFetching] = useState(false);
    const [event, setEvent] = useState<AllEvents[]>([]);
    const { register, handleSubmit, reset, getValues, watch, formState, control } = useForm({});

    useEffect(() => {
        if (open) {
            reset({
                event_id: '',
                group_platform: '',
                group_link_invitation: '',
            });
        }
    }, [open]);

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

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await createCommunityApi(authCookie, {
                event_id: data.event_id,
                group_platform: data.group_platform,
                group_link_invitation: data.group_link_invitation,
            });
            if (response.success) {
                Swal.fire('Success', 'Group community created successfully!', 'success');
                reset();
                setDataChange((prev) => !prev);
                setOpen(false);
            }
        } catch (error: any) {
            Swal.fire(error.message, 'Failed to create event.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const eventId = watch('event_id');
    const platform = watch('group_platform');
    const link = watch('group_link_invitation');

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
                                        <div className="flex items-center justify-between px-4 py-3">
                                            <h5 className="text-lg font-semibold">Create Group</h5>
                                            <button onClick={() => setOpen(false)}>
                                                <IconX />
                                            </button>
                                        </div>
                                        {isFetching ? (
                                            <div className="flex min-h-[500px] w-full flex-col items-center justify-center">
                                                <SpinnerWithText text="Memuat..." />
                                            </div>
                                        ) : (
                                            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-4">
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
                                                    {errors.event_id && (
                                                        <p className="text-sm text-red-500">{errors.event_id}</p>
                                                    )}
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

                                                                return (
                                                                    <Select
                                                                        id="group_platform"
                                                                        {...field}
                                                                        options={options}
                                                                        value={
                                                                            options.find(
                                                                                (option) => option.value === field.value
                                                                            ) || null
                                                                        }
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
                                                    {errors.event_id && (
                                                        <p className="text-sm text-red-500">{errors.event_id}</p>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium">Invitation link</label>
                                                    <input
                                                        type="text"
                                                        {...register('group_link_invitation', {
                                                            required: 'Invitation link is required',
                                                        })}
                                                        className="w-full rounded border px-3 py-2 text-dark"
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
                                                        disabled={
                                                            isLoading ||
                                                            eventId === '' ||
                                                            platform === '' ||
                                                            link === ''
                                                        }
                                                    >
                                                        {isLoading ? 'Submitting...' : 'Submit'}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
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

export default CreateEventModal;

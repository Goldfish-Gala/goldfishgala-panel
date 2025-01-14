import { getAllEventPrice } from '@/api/event-price/api-event-price';
import { updateEvent } from '@/api/event-reg/api-event';
import { getAllEventRegs } from '@/api/event-reg/api-event-reg';
import IconX from '@/components/icon/icon-x';
import { formatMataUang } from '@/utils/curency-format';
import { Transition, Dialog } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { formatDateToString, formatedDate, isoDateToString } from '@/utils/date-format';
import IconCalendar from '@/components/icon/icon-calendar';
import DatePicker from 'react-datepicker';
import { useSearchParams } from 'next/navigation';

interface UpdateEventModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
    eventData: AllEvents;
}

const UpdateEventModal = ({ open, setOpen, setDataChange, eventData }: UpdateEventModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const [isFetching, setFetching] = useState(false);
    const [eventRegs, setEventRegs] = useState<EventReg[] | null>(null);
    const [eventPrices, setEventPrices] = useState<EventPriceType[] | null>(null);
    const [sort, setSort] = useState(searchParams.get('sort') || 'asc');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { isDirty },
    } = useForm({
        defaultValues: {
            event_name: '',
            event_desc: '',
            event_start_date: '',
            event_end_date: '',
            event_price_ids: [''],
            event_reg_id: '',
        },
    });

    React.useEffect(() => {
        if (eventData) {
            reset({
                event_name: eventData.event_name || '',
                event_desc: eventData.event_desc || '',
                event_start_date: isoDateToString(eventData.event_start_date) || '',
                event_end_date: isoDateToString(eventData.event_end_date) || '',
                event_price_ids: eventData.event_price_ids || '',
                event_reg_id: eventData.event_reg_id || '',
            });
        }
    }, [eventData, reset]);

    const fetchAllEventRegs = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getAllEventRegs(1, 1000, 'asc', authCookie);
            if (response.success) {
                setEventRegs(response.data);
                setFetching(false);
            }
        } catch (error) {
            setFetching(false);
        }
    }, [authCookie]);

    const fetchAllEventPrices = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getAllEventPrice(sort, authCookie);
            if (response.success) {
                setEventPrices(response.data);
                setFetching(false);
            }
        } catch (error) {
            setFetching(false);
        }
    }, [authCookie]);

    useEffect(() => {
        fetchAllEventRegs();
        fetchAllEventPrices();
    }, [fetchAllEventRegs, fetchAllEventPrices]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValue(name as any, value, { shouldDirty: true });
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: undefined,
        }));
    };

    const onSubmit = async (data: {
        event_name: string;
        event_desc: string;
        event_start_date: string;
        event_end_date: string;
        event_price_ids: string[];
        event_reg_id: string;
    }) => {
        setLoading(true);
        try {
            if (!data.event_price_ids || data.event_price_ids.length === 0) {
                data.event_price_ids = eventData.event_prices.map((price) => price.event_price_id);
            }
            const response = await updateEvent(
                eventData.event_id,
                {
                    event_name: data.event_name,
                    event_desc: data.event_desc,
                    event_start_date: new Date(data.event_start_date).toISOString(),
                    event_end_date: new Date(data.event_end_date).toISOString(),
                    event_price_ids: data.event_price_ids,
                    event_reg_id: data.event_reg_id,
                },
                authCookie
            );
            if (response.success === false) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: response.data.message || 'Failed to update event.',
                });
            }
            Swal.fire('Success', 'Event updated successfully!', 'success');
            reset();
            setDataChange((prev) => !prev);
            queryClient.invalidateQueries({ queryKey: ['allEvent'] });
            setOpen(false);
        } catch (error) {
            Swal.fire('Error', 'Failed to update event.', 'error');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" open={open} onClose={() => setOpen(false)}>
                <div className="fixed inset-0 z-20 bg-black bg-opacity-60" />
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                    <Dialog.Panel className="w-full max-w-md rounded-lg bg-white shadow-lg">
                        <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
                            <h5 className="text-lg font-semibold">Update Event</h5>
                            <button onClick={() => setOpen(false)}>
                                <IconX />
                            </button>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Name</label>
                                <input
                                    type="text"
                                    {...register('event_name', { required: 'Name is required' })}
                                    className="w-full rounded border px-3 py-2"
                                />
                                {errors.event_name && <p className="text-sm text-red-500">{errors.event_name}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Description</label>
                                <input
                                    type="text"
                                    {...register('event_desc', { required: 'Description is required' })}
                                    className="w-full rounded border px-3 py-2"
                                />
                                {errors.event_desc && <p className="text-sm text-red-500">{errors.event_desc}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Start Date</label>
                                <input
                                    type="date"
                                    {...register('event_start_date', { required: 'Start date is required' })}
                                    className="w-full rounded border px-3 py-2"
                                    onChange={handleDateChange}
                                />
                                {errors.event_start_date && (
                                    <p className="text-sm text-red-500">{errors.event_start_date}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event End Date</label>
                                <input
                                    type="date"
                                    {...register('event_end_date', { required: 'End date is required' })}
                                    className="w-full rounded border px-3 py-2"
                                    onChange={handleDateChange}
                                />
                                {errors.event_end_date && (
                                    <p className="text-sm text-red-500">{errors.event_end_date}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Registration</label>
                                <Select
                                    options={
                                        eventRegs?.map((eventReg) => ({
                                            value: eventReg.event_reg_id,
                                            label: (
                                                <div className="text-sm">
                                                    <div>Status: {eventReg.event_reg_status_name}</div>
                                                    <div>Phase: {eventReg.event_reg_phase_name}</div>
                                                    <div>
                                                        Period: {formatedDate(eventReg.event_reg_start_date)} -{' '}
                                                        {formatedDate(eventReg.event_reg_end_date)}
                                                    </div>
                                                </div>
                                            ),
                                        })) || []
                                    }
                                    placeholder="Select Event Reg"
                                    defaultValue={
                                        eventRegs?.find(
                                            (eventReg) => eventReg.event_reg_id === eventData.event_reg_id
                                        ) && {
                                            value: eventData.event_reg_id,
                                            label: `${
                                                eventRegs?.find(
                                                    (eventReg) => eventReg.event_reg_id === eventData.event_reg_id
                                                )?.event_reg_status_name
                                            }, 
                                                    ${
                                                        eventRegs?.find(
                                                            (eventReg) =>
                                                                eventReg.event_reg_id === eventData.event_reg_id
                                                        )?.event_reg_phase_name
                                                    }, 
                                                    ${formatedDate(
                                                        eventRegs?.find(
                                                            (eventReg) =>
                                                                eventReg.event_reg_id === eventData.event_reg_id
                                                        )?.event_reg_start_date
                                                    )} - 
                                                    ${formatedDate(
                                                        eventRegs?.find(
                                                            (eventReg) =>
                                                                eventReg.event_reg_id === eventData.event_reg_id
                                                        )?.event_reg_end_date
                                                    )}`,
                                        }
                                    }
                                    isSearchable={false}
                                    onChange={(selectedOption: any) => setValue('event_reg_id', selectedOption?.value)}
                                    styles={{
                                        menu: (provided: any) => ({
                                            ...provided,
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                        }),
                                        menuList: (provided: any) => ({
                                            ...provided,
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                        }),
                                    }}
                                />
                                {errors.event_reg_id && <p className="text-sm text-red-500">{errors.event_reg_id}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Prices</label>
                                <Select
                                    options={
                                        eventPrices?.map((eventPrice) => ({
                                            value: eventPrice.event_price_id,
                                            label: `${eventPrice.event_price_name}: ${formatMataUang(
                                                eventPrice.event_price_amount
                                            )}`,
                                        })) || []
                                    }
                                    placeholder="Select Event Prices"
                                    defaultValue={
                                        eventData?.event_prices?.map((eventPrice) => ({
                                            value: eventPrice.event_price_id,
                                            label: `${eventPrice.event_price_name}: ${formatMataUang(
                                                eventPrice.event_price_amount
                                            )}`,
                                        })) || []
                                    }
                                    isMulti={true}
                                    onChange={(selectedOption: any) => {
                                        setValue(
                                            'event_price_ids',
                                            selectedOption.map((option: any) => option.value)
                                        );
                                    }}
                                    styles={{
                                        menu: (provided: any) => ({
                                            ...provided,
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                        }),
                                        menuList: (provided: any) => ({
                                            ...provided,
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                        }),
                                    }}
                                />
                                {errors.event_price_id && (
                                    <p className="text-sm text-red-500">{errors.event_price_id}</p>
                                )}
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
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
};

export default UpdateEventModal;

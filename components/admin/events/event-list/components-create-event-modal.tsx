import { getAllEventPrice } from '@/api/event-price/api-event-price';
import { createEvent } from '@/api/event-reg/api-event';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { getAllEventRegs } from '@/api/event-reg/api-event-reg';
import { formatedDate } from '@/utils/date-format';
import { formatMataUang } from '@/utils/curency-format';

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
    const [eventRegs, setEventRegs] = useState<EventReg[] | null>(null);
    const [eventPrices, setEventPrices] = useState<EventPriceType[] | null>(null);

    const { register, handleSubmit, reset, setValue, formState } = useForm({
        defaultValues: {
            event_name: '',
            event_desc: '',
            event_start_date: '',
            event_end_date: '',
            event_price_ids: [''],
            event_reg_id: ''
        },
    });

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
            const response = await getAllEventPrice(authCookie);
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
    
    const onSubmit = async (data: { event_name: string; event_desc: string; event_start_date: string, event_end_date: string, event_price_ids: string[], event_reg_id: string }) => {
        setLoading(true);
        try {
            const response = await createEvent(
                {
                    event_name: data.event_name,
                    event_desc: data.event_desc,
                    event_start_date: data.event_start_date,
                    event_end_date: data.event_end_date,
                    event_price_ids: data.event_price_ids,
                    event_reg_id: data.event_reg_id
                },
                authCookie
            );
            Swal.fire('Success', 'Event created successfully!', 'success');
            reset();
            setDataChange((prev) => !prev); 
            setOpen(false);
        } catch (error) {
            Swal.fire('Error', 'Failed to create event.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-5">
            <div className="flex flex-wrap items-center justify-center gap-2">
                <div>
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" open={open} onClose={() => setOpen(false)}>
                <div className="fixed inset-0 z-20 bg-black bg-opacity-60" />
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
                            <h5 className="text-lg font-semibold">Create Event</h5>
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
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_name && (
                                    <p className="text-red-500 text-sm">{errors.event_name}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Description</label>
                                <input
                                    type="text"
                                    {...register('event_desc', { required: 'Description is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_desc && (
                                    <p className="text-red-500 text-sm">{errors.event_desc}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Start Date</label>
                                <input
                                    type="date"
                                    {...register('event_start_date', { required: 'Start date is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_start_date && (
                                    <p className="text-red-500 text-sm">{errors.event_start_date}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event End Date</label>
                                <input
                                    type="date"
                                    {...register('event_end_date', { required: 'End date is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_end_date && (
                                    <p className="text-red-500 text-sm">{errors.event_end_date}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Prices</label>
                                <Select
                                    options={
                                        eventPrices?.map((eventPrice) => ({
                                        value: eventPrice.event_price_id,
                                        label: `${eventPrice.event_price_name}: ${formatMataUang(eventPrice.event_price_amount)}`,
                                        })) || []
                                    }
                                    placeholder="Select Event Prices"
                                    isMulti={true}
                                    onChange={(selectedOption: any) => {
                                        setValue('event_price_ids', selectedOption.map((option: any) => option.value));
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

                                {errors.event_reg_id && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_id}</p>
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
                                </div>
                                {errors.event_reg_id && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_id}</p>
                                )}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 rounded"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white btn-primary rounded"
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
        </div>
        </div>
        </div>
    );
};

export default CreateEventModal;

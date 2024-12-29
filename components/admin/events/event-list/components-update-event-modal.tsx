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
import { formatDateToString, formatedDate } from '@/utils/date-format';
import IconCalendar from '@/components/icon/icon-calendar';
import DatePicker from 'react-datepicker';

interface UpdateEventModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
    eventData: AllEvents
}

const UpdateEventModal = ({ open, setOpen, setDataChange, eventData }: UpdateEventModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const [isFetching, setFetching] = useState(false);
    const [eventRegs, setEventRegs] = useState<EventReg[] | null>(null);
    const [eventPrices, setEventPrices] = useState<EventPriceType[] | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(new Date())
    const [endDate, setEndDate] = useState<Date | null>(new Date())
    const [startDateOpen, setStartDateOpen] = useState(false)
    const [endDateOpen, setEndDateOpen] = useState(false)
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
    
    React.useEffect(() => {
        if (eventData) {
            reset({
                event_name: eventData.event_name || '',
                event_desc: eventData.event_desc || '',
                event_start_date: eventData.event_start_date || '',
                event_end_date: eventData.event_end_date || '',
                event_price_ids: eventData.event_price_ids || '',
                event_reg_id: eventData.event_reg_id || ''
            });
            setStartDate(new Date(eventData.event_start_date!))
            setEndDate(new Date(eventData.event_end_date!))
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
    
    const handleStartDate = (date: any) => {
        setStartDate(date)
        setStartDateOpen(!startDateOpen)
        setValue('event_start_date', date.toISOString(), { shouldDirty: true })
    }

    const handleEndDate = (date: any) => {
        setEndDate(date)
        setEndDateOpen(!endDateOpen)
        setValue('event_end_date', date.toISOString(), { shouldDirty: true })
    }

    React.useEffect(() => {
        if (!open) {
            setStartDateOpen(false)
            setEndDateOpen(false)
        }
    }, [open]);

    const onSubmit = async (data: { event_name: string; event_desc: string; event_start_date: string, event_end_date: string, event_price_ids: string[], event_reg_id: string }) => {
        setLoading(true);
        try {
            const response = await updateEvent(
                eventData.event_id,
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
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
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
                                        type="text"

                                        {...register('event_start_date', { required: 'Start Date is required' })}
                                        className="w-full px-3 py-2 border rounded hidden"
                                    />
                                    <div className='relative'>
                                        <input 
                                            name='event-reg-start-date-show'
                                            value={formatDateToString(startDate)}
                                            className="w-full px-3 py-2 border rounded"
                                        />
                                        <span className='absolute end-4 top-1/2 -translate-y-1/2'>
                                        {startDateOpen ? (
                                            <button type='button' className='pt-2' onClick={() => setStartDateOpen(false)}>
                                                <IconCalendar />
                                            </button>
                                            ) : (
                                            <button type='button' className='pt-2' onClick={() => setStartDateOpen(true)}>
                                                <IconCalendar />
                                            </button>
                                        )}
                                        </span>
                                        {startDateOpen && (
                                        <div className="absolute top-full right-0 mt-2 z-50">
                                                <DatePicker 
                                                    selected={startDate} 
                                                    onChange={(date) => handleStartDate(date)} 
                                                    inline 
                                                    className="bg-white border rounded shadow-lg"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {errors.event_start_date && (
                                        <p className="text-red-500 text-sm">{errors.event_start_date}</p>
                                    )}
                                </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event End Date</label>
                                <input
                                    type="text"

                                    {...register('event_end_date', { required: 'End Date is required' })}
                                    className="w-full px-3 py-2 border rounded hidden"
                                />
                                <div className='relative'>
                                    <input 
                                        name='event-reg-end-date-show'
                                        value={formatDateToString(endDate)}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                    <span className='absolute end-4 top-1/2 -translate-y-1/2'>
                                    {endDateOpen ? (
                                        <button type='button' className='pt-2' onClick={() => setEndDateOpen(false)}>
                                            <IconCalendar />
                                        </button>
                                        ) : (
                                        <button type='button' className='pt-2' onClick={() => setEndDateOpen(true)}>
                                            <IconCalendar />
                                        </button>
                                    )}
                                    </span>
                                    {endDateOpen && (
                                    <div className="absolute top-full right-0 mt-2 z-50">
                                            <DatePicker 
                                                selected={endDate} 
                                                onChange={(date) => handleEndDate(date)} 
                                                inline 
                                                className="bg-white border rounded shadow-lg"
                                            />
                                        </div>
                                    )}
                                </div>
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
                                    defaultValue={ 
                                        eventData?.event_prices?.map((eventPrice) => ({
                                        value: eventPrice.event_price_id,
                                        label: `${eventPrice.event_price_name}: ${formatMataUang(eventPrice.event_price_amount)}`
                                        })) || [] 
                                    }
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
                                            label: `${eventReg.event_reg_status_code}, ${eventReg.event_reg_phase_code}, ${formatedDate(eventReg.event_reg_start_date)} - ${formatedDate(eventReg.event_reg_end_date)}`,
                                        })) || []
                                    }
                                    placeholder="Select Event Reg"
                                    defaultValue={
                                        eventRegs?.find((eventReg) => eventReg.event_reg_id === eventData.event_reg_id) && {
                                            value: eventData.event_reg_id,
                                            label: `${eventRegs?.find((eventReg) => eventReg.event_reg_id === eventData.event_reg_id)?.event_reg_status_code}, 
                                                    ${eventRegs?.find((eventReg) => eventReg.event_reg_id === eventData.event_reg_id)?.event_reg_phase_code}, 
                                                    ${formatedDate(eventRegs?.find((eventReg) => eventReg.event_reg_id === eventData.event_reg_id)?.event_reg_start_date)} - 
                                                    ${formatedDate(eventRegs?.find((eventReg) => eventReg.event_reg_id === eventData.event_reg_id)?.event_reg_end_date)}`
                                        }
                                    }
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
                                {errors.event_reg_id && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_id}</p>
                                )}
                            </div>
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
    );
};

export default UpdateEventModal;

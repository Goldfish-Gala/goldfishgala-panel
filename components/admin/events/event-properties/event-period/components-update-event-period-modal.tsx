import { updateEventPeriod } from '@/api/event-reg/api-event-reg';
import IconCalendar from '@/components/icon/icon-calendar';
import IconX from '@/components/icon/icon-x';
import { formatDateToString } from '@/utils/date-format';
import { Transition, Dialog } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, useRef, useState } from 'react';
import DatePicker from "react-datepicker";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

interface UpdateEventPeriodModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
    eventPeriodData: EventRegPeriod
}

const UpdateEventPeriodModal = ({ open, setOpen, setDataChange, eventPeriodData }: UpdateEventPeriodModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const [startDate, setStartDate] = useState<Date | null>(new Date())
    const [endDate, setEndDate] = useState<Date | null>(new Date())
    const [startDateOpen, setStartDateOpen] = useState(false)
    const [endDateOpen, setEndDateOpen] = useState(false)
    const { register, handleSubmit, reset, setValue, formState: {isDirty} } = useForm({
        defaultValues: {
            event_reg_start_date: '',
            event_reg_end_date: '',
        },
    });
    
    React.useEffect(() => {
        if (eventPeriodData) {
            reset({
                event_reg_start_date: eventPeriodData.event_reg_start_date || '',
                event_reg_end_date: eventPeriodData.event_reg_end_date || '',
            });
            setStartDate(new Date(eventPeriodData.event_reg_start_date!))
            setEndDate(new Date(eventPeriodData.event_reg_end_date!))
        }
    }, [eventPeriodData, reset]);

    const handleStartDate = (date: any) => {
        setStartDate(date)
        setStartDateOpen(!startDateOpen)
        setValue('event_reg_start_date', date.toISOString(), { shouldDirty: true })
    }

    const handleEndDate = (date: any) => {
        setEndDate(date)
        setEndDateOpen(!endDateOpen)
        setValue('event_reg_end_date', date.toISOString(), { shouldDirty: true })
    }

    React.useEffect(() => {
        if (!open) {
            setStartDateOpen(false)
            setEndDateOpen(false)
        }
    }, [open]);

    const onSubmit = async () => {
        setLoading(true);
        try {
            const response = await updateEventPeriod(
                eventPeriodData.event_reg_period_id,
                {
                    event_reg_start_date: startDate?.toISOString(),
                    event_reg_end_date: endDate?.toISOString(),
                },
                authCookie
            );
            if (response.success === false) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: response.data.message || 'Failed to update event reg period.',
                  });
            }
            Swal.fire('Success', 'Event reg period updated successfully!', 'success');
            reset();
            setDataChange((prev) => !prev); 
            queryClient.invalidateQueries({ queryKey: ['allEventPeriod'] });
            setOpen(false);
        } catch (error) {
            Swal.fire('Error', 'Failed to update event period.', 'error');
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
                            <h5 className="text-lg font-semibold">Update Event Period</h5>
                            <button onClick={() => setOpen(false)}>
                                <IconX />
                            </button>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="relative p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Reg Period Start Date</label>
                                <input
                                    type="text"

                                    {...register('event_reg_start_date', { required: 'Start Date is required' })}
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
                                {errors.event_price_code && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_start_date}</p>
                                )}
                            </div>
                            <input
                                type="text"

                                {...register('event_reg_end_date', { required: 'End Date is required' })}
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
                            <div className="flex justify-end gap-2 mt-5">
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
                                    disabled={isLoading || !isDirty}
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

export default UpdateEventPeriodModal;

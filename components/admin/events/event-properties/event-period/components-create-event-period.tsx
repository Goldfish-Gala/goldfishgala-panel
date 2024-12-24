import { createEventPeriod } from '@/api/event-reg/api-event-reg';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

interface CreateEventRegPeriodModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
}

const CreateEventPeriodModal = ({ open, setOpen, setDataChange }: CreateEventRegPeriodModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    const { register, handleSubmit, reset, formState } = useForm({
        defaultValues: {
            event_reg_start_date: '',
            event_reg_end_date: '',
        },
    });

    const onSubmit = async (data: { event_reg_start_date: string; event_reg_end_date: string; }) => {
        setLoading(true);
        try {
            const response = await createEventPeriod(
                {
                    event_reg_start_date: data.event_reg_start_date,
                    event_reg_end_date: data.event_reg_end_date,
                },
                authCookie
            );
            Swal.fire('Success', 'Event Reg Period created successfully!', 'success');
            reset();
            setDataChange((prev) => !prev); 
            setOpen(false);
        } catch (error) {
            Swal.fire('Error', 'Failed to create event Reg Period.', 'error');
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
                            <h5 className="text-lg font-semibold">Create Event Period</h5>
                            <button onClick={() => setOpen(false)}>
                                <IconX />
                            </button>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Reg Start Date</label>
                                <input
                                    type="date"
                                    {...register('event_reg_start_date', { required: 'Start Date is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_reg_start_date && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_start_date}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Reg End Date</label>
                                <input
                                    type="date"
                                    {...register('event_reg_end_date', { required: 'End Date is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_reg_end_date && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_end_date}</p>
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

export default CreateEventPeriodModal;

import { updateEventStatus } from '@/api/event-reg/api-event-reg';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

interface UpdateEventStatusModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
    eventStatusData: EventRegStatus
}

const UpdateEventStatusModal = ({ open, setOpen, setDataChange, eventStatusData }: UpdateEventStatusModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const { register, handleSubmit, reset, formState } = useForm({
        defaultValues: {
            event_reg_status_code: '',
            event_reg_status_name: '',
            event_reg_status_desc: '',
        },
    });
    
    React.useEffect(() => {
        if (eventStatusData) {
            reset({
                event_reg_status_code: eventStatusData.event_reg_status_code || '',
                event_reg_status_name: eventStatusData.event_reg_status_name || '',
                event_reg_status_desc: eventStatusData.event_reg_status_desc || '',
            });
        }
    }, [eventStatusData, reset]);
    const onSubmit = async (data: { event_reg_status_code: string; event_reg_status_name: string; event_reg_status_desc: any }) => {
        setLoading(true);
        try {
            const response = await updateEventStatus(
                eventStatusData.event_reg_status_id,
                {
                    event_reg_status_code: data.event_reg_status_code,
                    event_reg_status_name: data.event_reg_status_name,
                    event_reg_status_desc: data.event_reg_status_desc,
                },
                authCookie
            );
            if (response.success === false) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: response.data.message || 'Failed to update event reg status.',
                  });
            }
            Swal.fire('Success', 'Event reg status updated successfully!', 'success');
            reset();
            setDataChange((prev) => !prev); 
            queryClient.invalidateQueries({ queryKey: ['allEventStatus'] });
            setOpen(false);
        } catch (error) {
            Swal.fire('Error', 'Failed to update event status.', 'error');
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
                            <h5 className="text-lg font-semibold">Update Event Status</h5>
                            <button onClick={() => setOpen(false)}>
                                <IconX />
                            </button>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Status Code</label>
                                <input
                                    type="text"

                                    {...register('event_reg_status_code', { required: 'Code is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_price_code && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_status_code}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Status Name</label>
                                <input
                                    type="text"
                                    {...register('event_reg_status_name', { required: 'Name is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_reg_status_name && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_status_name}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Status Description</label>
                                <input
                                    type="text"
                                    step="0.01"
                                    {...register('event_reg_status_desc', { required: 'Description is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_reg_status_desc && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_status_desc}</p>
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

export default UpdateEventStatusModal;

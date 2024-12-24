import { updateEventPrice } from '@/api/event-price/api-event-price';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

interface UpdateEventPriceModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
    eventPriceData: EventPriceType
}

const UpdateEventPriceModal = ({ open, setOpen, setDataChange, eventPriceData }: UpdateEventPriceModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const { register, handleSubmit, reset, formState } = useForm({
        defaultValues: {
            event_price_code: '',
            event_price_name: '',
            event_price_amount: 0,
        },
    });
    
    React.useEffect(() => {
        if (eventPriceData) {
            reset({
                event_price_code: eventPriceData.event_price_code || '',
                event_price_name: eventPriceData.event_price_name || '',
                event_price_amount: eventPriceData.event_price_amount || 0,
            });
        }
    }, [eventPriceData, reset]);
    const onSubmit = async (data: { event_price_code: string; event_price_name: string; event_price_amount: any }) => {
        setLoading(true);
        try {
            const response = await updateEventPrice(
                eventPriceData.event_price_id,
                {
                    event_price_code: data.event_price_code,
                    event_price_name: data.event_price_name,
                    event_price_amount: parseFloat(data.event_price_amount),
                },
                authCookie
            );
            if (response.success === false) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: response.data.message || 'Failed to update event price.',
                  });
            }
            Swal.fire('Success', 'Event price updated successfully!', 'success');
            reset();
            setDataChange((prev) => !prev); 
            queryClient.invalidateQueries({ queryKey: ['allEventPrices'] });
            setOpen(false);
        } catch (error) {
            Swal.fire('Error', 'Failed to update event price.', 'error');
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
                            <h5 className="text-lg font-semibold">Update Event Price</h5>
                            <button onClick={() => setOpen(false)}>
                                <IconX />
                            </button>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Price Code</label>
                                <input
                                    type="text"

                                    {...register('event_price_code', { required: 'Code is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_price_code && (
                                    <p className="text-red-500 text-sm">{errors.event_price_code}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Price Name</label>
                                <input
                                    type="text"
                                    {...register('event_price_name', { required: 'Name is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_price_name && (
                                    <p className="text-red-500 text-sm">{errors.event_price_name}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Price Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('event_price_amount', { required: 'Amount is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_price_amount && (
                                    <p className="text-red-500 text-sm">{errors.event_price_amount}</p>
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

export default UpdateEventPriceModal;

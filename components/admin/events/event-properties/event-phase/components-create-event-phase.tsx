import { createEventPhase } from '@/api/event-reg/api-event-reg';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

interface CreateEventRegPhaseModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
}

const CreateEventPhaseModal = ({ open, setOpen, setDataChange }: CreateEventRegPhaseModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    const { register, handleSubmit, reset, formState } = useForm({
        defaultValues: {
            event_reg_phase_code: '',
            event_reg_phase_name: '',
            event_reg_phase_desc: '',
        },
    });

    const onSubmit = async (data: { event_reg_phase_code: string; event_reg_phase_name: string; event_reg_phase_desc: string }) => {
        setLoading(true);
        try {
            const response = await createEventPhase(
                {
                    event_reg_phase_code: data.event_reg_phase_code,
                    event_reg_phase_name: data.event_reg_phase_name,
                    event_reg_phase_desc: data.event_reg_phase_desc,
                },
                authCookie
            );
            Swal.fire('Success', 'Event Reg Phase created successfully!', 'success');
            reset();
            setDataChange((prev) => !prev); 
            setOpen(false);
        } catch (error) {
            Swal.fire('Error', 'Failed to create event Reg Phase.', 'error');
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
                            <h5 className="text-lg font-semibold">Create Event Phase</h5>
                            <button onClick={() => setOpen(false)}>
                                <IconX />
                            </button>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Reg Phase Code</label>
                                <input
                                    type="text"
                                    {...register('event_reg_phase_code', { required: 'Code is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_reg_phase_code && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_phase_code}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Reg Phase Name</label>
                                <input
                                    type="text"
                                    {...register('event_reg_phase_name', { required: 'Name is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_reg_phase_name && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_phase_name}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Reg Phase Description</label>
                                <input
                                    type="text"
                                    step="0.01"
                                    {...register('event_reg_phase_desc', { required: 'Description is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.event_reg_phase_desc && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_phase_desc}</p>
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

export default CreateEventPhaseModal;

import { createEventReg, getAllEventPeriods, getAllEventPhases, getAllEventStatuses } from '@/api/event-reg/api-event-reg';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { formatedDate } from '@/utils/date-format';

interface CreateEventRegRegModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
}

const CreateEventRegModal = ({ open, setOpen, setDataChange }: CreateEventRegRegModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState(false);
    const [eventStatuses, setEventStatuses] = useState<EventRegStatus[] | null>(null);
    const [eventPhases, setEventPhases] = useState<EventRegPhase[] | null>(null);
    const [eventPeriods, setEventPeriods] = useState<EventRegPeriod[] | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const [isFetching, setFetching] = useState(false);

    const { register, handleSubmit, reset, setValue, formState } = useForm({
        defaultValues: {
            event_reg_status_id: '',
            event_reg_phase_id: '',
            event_reg_period_id: '',
        },
    });

    const fetchAllEventStatuses = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getAllEventStatuses(authCookie);
            if (response.success) {
                setEventStatuses(response.data);
                setFetching(false);
            }
        } catch (error) {
            setFetching(false);
        }
    }, [authCookie]);

    const fetchAllEventPhases = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getAllEventPhases(authCookie);
            if (response.success) {
                setEventPhases(response.data);
                setFetching(false);
            }
        } catch (error) {
            setFetching(false);
        }
    }, [authCookie]);

    const fetchAllEventPeriods = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getAllEventPeriods(authCookie);
            if (response.success) {
                setEventPeriods(response.data);
                setFetching(false);
            }
        } catch (error) {
            setFetching(false);
        }
    }, [authCookie]);

    useEffect(() => {
        fetchAllEventStatuses();
        fetchAllEventPhases();
        fetchAllEventPeriods();
    }, [fetchAllEventStatuses, fetchAllEventPhases, fetchAllEventPeriods]);


    const onSubmit = async (data: { event_reg_status_id: string; event_reg_phase_id: string; event_reg_period_id: string }) => {
        setLoading(true);
        try {
            const response = await createEventReg(
                {
                    event_reg_status_id: data.event_reg_status_id,
                    event_reg_phase_id: data.event_reg_phase_id,
                    event_reg_period_id: data.event_reg_period_id,
                },
                authCookie
            );
            Swal.fire('Success', 'Event Registration created successfully!', 'success');
            reset();
            setDataChange((prev) => !prev); 
            setOpen(false);
        } catch (error) {
            Swal.fire('Error', 'Failed to create event Registration.', 'error');
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
                            <h5 className="text-lg font-semibold">Create Event Reg</h5>
                            <button onClick={() => setOpen(false)}>
                                <IconX />
                            </button>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Reg Status</label>
                                <Select
                                    options={
                                        eventStatuses?.map((eventStatus) => ({
                                            value: eventStatus.event_reg_status_id,
                                            label: `${eventStatus.event_reg_status_code}`,
                                        })) || []
                                    }
                                    placeholder="Select Status"
                                    onChange={(selectedOption: any) => setValue('event_reg_status_id', selectedOption?.value)}
                                />
                                {errors.event_reg_status_id && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_status_id}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Reg Phase</label>
                                <Select
                                    options={
                                        eventPhases?.map((eventPhase) => ({
                                            value: eventPhase.event_reg_phase_id,
                                            label: `${eventPhase.event_reg_phase_code}`,
                                        })) || []
                                    }
                                    placeholder="Select Phase"
                                    onChange={(selectedOption: any) => setValue('event_reg_phase_id', selectedOption?.value)}
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
                                {errors.event_reg_phase_id && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_phase_id}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Event Reg Period</label>
                                <Select
                                    options={
                                        eventPeriods?.map((eventPeriod) => ({
                                            value: eventPeriod.event_reg_period_id,
                                            label: `${formatedDate(eventPeriod.event_reg_start_date)} - ${formatedDate(eventPeriod.event_reg_end_date)}`,
                                        })) || []
                                    }
                                    placeholder="Select Period"
                                    onChange={(selectedOption: any) => setValue('event_reg_period_id', selectedOption?.value)}
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
                                {errors.event_reg_period_id && (
                                    <p className="text-red-500 text-sm">{errors.event_reg_period_id}</p>
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

export default CreateEventRegModal;

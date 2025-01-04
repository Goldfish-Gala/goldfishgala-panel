import { updateChampionCategory } from '@/api/champion/api-champions';
import { getAllEventPrice } from '@/api/event-price/api-event-price';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { formatMataUang } from '@/utils/curency-format';

interface UpdateChampionCategoryModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
    championCategoryData: ChampionCategoryType
}

const UpdateChampionCategoryModal = ({ open, setOpen, setDataChange, championCategoryData }: UpdateChampionCategoryModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const [isFetching, setFetching] = useState(false);
    const [eventPrices, setEventPrices] = useState<EventPriceType[] | null>(null);
    const { register, handleSubmit, reset, setValue, formState } = useForm({
        defaultValues: {
            champion_category_name: '',
            event_price_id: '',
        },
    });
    
    React.useEffect(() => {
        if (championCategoryData) {
            reset({
                champion_category_name: championCategoryData.champion_category_name || '',
                event_price_id: championCategoryData.event_price_id || '',
            });
        }
    }, [championCategoryData, reset]);

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
        fetchAllEventPrices();
    }, [fetchAllEventPrices]);
    

    const onSubmit = async (data: { champion_category_name: string; event_price_id: string }) => {
        setLoading(true);
        try {
            const response = await updateChampionCategory(
                championCategoryData.champion_category_id,
                {
                    champion_category_name: data.champion_category_name,
                    event_price_id: data.event_price_id,
                },
                authCookie
            );
            if (response.success) {
                await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Champion category updated successfully.',
                timer: 2000,
                showConfirmButton: true,
                });
                reset();
                setDataChange((prev) => !prev); 
                queryClient.invalidateQueries({ queryKey: ['allChampionCategories'] });
                setOpen(false);
                return response.data;
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: response.response.data.message || 'Failed to update champion category.',
                  });
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update champion category.', 'error');
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
                            <h5 className="text-lg font-semibold">Update Champion Category</h5>
                            <button onClick={() => setOpen(false)}>
                                <IconX />
                            </button>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Champion Category Name</label>
                                <input
                                    type="text"

                                    {...register('champion_category_name', { required: 'Name is required' })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                {errors.champion_category_name && (
                                    <p className="text-red-500 text-sm">{errors.champion_category_name}</p>
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
                                    defaultValue={{
                                        value: championCategoryData.event_price_id,
                                        label: championCategoryData.event_price_name,
                                    }}
                                    onChange={(selectedOption: any) => setValue('event_price_id', selectedOption?.value)}
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

export default UpdateChampionCategoryModal;

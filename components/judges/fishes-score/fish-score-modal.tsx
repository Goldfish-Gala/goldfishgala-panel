'use client';

import { getFishScoreByFishIdApi } from '@/api/nomination/api-nomination';
import IconX from '@/components/icon/icon-x';
import { updateFishScoreSubmit } from '@/lib/form-actions';
import { Transition, Dialog } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import React, { Fragment, startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

interface ConfirmationModalProps {
    fish: FishScoresType;
    open: boolean;
    setOpen: (open: boolean) => void;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
}

const FishScoreModal = ({ fish, open, setOpen, setDataChange }: ConfirmationModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const queryClient = useQueryClient();
    const [fishScoreData, setFishScoreData] = useState<FishScoresModalType[]>([]);
    const [isLoading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    const FetchFishScore = useCallback(async () => {
        try {
            const response = await getFishScoreByFishIdApi(fish.fish_id, authCookie);
            if (response) {
                setFishScoreData(response.data);
            }
        } catch (error) {
            throw error;
        }
    }, []);

    useEffect(() => {
        FetchFishScore();
    }, []);

    const form = useForm<FishScoresType>({
        defaultValues: {
            fishscores: [],
        },
    });

    const {
        register,
        reset,
        formState: { isDirty },
        setValue,
    } = form;

    useEffect(() => {
        if (fishScoreData.length > 0) {
            reset({
                fishscores: fishScoreData.map((item) => ({
                    fish_score_id: item.fish_score_id,
                    fish_score: item.fish_score || null,
                })),
            });
        }
    }, [fishScoreData, reset, open]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        let numericValue = Number(value);

        if (numericValue > 100) {
            numericValue = 100;
        }

        setValue(name as any, numericValue);
        setErrors({
            ...errors,
            [name]: undefined,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);

        const formData = new FormData(formRef.current!);
        const fishScores: { fish_score_id: string; fish_score: number }[] = [];
        const errors: { [key: string]: string } = {};

        fishScoreData.forEach((item, index) => {
            const scoreValue = formData.get(`fishscores.${index}.fish_score`);
            if (scoreValue !== null && scoreValue !== '') {
                const parsedValue = Number(scoreValue);
                if (isNaN(parsedValue)) {
                    errors[`fishscores.${index}.fish_score`] = 'Invalid score value.';
                } else {
                    fishScores.push({ fish_score_id: item.fish_score_id, fish_score: parsedValue });
                }
            } else {
                errors[`fishscores.${index}.fish_score`] = 'This field is required.';
            }
        });

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setLoading(false);
            return;
        }

        setErrors({});

        startTransition(() => {
            formAction(fishScores);
        });
    };

    const [state, formAction] = useActionState(updateFishScoreSubmit, null);

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    useEffect(() => {
        if (state?.message === 'Fish score submitted succesfully') {
            showMessage(state?.message);
            setDataChange((prev) => !prev);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } else if (state?.message) {
            reset({
                fishscores: fish.fishscores,
            });
            setLoading(false);
            showMessage(state?.message, 'error');
        }
    }, [state]);

    useEffect(() => {
        if (state) {
            setOpen(false);
        }
    }, [setOpen, state]);

    return (
        <div className="mb-5">
            <div className="flex flex-wrap items-center justify-center gap-2">
                <div>
                    <Transition appear show={open} as={Fragment}>
                        <Dialog as="div" open={open} onClose={() => setOpen(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0" />
                            </Transition.Child>
                            <div id="zoomIn_up_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                                <div className="flex min-h-screen items-center justify-center px-4">
                                    <Dialog.Panel className="panel animate__animated animate__zoomInUp my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">Submit Fish Scores</h5>
                                            <button
                                                onClick={() => setOpen(false)}
                                                type="button"
                                                className="text-white-dark hover:text-dark"
                                            >
                                                <IconX />
                                            </button>
                                        </div>
                                        <form
                                            onSubmit={handleSubmit}
                                            ref={formRef}
                                            className="flex w-full items-center justify-around px-4 py-2 pb-4"
                                        >
                                            <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-3">
                                                {fishScoreData.map((item, index) => (
                                                    <div key={index} className="flex w-full flex-col gap-1">
                                                        <div>
                                                            <label htmlFor={item.fish_score_id}>
                                                                {item.champion_category_name}
                                                            </label>
                                                            <input
                                                                className="form-input w-[100px] bg-white ps-2 placeholder:text-white-dark"
                                                                type="number"
                                                                id={item.fish_score_id}
                                                                {...register(`fishscores.${index}.fish_score`, {
                                                                    required: 'Score is required',
                                                                    onChange: (event) => handleInputChange(event),
                                                                })}
                                                            />
                                                        </div>
                                                        {errors[`fishscores.${index}.fish_score`] && (
                                                            <p className="ml-2 text-red-500">
                                                                {errors[`fishscores.${index}.fish_score`]}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn2 btn-gradient3 h-fit self-end px-4 py-2"
                                                disabled={isLoading || !isDirty}
                                            >
                                                {isLoading ? 'submitting...' : 'Submit'}
                                            </button>
                                        </form>
                                    </Dialog.Panel>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </div>
        </div>
    );
};

export default FishScoreModal;

'use client';
import {
    createChampionApi,
    deleteChampionApi,
    getAllChampionByCategoryIdApi,
    getChampionAwardApi,
    getFinalFishByCategoryIdApi,
    updateChampionApi,
} from '@/api/champion/api-champions';
import { Controller, useForm } from 'react-hook-form';
import SpinnerWithText from '@/components/UI/Spinner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { InstagramEmbed } from 'react-social-media-embed';
import { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { Spinner } from '@/components/UI/Spinner/spinner';

interface IgEmbedType {
    categoryId: string;
    fishSize: string;
    categoryName: string;
}

const ChampionCandidates = ({ categoryId, fishSize, categoryName }: IgEmbedType) => {
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [isLoading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectChanged, setSelectChanged] = useState(false);
    const [opt, setOpt] = useState<ChampionAwardType[]>([]);
    const [defaultChampion, setDefaultChampion] = useState<ChampionType[]>([]);
    const [championAward, setChampionAward] = useState<ChampionAwardType[]>([]);

    const fetchDefaultChampion = useCallback(async () => {
        try {
            const response = await getAllChampionByCategoryIdApi(authCookie, categoryId);
            if (response.success) {
                setDefaultChampion(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }, [authCookie, categoryId]);

    const fetchChampionAward = useCallback(async () => {
        try {
            const response = await getChampionAwardApi(authCookie);
            if (response.success) {
                setChampionAward(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchDefaultChampion();
        fetchChampionAward();
    }, [fetchDefaultChampion, fetchChampionAward]);

    const fetchChampionCategory = async (): Promise<FinalFishType[]> => {
        const eventPrices = await getFinalFishByCategoryIdApi(authCookie, categoryId);
        if (eventPrices.success) return eventPrices.data;
        throw new Error('Failed to fetch event prices');
    };

    const { data, isPending } = useQuery({
        queryKey: ['finalFishByCategoryId', categoryId],
        queryFn: fetchChampionCategory,
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
    });

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { isDirty },
    } = useForm();

    const watchedValues = watch();
    const [filteredOptions, setFilteredOptions] = useState<Record<number, any[]>>({});

    useEffect(() => {
        if (championAward) {
            const filteredOption = championAward.filter((award) => award.champion_award_rank.includes(categoryName));
            setOpt(filteredOption);
            const options = opt.map((award) => ({
                value: award.champion_award_id,
                label: award.champion_award_rank,
            }));

            if (data && defaultChampion.length > 0) {
                data.forEach((item) => {
                    const defaultAwardId = defaultChampion.find(
                        (champ) => champ.fish_id === item.fish_id
                    )?.champion_award_id;

                    if (!watchedValues[`champion_award_id_${item.fish_id}`]) {
                        setValue(`champion_award_id_${item.fish_id}`, defaultAwardId || '', {
                            shouldValidate: false,
                            shouldDirty: false,
                        });
                    }
                });

                const selectedValues = data.map((item) => watchedValues[`champion_award_id_${item.fish_id}`]);

                const updatedFilteredOptions = data.reduce((acc, item) => {
                    (acc as any)[item.fish_id] = options.filter(
                        (opt) =>
                            !selectedValues.includes(opt.value) ||
                            opt.value === watchedValues[`champion_award_id_${item.fish_id}`]
                    );
                    return acc;
                }, {} as Record<number, any[]>);

                setFilteredOptions(updatedFilteredOptions);
            }
        }
    }, [data, defaultChampion, championAward, selectChanged]);

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

    const handleDelete = async (champion_id: string | undefined, fish_id: string) => {
        setDeleteLoading(true);
        try {
            const response = await deleteChampionApi(authCookie, champion_id);
            if (!response.success) {
                showMessage(`Deletion failed`, 'error');
                return;
            }
            setValue(`champion_award_id_${fish_id}`, '', {
                shouldValidate: false,
                shouldDirty: false,
            });

            await fetchDefaultChampion();
            queryClient.invalidateQueries({ queryKey: ['finalFishByCategoryId'] });
            showMessage('Champion deleted successfully!');
            setDeleteLoading(false);
        } catch (error) {
            console.error(error);
            setDeleteLoading(false);
            showMessage('An error occurred during deletion!', 'error');
        }
    };

    const onSubmit = async (formData: any) => {
        setLoading(true);
        try {
            const submissionData = Object.entries(formData)
                .map(([key, value]) => {
                    const fishIdMatch = key.match(/^champion_award_id_(.+)$/);
                    if (fishIdMatch && value) {
                        const fishId = fishIdMatch[1];
                        return {
                            fish_id: fishId,
                            champion_award_id: value as string,
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            if (submissionData.length === 0) {
                showMessage('No changes detected!', 'warning');
                return;
            }

            for (const entry of submissionData) {
                if (entry) {
                    const existingChampion = defaultChampion.find((champion) => champion.fish_id === entry.fish_id);

                    if (existingChampion) {
                        const response = await updateChampionApi(authCookie, existingChampion.champion_id, {
                            champion_category_id: categoryId,
                            fish_id: entry.fish_id,
                            champion_award_id: entry.champion_award_id,
                            is_best_award: false,
                            is_grand_champion: false,
                        });

                        if (!response.success) {
                            showMessage(`Update failed for fish ID: ${entry.fish_id}`, 'error');
                            return;
                        }
                    } else {
                        const response = await createChampionApi(authCookie, {
                            champion_category_id: categoryId,
                            fish_id: entry.fish_id,
                            champion_award_id: entry.champion_award_id,
                            is_best_award: false,
                            is_grand_champion: false,
                        });

                        if (!response.success) {
                            showMessage(`Creation failed for fish ID: ${entry.fish_id}`, 'error');
                            return;
                        }
                    }
                }
            }

            showMessage('All changes submitted successfully!');
            setLoading(false);
            reset(formData);
            await fetchDefaultChampion();
        } catch (error) {
            console.error(error);
            setLoading(false);
            showMessage('An error occurred during submission!', 'error');
        }
    };

    if (isPending) {
        return (
            <div className="flex min-h-[400px] w-full items-center justify-center">
                <SpinnerWithText text="Loading..." />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 flex h-[110%] w-full flex-col items-center gap-4 overflow-x-auto sm:flex-row">
                {data?.map((item) => {
                    const champion = defaultChampion.find((champ) => champ.fish_id === item.fish_id);

                    return (
                        <div className="flex flex-col" key={item.fish_final_score_id}>
                            <div className="w-full space-y-1">
                                <InstagramEmbed url={item.fish_submission_link} width={328} />
                                <div className="flex items-center gap-3">
                                    <label htmlFor="fishName">Fish Name</label>
                                    <input
                                        id="fishName"
                                        readOnly
                                        value={item.fish_name}
                                        className="form-input h-8 w-48"
                                    />
                                </div>
                                <div className="flex items-center gap-9">
                                    <label htmlFor="owner">Owner</label>
                                    <input id="owner" readOnly value={item.user_name} className="form-input h-8 w-48" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="fishscore">Fish Score</label>
                                    <input
                                        id="fishscore"
                                        readOnly
                                        value={item.fish_final_score}
                                        className="form-input h-8 w-16 text-center"
                                    />
                                </div>
                                <div className="mx-auto flex items-center gap-2">
                                    <p className="mb-1">Select as :</p>
                                    <div className="flex items-center gap-2 space-y-1">
                                        <label htmlFor={`champion_award_id_${item.fish_id}`} className="mt-1"></label>
                                        <div className="w-44 pb-1 text-black">
                                            <Controller
                                                name={`champion_award_id_${item.fish_id}`}
                                                control={control}
                                                render={({ field }) => {
                                                    const selectedValue = championAward.find(
                                                        (award) => award.champion_award_id === field.value
                                                    );
                                                    return (
                                                        <Select
                                                            id={`champion_award_id_${item.fish_id}`}
                                                            {...field}
                                                            options={
                                                                filteredOptions[item.fish_id as any] ||
                                                                opt.map((award) => ({
                                                                    value: award.champion_award_id,
                                                                    label: award.champion_award_rank,
                                                                }))
                                                            }
                                                            value={
                                                                selectedValue
                                                                    ? {
                                                                          value: selectedValue.champion_award_id,
                                                                          label: selectedValue.champion_award_rank,
                                                                      }
                                                                    : null
                                                            }
                                                            onChange={(selectedOption: any) => {
                                                                const value = selectedOption?.value || '';
                                                                field.onChange(value);
                                                                setSelectChanged((prev) => !prev);
                                                            }}
                                                            menuPortalTarget={document.body}
                                                            styles={{
                                                                menuPortal: (base: any) => ({ ...base, zIndex: 1 }),
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {champion ? (
                                        <button
                                            disabled={deleteLoading}
                                            className="btn2 btn-cancel"
                                            type="button"
                                            onClick={() => handleDelete(champion?.champion_id, item.fish_id)}
                                        >
                                            {deleteLoading ? <Spinner className="h-5 text-white" /> : 'Delete'}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button disabled={!isDirty || isLoading} type="submit" className="btn btn-primary">
                {isLoading ? <Spinner className="h-5 text-white" /> : 'Submit'}
            </button>
        </form>
    );
};

export default ChampionCandidates;

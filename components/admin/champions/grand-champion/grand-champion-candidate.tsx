'use client';
import { updateChampionApi } from '@/api/champion/api-champions';
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
    bestAward: ChampionBestAwardType;
    isGrandChampionExist: boolean;
    setGrandChampionExist: (open: boolean) => void;
}

const GrandChampionCandidate = ({ bestAward, isGrandChampionExist, setGrandChampionExist }: IgEmbedType) => {
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [isLoading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (bestAward.is_grand_champion) {
            setGrandChampionExist(true);
        }
    }, [isGrandChampionExist]);

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

    const handleDelete = async () => {
        setDeleteLoading(true);
        const body = {
            champion_category_id: bestAward.champion_category_id,
            fish_id: bestAward.fish_id,
            champion_award_id: bestAward.champion_award_id,
            is_grand_champion: false,
        };
        try {
            const response = await updateChampionApi(authCookie, bestAward.champion_id, body);
            if (!response.success) {
                showMessage(`Update failed`, 'error');
                return;
            }
            bestAward.is_grand_champion = false;
            setGrandChampionExist(false);
            showMessage('Best award updated successfully!');
            setDeleteLoading(false);
        } catch (error) {
            console.error(error);
            setDeleteLoading(false);
            showMessage('An error occurred during deletion!', 'error');
        }
    };

    const onSubmit = async () => {
        if (isGrandChampionExist) {
            showMessage(`Existing Grand Champion must be deleted first`, 'info');
            return;
        }
        setLoading(true);
        const body = {
            champion_category_id: bestAward.champion_category_id,
            fish_id: bestAward.fish_id,
            champion_award_id: bestAward.champion_award_id,
            is_grand_champion: true,
        };
        try {
            const response = await updateChampionApi(authCookie, bestAward.champion_id, body);
            if (!response.success) {
                showMessage(`Submission failed`, 'error');
                return;
            }
            bestAward.is_grand_champion = true;
            setGrandChampionExist(true);
            showMessage('All changes submitted successfully!');
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            showMessage('An error occurred during submission!', 'error');
        }
    };

    return (
        <div className="mb-2 flex h-[110%] w-full flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center space-y-1">
                <p className="text-base font-bold">{bestAward.champion_award_rank}</p>
                <div className="min-h-[400px] w-full">
                    <InstagramEmbed url={bestAward.fish_submission_link} width={328} />
                    {/* <div className="flex items-center gap-4">
                            <label htmlFor="fishscore">Fish Score</label>
                            <input
                                id="fishscore"
                                readOnly
                                value={bestAward.fish_final_score}
                                className="form-input h-8 w-16 text-center"
                            />
                        </div> */}
                    <div className="mx-auto flex items-center gap-2">
                        <div className="flex items-center gap-2 space-y-1">
                            <label htmlFor={`champion_award_id_${bestAward.champion_id}`} className="mt-1"></label>
                            <div className="w-44 pb-1 text-black"></div>
                        </div>
                    </div>
                </div>
            </div>
            {bestAward.is_grand_champion ? (
                <button
                    disabled={deleteLoading}
                    className="btn2 btn-cancel px-5 py-2"
                    type="button"
                    onClick={handleDelete}
                >
                    {deleteLoading ? <Spinner className="h-5 text-white" /> : 'Delete'}
                </button>
            ) : (
                <button disabled={isLoading} onClick={onSubmit} className="btn btn-primary w-52">
                    {isLoading ? <Spinner className="h-5 text-white" /> : 'Select as Best Award'}
                </button>
            )}
        </div>
    );
};

export default GrandChampionCandidate;

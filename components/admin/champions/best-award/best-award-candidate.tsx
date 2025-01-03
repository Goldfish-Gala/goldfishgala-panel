'use client';

import { updateChampionApi } from '@/api/champion/api-champions';
import { useCookies } from 'next-client-cookies';
import { InstagramEmbed } from 'react-social-media-embed';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Spinner } from '@/components/UI/Spinner/spinner';

interface IgEmbedType {
    bestAward: ChampionBestAwardType;
    isBestAwardSmallExist: boolean;
    setBestAwardSmallExist: (open: boolean) => void;
    isBestAwardMediumExist: boolean;
    setBestAwardMediumExist: (open: boolean) => void;
    isBestAwardLargeExist: boolean;
    setBestAwardLargeExist: (open: boolean) => void;
}

const BestAwardCandidates: React.FC<IgEmbedType> = ({
    bestAward,
    isBestAwardSmallExist,
    setBestAwardSmallExist,
    isBestAwardMediumExist,
    setBestAwardMediumExist,
    isBestAwardLargeExist,
    setBestAwardLargeExist,
}) => {
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [isLoading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (bestAward.is_best_award) {
            switch (bestAward.event_price_code) {
                case 'sm_fish':
                    setBestAwardSmallExist(true);
                    break;
                case 'md_fish':
                    setBestAwardMediumExist(true);
                    break;
                case 'lg_fish':
                    setBestAwardLargeExist(true);
                    break;
            }
        }
    }, [bestAward, setBestAwardSmallExist, setBestAwardMediumExist, setBestAwardLargeExist]);

    const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
        Swal.fire({
            toast: true,
            position: 'top',
            icon: type,
            title: msg,
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const body = {
                champion_category_id: bestAward.champion_category_id,
                fish_id: bestAward.fish_id,
                champion_award_id: bestAward.champion_award_id,
                is_best_award: false,
            };
            const response = await updateChampionApi(authCookie, bestAward.champion_id, body);
            if (!response.success) throw new Error('Update failed');

            bestAward.is_best_award = false;
            switch (bestAward.event_price_code) {
                case 'sm_fish':
                    setBestAwardSmallExist(false);
                    break;
                case 'md_fish':
                    setBestAwardMediumExist(false);
                    break;
                case 'lg_fish':
                    setBestAwardLargeExist(false);
                    break;
            }

            showMessage('Best award updated successfully!');
        } catch (error) {
            console.error(error);
            showMessage('An error occurred during deletion!', 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    const onSubmit = async () => {
        if (
            (bestAward.event_price_code === 'sm_fish' && isBestAwardSmallExist) ||
            (bestAward.event_price_code === 'md_fish' && isBestAwardMediumExist) ||
            (bestAward.event_price_code === 'lg_fish' && isBestAwardLargeExist)
        ) {
            showMessage('Existing Best Award must be deleted first', 'info');
            return;
        }

        setLoading(true);
        try {
            const body = {
                champion_category_id: bestAward.champion_category_id,
                fish_id: bestAward.fish_id,
                champion_award_id: bestAward.champion_award_id,
                is_best_award: true,
            };
            const response = await updateChampionApi(authCookie, bestAward.champion_id, body);
            if (!response.success) throw new Error('Submission failed');

            bestAward.is_best_award = true;
            switch (bestAward.event_price_code) {
                case 'sm_fish':
                    setBestAwardSmallExist(true);
                    break;
                case 'md_fish':
                    setBestAwardMediumExist(true);
                    break;
                case 'lg_fish':
                    setBestAwardLargeExist(true);
                    break;
            }

            showMessage('All changes submitted successfully!');
        } catch (error) {
            console.error(error);
            showMessage('An error occurred during submission!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-2 flex h-[110%] w-full flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center space-y-1">
                <p className="text-base font-bold">{bestAward.champion_award_rank}</p>
                <div className="min-h-[400px] w-full">
                    <InstagramEmbed url={bestAward.fish_submission_link} width={328} />
                </div>
            </div>
            {bestAward.is_best_award ? (
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

export default BestAwardCandidates;

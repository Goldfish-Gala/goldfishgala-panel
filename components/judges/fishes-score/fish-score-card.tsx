'use client';

import { useForm } from 'react-hook-form';
import { InstagramEmbed } from 'react-social-media-embed';
import FishScoreModal from './fish-score-modal';
import { useEffect, useMemo, useState } from 'react';

interface IgEmbedType {
    fish: FishScoresType;
    setDataChange: (change: boolean | ((prev: boolean) => boolean)) => void;
}

const FishCard = ({ fish, setDataChange }: IgEmbedType) => {
    const [openModal, setOpenModal] = useState(false);
    const form = useForm<FishScoresType>({
        defaultValues: {
            fishscores: fish.fishscores,
        },
    });

    const { register, reset } = form;

    useEffect(() => {
        reset({
            fishscores: fish.fishscores,
        });
    }, [fish, reset]);

    const isValidInstagramUrl = (url: string | null) => {
        const regex = /^https:\/\/www\.instagram\.com\/p\/[\w-]+(\/.*)?(\?[\w&%=+-]*)?$/;
        return url && regex.test(url);
    };

    const hasIncompleteScores = useMemo(() => {
        return fish.fishscores?.some((item) => !item.fish_score || item.fish_score === 0) ? false : true;
    }, [fish.fishscores]);

    const detailEmbed = () => {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="w-[325px] bg-white-light py-2 pl-1 pr-4 dark:bg-white-dark sm:rounded">
                    {[
                        { label: 'Fish Name', value: fish?.fish_name },
                        {
                            label: 'Size',
                            value: fish?.fish_size
                                ? `${
                                      fish.fish_size.toString().endsWith('cm') ? fish.fish_size : `${fish.fish_size} cm`
                                  }`
                                : 'N/A',
                        },
                        { label: 'Owner', value: fish.fish_owner_name },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center justify-center pl-4">
                            <div className="grid w-full grid-cols-[1fr_auto_2.5fr] gap-6 text-black dark:text-white">
                                <p className="capitalize">{item.label}</p>
                                <p className="-ml-4 mr-2 text-center">:</p>
                                <p>
                                    {item.label === 'Size' ? (
                                        <span>
                                            {item.value.replace(' cm', '')} <span className="normal-case">cm</span>
                                        </span>
                                    ) : (
                                        <span className="capitalize">{item.value}</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <form className="mt-4 flex w-full flex-col items-center justify-between gap-6">
                    <div className="grid w-full grid-cols-2 gap-2">
                        {fish.fishscores.map((item, index) => (
                            <div className="flex items-center justify-between gap-2" key={index}>
                                <label htmlFor={item.fish_score_id}>{item.champion_category_name}</label>
                                <input
                                    className="form-input w-[60px] bg-white placeholder:text-white-dark"
                                    type="number"
                                    readOnly
                                    id={item.fish_score_id}
                                    {...register(`fishscores.${index}.fish_score`)}
                                    disabled
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        className={`btn2 ${
                            hasIncompleteScores
                                ? 'bg-success hover:bg-success-light'
                                : 'bg-danger hover:bg-danger-light'
                        } h-fit px-2 py-1.5 text-white`}
                        onClick={() => setOpenModal(true)}
                    >
                        {hasIncompleteScores ? 'Edit Scores' : 'Submit Scores'}
                    </button>
                    <FishScoreModal fish={fish} open={openModal} setOpen={setOpenModal} setDataChange={setDataChange} />
                </form>
            </div>
        );
    };

    return (
        <>
            {!isValidInstagramUrl(fish.fish_submission_link) || !fish.fish_submission_link ? (
                <div className={`panel flex w-full flex-col items-center justify-center gap-2 px-1 pb-6 pt-1`}>
                    <div className="mb-2 flex h-full min-h-[400px] w-full items-center justify-center rounded border border-white-light dark:border-white-dark">
                        <p>Link Instagram invalid / privacy not public</p>
                    </div>
                    {detailEmbed()}
                </div>
            ) : (
                <div
                    className={`panel flex h-full w-full flex-col items-center justify-center gap-2 px-0 pb-0 pl-0.5 pt-1`}
                >
                    <div className="flex w-full flex-grow items-center justify-center border-white pt-2 md:w-11/12">
                        <InstagramEmbed url={fish.fish_submission_link} width="100%" />
                    </div>
                    {detailEmbed()}
                </div>
            )}
        </>
    );
};

export default FishCard;

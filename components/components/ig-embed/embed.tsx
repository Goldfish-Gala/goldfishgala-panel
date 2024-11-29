'use client';

import { render } from '@headlessui/react/dist/utils/render';
import { useEffect, useState } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';

interface IgEmbedType {
    url: string;
    fish: FishJudgesType;
    handleModal: (fishId: string) => void;
    isLoading: boolean;
    buttonText: string;
}

const IGEmbed = ({ url, fish, handleModal, isLoading, buttonText }: IgEmbedType) => {
    const [isExiting, setIsExiting] = useState(fish.exiting || false);

    const handleNominate = async () => {
        handleModal(fish.fish_id);
    };

    useEffect(() => {
        if (fish.exiting) {
            setIsExiting(true);
        }
    }, [fish.exiting]);

    const isValidInstagramUrl = (url: string | null) => {
        const regex = /^https:\/\/www\.instagram\.com\/p\/[\w-]+(\/.*)?(\?[\w&%=+-]*)?$/;
        return url && regex.test(url);
    };

    const detailEmbed = () => {
        return (
            <>
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
                                        item.value
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="btn2 btn-gradient3 mt-4 px-4 py-2" disabled={isLoading} onClick={handleNominate}>
                    {buttonText}
                </button>
            </>
        );
    };

    return (
        <>
            {!isValidInstagramUrl(url) || !url ? (
                <div
                    className={`panel flex w-full flex-col items-center justify-center gap-2 px-1 pb-6 pt-1 transition-all duration-500 ease-in-out ${
                        isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                    }`}
                >
                    <div className="mb-2 flex h-full min-h-[400px] w-full items-center justify-center rounded border border-white-light dark:border-white-dark">
                        <p>Link Instagram invalid / privacy not public</p>
                    </div>
                    {detailEmbed()}
                </div>
            ) : (
                <div
                    className={`panel flex w-full flex-col items-center justify-center gap-2 px-0 pb-6 pt-0 transition-all duration-500 ease-in-out ${
                        isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                    }`}
                >
                    <div className="w-full">
                        <InstagramEmbed url={url} width="100%" />
                    </div>
                    {detailEmbed()}
                </div>
            )}
        </>
    );
};

export default IGEmbed;

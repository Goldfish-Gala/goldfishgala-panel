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

interface CardProps {
    item: ChampionBestAwardType;
}

const ChampionCandidates = ({ item }: CardProps) => {
    return (
        <>
            <p className="mb-4 font-semibold capitalize">{item.champion_award_rank}</p>
            <InstagramEmbed url={item?.fish_submission_link} width={328} />
            <div className="flex w-full items-center justify-center gap-4">
                <label htmlFor="fishscore">Total Score</label>
                <input id="fishscore" readOnly value={item.total_score} className="form-input h-8 w-16 text-center" />
            </div>
        </>
    );
};

export default ChampionCandidates;

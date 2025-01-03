import BestAwardList from '@/components/admin/champions/champions list/best-award';
import GrandChampionList from '@/components/admin/champions/champions list/grand-champion';
import ChampionSizeList from '@/components/admin/champions/champions list/size-champion';
import WinnerList from '@/components/judges/winner-list';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

export const metadata: Metadata = {
    title: 'Winner List',
};

const Judges = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Judges</span>
                </li>
                <li>
                    <span className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">Winner List</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="pt-5">
                    <div className="mb-5 grid grid-cols-1 gap-5">
                        <GrandChampionList />
                        <BestAwardList />
                        <ChampionSizeList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Judges;

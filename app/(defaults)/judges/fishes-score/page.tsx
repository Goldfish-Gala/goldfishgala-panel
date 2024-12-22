import FishScore from '@/components/judges/fishes-score';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

export const metadata: Metadata = {
    title: 'Fishes Score',
};

const Judges = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Judges</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Fishes Score</span>
                </li>
            </ul>
            <div className="pt-5">
                <FishScore />
            </div>
        </div>
    );
};

export default Judges;

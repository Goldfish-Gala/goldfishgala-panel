import FishCandidates from '@/components/judges/fish-candidates';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Fish Candidates',
};

const Judges = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary">Judges</span>
                </li>
                <li>
                    <span className="text-primary before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        Nomination
                    </span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Fish Candidates</span>
                </li>
            </ul>
            <div className="pt-5">
                <FishCandidates />
            </div>
        </div>
    );
};

export default Judges;

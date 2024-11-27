import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

export const metadata: Metadata = {
    title: 'Judges',
};

const Judges = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Judges</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3"></div>
            </div>
        </div>
    );
};

export default Judges;

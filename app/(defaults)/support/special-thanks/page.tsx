import SpecialThanks from '@/components/support/special-thanks';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Special Thanks',
};

const Page = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Support</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Special Thanks</span>
                </li>
            </ul>
            <div className="grid">
                <div className="flex h-full min-h-[700px] pb-10">
                    <SpecialThanks />
                </div>
            </div>
        </div>
    );
};

export default Page;

import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'FAQ',
};

const Page = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Support</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>FAQ</span>
                </li>
            </ul>
            <div className="grid pt-5">{/* component */}</div>
        </div>
    );
};

export default Page;

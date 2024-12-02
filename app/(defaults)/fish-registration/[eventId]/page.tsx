import Loading from '@/app/loading';
import FishRegistrationForm from '@/components/fish-registration/fish-form';
import SpinnerWithText from '@/components/UI/Spinner';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Event Registration',
};

const FishRegistration = ({ params }: { params: { eventId: string } }) => {
    return (
        <div className="flex w-full flex-col items-center justify-center">
            <ul className="mb-5 flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Dashboard</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 ">
                    <span>Pendaftaran event</span>
                </li>
            </ul>
            <FishRegistrationForm params={params} />
        </div>
    );
};

export default FishRegistration;

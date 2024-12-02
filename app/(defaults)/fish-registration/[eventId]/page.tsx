import Loading from '@/app/loading';
import BackButton from '@/components/components/back-button';
import FishRegistrationForm from '@/components/fish-registration/fish-form';
import SpinnerWithText from '@/components/UI/Spinner';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Event Registration',
};

type Params = Promise<{ eventId: string }>;

const FishRegistration = async (props: { params: Params }) => {
    const event_id = { event_id: (await props.params).eventId };
    return (
        <div className="flex w-full flex-col items-center justify-center">
            <ul className="mb-5 flex space-x-2 self-start rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Dashboard</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 ">
                    <span>Pendaftaran event</span>
                </li>
            </ul>
            <div className="flex flex-wrap items-center self-start">
                <BackButton />
            </div>
            <FishRegistrationForm params={event_id} />
        </div>
    );
};

export default FishRegistration;

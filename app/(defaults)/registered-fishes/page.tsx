import OngoingEvent from '@/components/dashboard/ongoing-event';
import PendingPayment from '@/components/dashboard/pending-payment';
import WelcomeCard from '@/components/dashboard/welcome-card';
import FishList from '@/components/registered-fishes/fish-list';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Registered fishes',
};

const UserEvents = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Event</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Ikan terdaftar</span>
                </li>
            </ul>
            <div className="grid pt-5">
                <FishList />
            </div>
        </div>
    );
};

export default UserEvents;

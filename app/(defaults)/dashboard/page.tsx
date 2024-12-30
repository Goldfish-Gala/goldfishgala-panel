import OngoingEvent from '@/components/dashboard/ongoing-event';
import PendingPayment from '@/components/dashboard/pending-payment';
import WelcomeCard from '@/components/dashboard/welcome-card';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Dashboard',
};

const Dashboard = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Dashboard</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Beranda</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <WelcomeCard />
                    <OngoingEvent />
                    <PendingPayment />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

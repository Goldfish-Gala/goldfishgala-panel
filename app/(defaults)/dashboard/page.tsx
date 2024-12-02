import Loading from '@/app/loading';
import OngoingEvent from '@/components/dashboard/ongoing-event';
import PendingPayment from '@/components/dashboard/pending-payment';
import WelcomeCard from '@/components/dashboard/welcome-card';
import IconCalendar from '@/components/icon/icon-calendar';
import IconClock from '@/components/icon/icon-clock';
import IconCoffee from '@/components/icon/icon-coffee';
import IconCreditCard from '@/components/icon/icon-credit-card';
import IconDribbble from '@/components/icon/icon-dribbble';
import IconGithub from '@/components/icon/icon-github';
import IconInfoCircle from '@/components/icon/icon-info-circle';
import IconMail from '@/components/icon/icon-mail';
import IconMapPin from '@/components/icon/icon-map-pin';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconPhone from '@/components/icon/icon-phone';
import IconShoppingBag from '@/components/icon/icon-shopping-bag';
import IconTag from '@/components/icon/icon-tag';
import IconTwitter from '@/components/icon/icon-twitter';
import IconCircle from '@/components/icon/menu/icon-circle';
import ComponentsUsersProfilePaymentHistory from '@/components/users/profile/components-users-profile-payment-history';
import { IRootState } from '@/store';
import { Metadata } from 'next';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

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

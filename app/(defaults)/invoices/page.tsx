import OngoingEvent from '@/components/dashboard/ongoing-event';
import PendingPayment from '@/components/dashboard/pending-payment';
import WelcomeCard from '@/components/dashboard/welcome-card';
import InvoiceList from '@/components/invoices/invoice-list';
import FishList from '@/components/registered-fishes/fish-list';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Invoices',
};

const Invoices = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Tagihan</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Riwayat tagihan</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5">
                    <InvoiceList />
                </div>
            </div>
        </div>
    );
};

export default Invoices;

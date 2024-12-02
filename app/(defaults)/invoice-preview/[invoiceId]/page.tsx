import Loading from '@/app/loading';
import InvoicePreview from '@/components/invoices/invoice-preview';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Invoices',
};

const InvoiceById = ({ params }: { params: { invoiceId: string } }) => {
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
                    <InvoicePreview params={params} />
                </div>
            </div>
        </div>
    );
};

export default InvoiceById;

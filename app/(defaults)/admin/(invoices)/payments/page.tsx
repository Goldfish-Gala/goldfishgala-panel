import PaymentList from '@/components/admin/invoices/list-payment/payment-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Payments',
};

const Page = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary">Admin</span>
                </li>
                <li className="text-primary before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Invoices</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Payment List</span>
                </li>
            </ul>
            <div className="pt-5">
                <PaymentList />
            </div>
        </div>
    );
};

export default Page;

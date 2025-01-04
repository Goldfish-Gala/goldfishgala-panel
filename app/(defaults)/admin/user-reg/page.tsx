import InvoiceList from '@/components/admin/invoices/list-invoice/invoice-list';
import UserRegList from '@/components/admin/user-reg/user-reg-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'User Reg',
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
                    <span>User Registration</span>
                </li>
            </ul>
            <div className="pt-5">
                <UserRegList />
            </div>
        </div>
    );
};

export default Page;

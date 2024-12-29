import BestAwardSelection from '@/components/admin/champions/best-award';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best Award Selection',
};

const Page = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary">Admin</span>
                </li>
                <li className="text-primary before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Champions</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Best Award Selection</span>
                </li>
            </ul>
            <div className="pt-5">
                <BestAwardSelection />
            </div>
        </div>
    );
};

export default Page;

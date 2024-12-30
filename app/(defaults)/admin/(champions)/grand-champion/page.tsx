import GrandChampionSelection from '@/components/admin/champions/grand-champion';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Grand Champion Selection',
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
                    <span>Grand Champion Selection</span>
                </li>
            </ul>
            <div className="pt-5">
                <GrandChampionSelection />
            </div>
        </div>
    );
};

export default Page;

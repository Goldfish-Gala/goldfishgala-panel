import BestAwardList from '@/components/admin/champions/champions list/best-award';
import GrandChampionList from '@/components/admin/champions/champions list/grand-champion';
import ChampionSizeList from '@/components/admin/champions/champions list/size-champion';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Champions List',
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
                    <span>Champions List</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5">
                    <GrandChampionList />
                    <BestAwardList />
                    <ChampionSizeList />
                </div>
            </div>
        </div>
    );
};

export default Page;

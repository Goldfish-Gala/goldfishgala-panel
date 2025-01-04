// import BestAwardSelection from '@/components/admin/champions/best-award';
import ChampionCategory from '@/components/admin/champions/champion-category';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Champion Category',
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
                    <span>All Champion Category</span>
                </li>
            </ul>
            <div className="pt-5">
                <ChampionCategory />
            </div>
        </div>
    );
};

export default Page;

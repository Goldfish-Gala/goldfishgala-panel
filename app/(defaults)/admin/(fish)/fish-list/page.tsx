import FishList from '@/components/admin/fish/all-fishes';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All fishes',
};

const Page = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Admin</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Users</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>All Users</span>
                </li>
            </ul>
            <div className="pt-5">
                <FishList />
            </div>
        </div>
    );
};

export default Page;

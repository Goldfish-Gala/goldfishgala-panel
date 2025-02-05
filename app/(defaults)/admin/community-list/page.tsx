import CommunityList from '@/components/admin/community/community-list';
import UserList from '@/components/admin/users/all-users';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cummunity List',
};

const Page = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Admin</span>
                </li>
                <li className="text-primary before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Community</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Cummunity List</span>
                </li>
            </ul>
            <div className="pt-5">
                <CommunityList />
            </div>
        </div>
    );
};

export default Page;

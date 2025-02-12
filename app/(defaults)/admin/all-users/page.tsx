import UserList from '@/components/admin/users/all-users';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All users',
};

const Page = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Admin</span>
                </li>
                <li className="text-primary before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Users</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>All Users</span>
                </li>
            </ul>
            <div className="pt-5">
                <UserList />
            </div>
        </div>
    );
};

export default Page;

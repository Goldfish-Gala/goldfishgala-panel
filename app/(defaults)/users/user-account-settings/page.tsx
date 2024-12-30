import ComponentsUpdateUserProfile from '@/components/users/account-settings/components-update-user-profile';
import MemberCard from '@/components/users/member-card';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Account Setting',
};

const UserAccountSettings = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary">Setting</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Profile</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <ComponentsUpdateUserProfile />
                    <MemberCard />
                </div>
            </div>
        </div>
    );
};

export default UserAccountSettings;

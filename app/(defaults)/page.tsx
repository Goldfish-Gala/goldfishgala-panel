import { getUser } from '@/api/api-config';
import Loading from '@/components/layouts/loading';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { setProfile } from '@/store/authSlice';
import store from '@/store';
import UserComponent from '@/components/home/userComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home',
};

const Home = async () => {
    return (
        <div>
            <UserComponent />
        </div>
    );
};

export default Home;

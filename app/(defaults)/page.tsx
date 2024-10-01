import { getUser } from '@/api/api-config';
import Loading from '@/components/layouts/loading';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { setProfile } from '@/store/authSlice';
import store from '@/store';
import UserComponent from '@/components/home/userComponent';

const Home = async () => {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('token');

    return (
        <div>
            <UserComponent cookie={authCookie?.value} />
        </div>
    );
};

export default Home;

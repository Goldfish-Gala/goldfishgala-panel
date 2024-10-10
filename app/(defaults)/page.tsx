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

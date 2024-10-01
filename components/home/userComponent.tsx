'use client';
import { useEffect, useState } from 'react';
import { getUser } from '@/api/api-config';
import Loading from '@/components/layouts/loading';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setProfile } from '@/store/authSlice';

interface UserComponentProps {
    cookie?: string;
}

const UserComponent: React.FC<UserComponentProps> = ({ cookie }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (cookie) {
                try {
                    const userProfile = await getUser(`token=${cookie}`);

                    if (userProfile.success) {
                        dispatch(setProfile({ user: userProfile.data[0] }));
                        router.replace('/dashboard');
                    } else {
                        router.replace('/auth');
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    router.replace('/auth');
                } finally {
                    setLoading(false);
                }
            } else {
                router.replace('/auth');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [cookie, dispatch, router]);

    if (loading) {
        return <Loading />;
    }

    return null;
};

export default UserComponent;

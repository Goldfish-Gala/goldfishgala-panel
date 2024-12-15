'use client';

import { getUser } from '@/api/user/api-user';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconCoffee from '@/components/icon/icon-coffee';
import Image from 'next/image';
import Link from 'next/link';
import IconInstagram from '@/components/icon/icon-instagram';
import IconMail from '@/components/icon/icon-mail';
import IconMapPin from '@/components/icon/icon-map-pin';
import IconPhone from '@/components/icon/icon-phone';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UserProfile = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getUserProfile = async (): Promise<User[]> => {
        const getOneUser = await getUser(authCookie);
        if (getOneUser.success) {
            return getOneUser.data;
        }
        throw new Error('No User Found');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['getUser'],
        queryFn: () => getUserProfile(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
    });
    
    return (
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-1">
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-2xl font-semibold dark:text-white-light">Profile</h5>
                            <Link
                                href="/users/user-account-settings"
                                className="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto"
                            >
                                <IconPencilPaper />
                            </Link>
                        </div>
                    {data && data.length > 0 && (
                        <div className="mb-5 lg:text-lg">
                                <div className="flex flex-col items-center justify-center">
                                    <Image
                                        width={800}
                                        height={800}
                                        src={data[0].user_avatar}
                                        alt="img"
                                        className="mb-5 h-24 w-24 rounded-full  object-cover"
                                    />
                                        <p className="text-xl font-semibold text-primary">
                                            {data[0].user_fname} {data[0].user_lname}
                                        </p>
                                    
                                        
                                </div>
                            
                            <ul className="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                                <li className="flex items-center gap-2">
                                    <IconCoffee className="shrink-0" /> {data[0].role_name}
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconMapPin className="shrink-0" />
                                    {data[0].user_address}
                                </li>
                                    <li>
                                        <button className="flex items-center gap-2">
                                            <IconMail className="h-5 w-5 shrink-0" />
                                        </button>
                                        <span className="truncate text-primary">{data[0].user_email}</span>
                                    </li>
                                <li className="flex items-center gap-2">
                                    <IconPhone />
                                    <span className="whitespace-nowrap" dir="ltr">
                                    {data[0].user_phone}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    Joined on{" "}
                                    {new Intl.DateTimeFormat("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }).format(new Date(data[0].user_created_date))}
                                </li>
                            </ul>
                            <ul className="mt-7 flex items-center justify-center gap-2">
                                <li className="flex items-center gap-2">
                                    <button className="btn btn-dark flex h-10 w-10 items-center justify-center rounded-full p-0">
                                        <IconInstagram />
                                    </button>
                                    <span>{data[0].user_ig}</span>
                                </li>

                            </ul>
                        </div>
                    )}
                    </div>
                    
                </div>
    );
};

export default UserProfile;

'use client';

import { useCookies } from 'next-client-cookies';
import SpinnerWithText from '../UI/Spinner';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { storeUser } from '@/utils/storeUser';
import { getAllEventRegistered } from '@/api/api-registered-event';
import Link from 'next/link';
import IconMultipleForwardRight from '../icon/icon-multiple-forward-right';

const PendingPayment = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);

    const fetchUserProfile = useCallback(async () => {
        try {
            if (authCookie) {
                const userProfile = await storeUser(authCookie, dispatch);
                if (userProfile) {
                    router.push('/dashboard');
                } else {
                    router.push('/auth');
                }
            } else {
                router.push('/auth');
            }
        } catch (error) {
            throw error;
        }
    }, [authCookie, dispatch, router]);

    useEffect(() => {
        if (!user) {
            fetchUserProfile();
        }
    }, [fetchUserProfile, user]);

    const fetchPendingPayment = async (): Promise<UserRegDetailType[]> => {
        const getAllUserEvent = await getAllEventRegistered(authCookie, user?.user_id);
        if (getAllUserEvent.success) {
            return getAllUserEvent.data.Pending;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['pendingPayment'],
        queryFn: () => fetchPendingPayment(),
        enabled: !!authCookie && !!user?.user_id,
    });

    return (
        <div className={`grid grid-cols-1 gap-6 lg:col-span-3 lg:grid-cols-2 ${data?.length === 0 ? 'hidden' : ''}`}>
            <div className="panel h-full w-full">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Recent Orders</h5>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th className="ltr:rounded-l-md rtl:rounded-r-md">Customer</th>
                                <th>Product</th>
                                <th>Invoice</th>
                                <th>Price</th>
                                <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img
                                            className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3"
                                            src="/assets/images/profile-6.jpeg"
                                            alt="avatar"
                                        />
                                        <span className="whitespace-nowrap">Luke Ivory</span>
                                    </div>
                                </td>
                                <td className="text-primary">Headphone</td>
                                <td>
                                    <Link href="/apps/invoice/preview">#46894</Link>
                                </td>
                                <td>$56.07</td>
                                <td>
                                    <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">
                                        Paid
                                    </span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img
                                            className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3"
                                            src="/assets/images/profile-7.jpeg"
                                            alt="avatar"
                                        />
                                        <span className="whitespace-nowrap">Andy King</span>
                                    </div>
                                </td>
                                <td className="text-info">Nike Sport</td>
                                <td>
                                    <Link href="/apps/invoice/preview">#76894</Link>
                                </td>
                                <td>$126.04</td>
                                <td>
                                    <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">
                                        Shipped
                                    </span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img
                                            className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3"
                                            src="/assets/images/profile-8.jpeg"
                                            alt="avatar"
                                        />
                                        <span className="whitespace-nowrap">Laurie Fox</span>
                                    </div>
                                </td>
                                <td className="text-warning">Sunglasses</td>
                                <td>
                                    <Link href="/apps/invoice/preview">#66894</Link>
                                </td>
                                <td>$56.07</td>
                                <td>
                                    <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">
                                        Paid
                                    </span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img
                                            className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3"
                                            src="/assets/images/profile-9.jpeg"
                                            alt="avatar"
                                        />
                                        <span className="whitespace-nowrap">Ryan Collins</span>
                                    </div>
                                </td>
                                <td className="text-danger">Sport</td>
                                <td>
                                    <button type="button">#75844</button>
                                </td>
                                <td>$110.00</td>
                                <td>
                                    <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">
                                        Shipped
                                    </span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img
                                            className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3"
                                            src="/assets/images/profile-10.jpeg"
                                            alt="avatar"
                                        />
                                        <span className="whitespace-nowrap">Irene Collins</span>
                                    </div>
                                </td>
                                <td className="text-secondary">Speakers</td>
                                <td>
                                    <Link href="/apps/invoice/preview">#46894</Link>
                                </td>
                                <td>$56.07</td>
                                <td>
                                    <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">
                                        Paid
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PendingPayment;

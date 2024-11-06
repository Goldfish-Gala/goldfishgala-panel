'use client';

import { useCookies } from 'next-client-cookies';
import SpinnerWithText from '../UI/Spinner';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { storeUser } from '@/utils/store-user';
import Link from 'next/link';
import IconMultipleForwardRight from '../icon/icon-multiple-forward-right';
import { expiringTime } from '@/utils/date-format';
import { getAllUserRegByStatus } from '@/api/api-payment';

const PendingPayment = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);

    const fetchUserProfile = useCallback(async () => {
        try {
            if (authCookie) {
                await storeUser(dispatch);
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
        const getAllUserEvent = await getAllUserRegByStatus(
            authCookie,
            user?.user_id,
            undefined,
            'pending_payment_reg'
        );
        if (getAllUserEvent.success) {
            return getAllUserEvent.data;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['pendingPayment'],
        queryFn: () => fetchPendingPayment(),
        enabled: !!authCookie && !!user?.user_id,
    });

    const handlePay = (url: string) => {
        window.location.href = url;
    };

    return (
        <div
            className={`grid grid-cols-1 gap-6 lg:col-span-2 lg:grid-cols-2 ${
                isPending || data?.length === 0 ? 'hidden' : ''
            }`}
        >
            <div className="panel h-full w-full lg:col-span-2">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Tagihan belum dibayar</h5>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr className="dark:!bg-[#1a2941]">
                                <th className="ltr:rounded-l-md rtl:rounded-r-md">Event</th>
                                <th className="whitespace-nowrap">Nama ikan</th>
                                <th>Nomor invoice</th>
                                <th className="text-center">Status</th>
                                <th className="whitespace-nowrap">Batas Pembayaran</th>
                                <th className="ltr:rounded-r-md rtl:rounded-l-md"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((payment) => (
                                <tr key={payment.user_reg_id} className="group text-white-dark">
                                    <td>{payment.event_name}</td>
                                    <td>{payment.fish_name}</td>
                                    <td>{payment.invoice_code}</td>
                                    <td className="text-center">
                                        <span className="badge whitespace-nowrap bg-danger shadow-md">
                                            Belum dibayar
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap">{expiringTime(payment.invoice_due_date)}</td>
                                    <td>
                                        <Link href={'/ '}>
                                            <button
                                                className="btn2 btn-gradient2 item-center whitespace-nowrap !py-2 font-extrabold"
                                                onClick={() => handlePay(payment.invoice_checkout_url)}
                                            >
                                                Bayar sekarang
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PendingPayment;

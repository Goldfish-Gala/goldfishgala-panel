'use client';

import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import Link from 'next/link';
import { expiringTime } from '@/utils/date-format';
import { getAllUserRegByStatus } from '@/api/payment/api-payment';

const PendingPayment = () => {
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
        refetchOnWindowFocus: false,
    });

    const flattenedFishes: FlattenedFishType[] = useMemo(() => {
        if (!data) return [];
        return data.flatMap((registration) =>
            registration.fishes.map((fish) => ({
                ...registration,
                fish,
            }))
        );
    }, [data]);

    const handlePay = (url: string) => {
        window.location.href = url;
    };

    return (
        <div
            className={`grid grid-cols-1 gap-6 lg:col-span-2 lg:grid-cols-2 ${
                isPending || flattenedFishes?.length === 0 ? 'hidden' : ''
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
                            {flattenedFishes?.map((payment) => (
                                <tr key={payment.user_reg_id} className="group text-dark dark:text-white-dark">
                                    <td>{payment.event_name}</td>
                                    <td>{payment.fish.fish_name}</td>
                                    <td>{payment.invoice_code}</td>
                                    <td className="text-center">
                                        <span className="badge badge-outline-warning whitespace-nowrap shadow-md">
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

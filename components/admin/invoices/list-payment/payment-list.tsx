'use client';

import { IRootState } from '@/store';
import { fetchUserProfile, storeUser } from '@/utils/store-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { sortBy } from 'lodash';
import { DataTableSortStatus, DataTable } from 'mantine-datatable';
import { useCookies } from 'next-client-cookies';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { expiringTime, formatedDate } from '@/utils/date-format';
import { getInvoiceAdminApi, getInvoiceByUserId } from '@/api/invoice/api-invoice';
import SpinnerWithText from '@/components/UI/Spinner';
import { getPaymentsAdminApi } from '@/api/payment/api-payment';

const PaymentList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || 1));
    const [limit, setLimit] = useState(Number(searchParams.get('limit') || 10));
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getAllPaymentAdmin = async (): Promise<PaymentDetailPagination> => {
        const getAllPayment = await getPaymentsAdminApi(authCookie, page, limit);
        if (getAllPayment.success) {
            return getAllPayment;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['adminPayments}', page, limit],
        queryFn: () => getAllPaymentAdmin(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
    });
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'status',
        direction: 'asc',
    });

    return (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="datatables pagination-padding">
                    {isPending ? (
                        <div className="flex min-h-[200px] w-full flex-col items-center justify-center">
                            <SpinnerWithText text="Memuat..." />
                        </div>
                    ) : (
                        <DataTable
                            className="table-hover min-h-[200px] whitespace-nowrap"
                            records={data?.data}
                            columns={[
                                {
                                    accessor: 'invoice_code',
                                    title: 'No invoice',
                                    sortable: false,
                                    render: ({ invoice_code }) => (
                                        <Link href={`/invoice-preview/${invoice_code}`}>
                                            <div className="font-semibold text-primary underline hover:no-underline">{`#${invoice_code}`}</div>
                                        </Link>
                                    ),
                                },
                                {
                                    accessor: 'payment_method',
                                    title: 'Payment method',
                                    sortable: false,
                                    render: ({ payment_method }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{payment_method}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'payment_channel',
                                    title: 'Payment channel',
                                    sortable: false,
                                    render: ({ payment_channel }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{payment_channel}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'payment_amount',
                                    title: 'Payment amount',
                                    sortable: false,
                                    render: ({ payment_amount }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{payment_amount}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'status',
                                    title: 'Status',
                                    sortable: true,
                                    textAlignment: 'center',
                                    render: ({ payment_status }) => (
                                        <div className="flex w-full justify-center">
                                            <span
                                                className={`badge ${
                                                    payment_status === 'paid'
                                                        ? 'badge-outline-success'
                                                        : payment_status === 'pending'
                                                        ? 'badge-outline-warning'
                                                        : 'badge-outline-danger'
                                                } text-center`}
                                            >
                                                {payment_status}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'payment_paid_at',
                                    title: 'Payment paid at',
                                    sortable: false,
                                    render: ({ payment_paid_at }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{formatedDate(payment_paid_at)}</div>
                                        </div>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            style={{ paddingLeft: 20, paddingRight: 20 }}
                            key="payment_id"
                            totalRecords={data?.data ? data.pagination.totalData : 0}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            paginationText={({ from, to, totalRecords }) =>
                                `\u00A0\u00A0\u00A0Showing ${from} to ${to} of ${totalRecords} entries`
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentList;

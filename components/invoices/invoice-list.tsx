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
import SpinnerWithText from '../UI/Spinner';
import { expiringTime } from '@/utils/date-format';
import { getAllPaymentRegisteredEvent } from '@/api/payment/api-payment';
import { getInvoiceByUserId } from '@/api/invoice/api-invoice';

const InvoiceList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || 1));
    const [limit, setLimit] = useState(Number(searchParams.get('limit') || 10));
    const PAGE_SIZES = [10, 20, 30, 40];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getAllInvoicePayment = async (): Promise<InvoiceDetail[]> => {
        const getAllInvoice = await getInvoiceByUserId(authCookie);
        if (getAllInvoice.success) {
            return getAllInvoice.data;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['allInvoicePayment'],
        queryFn: () => getAllInvoicePayment(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
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
                            records={data}
                            columns={[
                                {
                                    accessor: 'invoice_code',
                                    title: 'No invoice',
                                    sortable: true,
                                    render: ({ invoice_code }) => (
                                        <Link href={`/invoice-preview/${invoice_code}`}>
                                            <div className="font-semibold text-primary underline hover:no-underline">{`#${invoice_code}`}</div>
                                        </Link>
                                    ),
                                },
                                {
                                    accessor: 'invoice_due_date',
                                    title: 'Batas pembayaran',
                                    sortable: true,
                                    render: ({ invoice_due_date, invoice_code }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{expiringTime(invoice_due_date)}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'invoice_status',
                                    title: 'Status',
                                    sortable: true,
                                    render: ({ invoice_status }) => (
                                        <span
                                            className={`badge ${
                                                invoice_status === 'paid'
                                                    ? 'badge-outline-success'
                                                    : invoice_status === 'pending'
                                                    ? 'badge-outline-warning'
                                                    : 'badge-outline-danger'
                                            } `}
                                        >
                                            {invoice_status === 'paid'
                                                ? 'Lunas'
                                                : invoice_status === 'pending'
                                                ? 'Belum bayar'
                                                : 'Kadaluarsa'}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'aksi',
                                    title: 'Action',
                                    sortable: false,
                                    textAlignment: 'left',
                                    render: ({ invoice_code, invoice_checkout_url, invoice_status }) => (
                                        <div className="ml-[5%] flex w-full gap-4">
                                            <Link
                                                href={`/invoice-preview/${invoice_code}`}
                                                className="flex hover:text-primary"
                                            >
                                                <button className="btn2 btn-secondary">Detail</button>
                                            </Link>
                                            {invoice_status === 'pending' && (
                                                <button
                                                    type="button"
                                                    className="btn2 btn-gradient2 flex"
                                                    onClick={() => (window.location.href = invoice_checkout_url)}
                                                >
                                                    Bayar Sekarang
                                                </button>
                                            )}
                                        </div>
                                    ),
                                },
                            ]}
                            key="invoice_code"
                            totalRecords={data ? data.length : 0}
                            highlightOnHover
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            recordsPerPage={pageSize}
                            style={{ paddingLeft: 20, paddingRight: 20 }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceList;

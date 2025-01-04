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
import { expiringTime } from '@/utils/date-format';
import { getInvoiceAdminApi, getInvoiceByUserId } from '@/api/invoice/api-invoice';
import SpinnerWithText from '@/components/UI/Spinner';

const InvoiceList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || 1));
    const [limit, setLimit] = useState(Number(searchParams.get('limit') || 5));
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getAllInvoicePayment = async (): Promise<InvoiceDetailPagination> => {
        const getAllInvoice = await getInvoiceAdminApi(authCookie, page, limit);
        if (getAllInvoice.success) {
            return getAllInvoice;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['adminInvoices', page, limit],
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
                            records={data?.data}
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
                                    accessor: 'event_name',
                                    title: 'Nama event',
                                    sortable: false,
                                    render: ({ event_name }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{event_name}</div>
                                        </div>
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
                                    textAlignment: 'center',
                                    render: ({ invoice_status }) => (
                                        <div className="flex w-full justify-center">
                                            <span
                                                className={`badge ${
                                                    invoice_status === 'paid'
                                                        ? 'badge-outline-success'
                                                        : invoice_status === 'pending'
                                                        ? 'badge-outline-warning'
                                                        : 'badge-outline-danger'
                                                } text-center`}
                                            >
                                                {invoice_status === 'paid'
                                                    ? 'Lunas'
                                                    : invoice_status === 'pending'
                                                    ? 'Belum bayar'
                                                    : 'Kadaluarsa'}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'aksi',
                                    title: 'Action',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ invoice_code, invoice_checkout_url, invoice_status }) => (
                                        <div className="ml-[5%] flex w-full items-center justify-center gap-2">
                                            <Link
                                                href={`/invoice-preview/${invoice_code}`}
                                                className="flex self-start hover:text-primary"
                                            >
                                                <button className="btn2 btn-secondary">Detail</button>
                                            </Link>
                                        </div>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            style={{ paddingLeft: 20, paddingRight: 20 }}
                            key="invoice_code"
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

export default InvoiceList;

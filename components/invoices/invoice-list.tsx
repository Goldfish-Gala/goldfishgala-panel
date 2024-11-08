'use client';

import { getAllPaymentRegisteredEvent } from '@/api/api-payment';
import { IRootState } from '@/store';
import { fetchUserProfile, storeUser } from '@/utils/store-user';
import { useQuery } from '@tanstack/react-query';
import { sortBy } from 'lodash';
import { DataTableSortStatus, DataTable } from 'mantine-datatable';
import { useCookies } from 'next-client-cookies';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerWithText from '../UI/Spinner';
import { expiringTime } from '@/utils/date-format';

const InvoiceList = () => {
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

    const getAllInvoicePayment = async (): Promise<UserRegDetailType[]> => {
        const getAllUserEvent = await getAllPaymentRegisteredEvent(authCookie, user?.user_id);
        if (getAllUserEvent.success) {
            return [...getAllUserEvent.data.Pending, ...getAllUserEvent.data.Paid, ...getAllUserEvent.data.Failed];
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['allInvoicePayment'],
        queryFn: () => getAllInvoicePayment(),
        enabled: !!authCookie && !!user?.user_id,
    });

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [records, setRecords] = useState<UserRegDetailType[]>([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'status',
        direction: 'asc',
    });

    useEffect(() => {
        if (data) {
            const sortedData = sortBy(data, 'invoice_code');
            setRecords(sortedData.slice(0, pageSize));
        }
    }, [data, pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        if (data) {
            setRecords(sortBy(data, sortStatus.columnAccessor).slice(from, to));
        }
    }, [page, pageSize, sortStatus, data]);

    useEffect(() => {
        if (data) {
            const sortedData = sortBy(data, sortStatus.columnAccessor);
            setRecords(sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData);
            setPage(1);
        }
    }, [sortStatus, data]);

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
                            records={records}
                            columns={[
                                {
                                    accessor: 'invoice_code',
                                    title: 'No invoice',
                                    sortable: true,
                                    render: ({ invoice_code }) => (
                                        <div className="font-semibold text-primary underline hover:no-underline">{`#${invoice_code}`}</div>
                                    ),
                                },
                                {
                                    accessor: 'event_name',
                                    title: 'Nama event',
                                    sortable: true,
                                    render: ({ event_name, event_id }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{event_name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'fish_name',
                                    title: 'Nama ikan',
                                    sortable: true,
                                    render: ({ fish_name, fish_id }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{fish_name}</div>
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
                                            {invoice_status}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'aksi',
                                    title: '',
                                    sortable: false,
                                    textAlignment: 'left',
                                    render: ({ invoice_code, invoice_checkout_url, invoice_status }) => (
                                        <div className="ml-[5%] flex w-full gap-4">
                                            <Link
                                                href={`/invoice-preview/${invoice_code}`}
                                                className="flex hover:text-primary"
                                            >
                                                <button className="btn2 btn-gradient3">Lihan detail</button>
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
                            highlightOnHover
                            totalRecords={data ? data.length : 0}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            // selectedRecords={selectedRecords}
                            // onSelectedRecordsChange={setSelectedRecords}
                            paginationText={({ from, to, totalRecords }) =>
                                `Showing  ${from} to ${to} of ${totalRecords} entries`
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceList;

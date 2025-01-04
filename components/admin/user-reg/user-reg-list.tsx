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
import { getUserRegAdminApi } from '@/api/user-reg/api-user-reg';
import Dropdown from '@/components/dropdown';

const UserRegList = () => {
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

    const getAllInvoicePayment = async (): Promise<UserRegDetailPagination> => {
        const getAllInvoice = await getUserRegAdminApi(authCookie, page, limit);
        if (getAllInvoice.success) {
            return getAllInvoice;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['adminUserRegs', page, limit],
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
                                    accessor: 'user_reg_id',
                                    title: 'ID',
                                    sortable: false,
                                    render: ({ user_reg_id }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{user_reg_id}</div>
                                        </div>
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
                                    accessor: 'event_is_active',
                                    title: 'Event status',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ event_is_active }) => (
                                        <div className="flex w-full justify-center">
                                            <span
                                                className={`badge ${
                                                    event_is_active ? 'badge-outline-success' : 'badge-outline-danger'
                                                } text-center`}
                                            >
                                                {event_is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'user',
                                    title: 'User',
                                    sortable: false,
                                    render: ({ user_fname, user_lname }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{`${user_fname} ${user_lname}`}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'user_status',
                                    title: 'User status',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ user_is_active }) => (
                                        <div className="flex w-full justify-center">
                                            <span
                                                className={`badge ${
                                                    user_is_active ? 'badge-outline-success' : 'badge-outline-danger'
                                                } text-center`}
                                            >
                                                {user_is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'status',
                                    title: 'User Reg Status',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ user_reg_status_code }) => (
                                        <div className="flex w-full justify-center">
                                            <span
                                                className={`badge ${
                                                    user_reg_status_code === 'paid_reg'
                                                        ? 'badge-outline-success'
                                                        : user_reg_status_code === 'pending_payment_reg'
                                                        ? 'badge-outline-warning'
                                                        : 'badge-outline-danger'
                                                } text-center`}
                                            >
                                                {user_reg_status_code}
                                            </span>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'fishes',
                                    title: 'Fishes',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ fishes }) =>
                                        fishes.length == 1 ? (
                                            <p>{fishes[0].fish_name}</p>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                {fishes.map((item) => (
                                                    <p key={item.fish_id}>&nbsp;{`${item.fish_name},`}</p>
                                                ))}
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

export default UserRegList;

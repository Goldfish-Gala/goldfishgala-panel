'use client';

import { getUserList } from '@/api/api-user';
import SpinnerWithText from '@/components/UI/Spinner';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'lucide-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCookies } from 'next-client-cookies';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UserList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || 1));
    const [limit, setLimit] = useState(Number(searchParams.get('limit') || 10));
    const [sort, setSort] = useState(searchParams.get('sort') || 'asc');

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getAllUserList = async (): Promise<User[]> => {
        const getAllUsers = await getUserList(authCookie, page, limit, sort);
        if (getAllUsers.success) {
            return getAllUsers.data;
        }
        throw new Error('No ongoing event');
    };

    useEffect(() => {
        const params = new URLSearchParams();
        params.set('limit', limit.toString());
        params.set('sort', sort);
        params.set('page', page.toString());
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        if (window.location.href !== newUrl) {
            window.history.replaceState(null, '', newUrl);
        }
    }, [limit, sort, router]);

    const { isPending, error, data } = useQuery({
        queryKey: ['allUsers', page, limit, sort],
        queryFn: () => getAllUserList(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
    });

    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
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
                                    accessor: 'user_id',
                                    title: 'ID',
                                    sortable: true,
                                    render: ({ user_id }) => (
                                        <div className="font-semibold text-primary underline hover:no-underline">{`#${user_id}`}</div>
                                    ),
                                },
                                {
                                    accessor: 'email',
                                    title: 'Email',
                                    sortable: true,
                                    render: ({ user_email }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{user_email}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'user_ig',
                                    title: 'Instagram',
                                    sortable: true,
                                    render: ({ user_ig }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{user_ig}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'name',
                                    title: 'name',
                                    sortable: true,
                                    render: ({ user_fname, user_lname }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{`${user_fname} ${user_lname}`}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'status',
                                    title: 'Status',
                                    sortable: true,
                                    render: ({ user_is_active }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{user_is_active ? 'active' : 'inactive'}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    sortable: false,
                                    textAlignment: 'left',
                                    render: ({ user_id }) => (
                                        <div className="ml-[5%] flex w-full gap-4">
                                            <Link href={`/user-detail/${user_id}`} className="flex hover:text-primary">
                                                <button className="btn2 btn-gradient3">Lihan detail</button>
                                            </Link>
                                        </div>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            key="invoice_code"
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
                                `\u00A0\u00A0\u00A0Showing ${from} to ${to} of ${totalRecords} entries`
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserList;

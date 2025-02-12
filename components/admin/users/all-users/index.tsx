'use client';

import { getUserList } from '@/api/user/api-user';
import SpinnerWithText from '@/components/UI/Spinner';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCookies } from 'next-client-cookies';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserModal from './user-detail-modal';
import { sortBy } from 'lodash';

const UserList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const user = useSelector((state: IRootState) => state.auth.user);
    const [userDetail, setUserDetail] = useState<User | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const searchParams = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || 1));
    const [limit, setLimit] = useState(Number(searchParams.get('limit') || 10));
    const [roleName, setRoleName] = useState(searchParams.get('role-name') || 'all');
    const [pageSize, setPageSize] = useState(10);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'role',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
    }, [roleName]);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getAllUserList = async (): Promise<AllUsersType> => {
        const getAllUsers = await getUserList(authCookie, page, limit, roleName);
        if (getAllUsers.success) {
            return getAllUsers;
        }
        throw new Error('No users data');
    };

    useEffect(() => {
        const params = new URLSearchParams();
        params.set('limit', limit.toString());
        params.set('page', page.toString());
        params.set('role-name', roleName);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        if (window.location.href !== newUrl) {
            window.history.replaceState(null, '', newUrl);
        }
    }, [limit, router, roleName]);

    const { isPending, error, data } = useQuery({
        queryKey: ['allUsers', page, limit, pageSize, roleName],
        queryFn: () => getAllUserList(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        placeholderData: (previousData, previousQuery) => previousData,
        staleTime: 5 * 50 * 1000,
    });

    const [records, setRecords] = useState(sortBy(data?.data, 'role'));
    const [filterValue, setFilterValue] = useState('');
    useEffect(() => {
        setLimit(pageSize);
        if (data) {
            // Filter and sort the data
            let filteredRecords = data.data;

            if (filterValue) {
                filteredRecords = data.data.filter((user) => {
                    const fullName = `${user.user_fname} ${user.user_lname}`.toLowerCase();
                    return fullName.includes(filterValue.toLowerCase());
                });
            }

            const sortedRecords = sortBy(filteredRecords, sortStatus.columnAccessor);
            setRecords(sortStatus.direction === 'desc' ? sortedRecords.reverse() : sortedRecords);
        }
    }, [pageSize, sortStatus, data, filterValue]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.target.value);
    };

    useEffect(() => {
        if (!openModal) {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
        }
    }, [openModal]);

    const handleUserDetail = (user_id: string) => {
        if (!data || !data.data) {
            console.error('Data is not available');
            return;
        }
        const currentUser = data.data.find((user) => user.user_id === user_id);
        if (currentUser) {
            setUserDetail(currentUser);
            setOpenModal(true);
        } else {
            console.error(`User with ID ${user_id} not found.`);
        }
    };

    return (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-2 flex w-[320px] items-center justify-center gap-4 px-1 py-2">
                    <div className="">
                        <input
                            placeholder="Search user by name..."
                            value={filterValue}
                            onChange={handleFilterChange}
                            className="mb-4 max-w-36 rounded border p-2"
                        />
                    </div>
                    <div className="-mt-4 flex justify-center gap-2">
                        <label className="pt-1.5 font-semibold">Sort by :</label>
                        <select
                            className="rounded bg-dark-light text-black dark:bg-white"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="admin">Admin</option>
                            <option value="judge">Judges</option>
                            <option value="member">Member</option>
                            <option value="guest">Guest</option>
                        </select>
                    </div>
                </div>
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
                                    accessor: 'user_id',
                                    title: 'ID',
                                    sortable: false,
                                    render: ({ user_id }) => (
                                        <div className="font-semibold text-primary underline hover:no-underline">{`#${user_id}`}</div>
                                    ),
                                },
                                {
                                    accessor: 'name',
                                    title: 'Name',
                                    sortable: true,
                                    render: ({ user_fname, user_lname }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{`${user_fname} ${user_lname}`}</div>
                                        </div>
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
                                    accessor: 'role',
                                    title: 'Role',
                                    sortable: true,
                                    render: ({ role_id }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>
                                                {role_id === 2
                                                    ? 'Member'
                                                    : role_id === 3
                                                    ? 'Admin'
                                                    : role_id === 4
                                                    ? 'Judges'
                                                    : 'Guest'}
                                            </div>
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
                                            <button
                                                className="btn2 btn-secondary"
                                                onClick={() => handleUserDetail(user_id)}
                                            >
                                                Detail
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            key="user_id"
                            totalRecords={data?.data ? data.pagination.totalData : 0}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            recordsPerPage={pageSize}
                            style={{ paddingLeft: 20, paddingRight: 20 }}
                            paginationText={({ from, to, totalRecords }) =>
                                `\u00A0\u00A0\u00A0Showing ${from} to ${to} of ${totalRecords} entries`
                            }
                            // recordsPerPageOptions={PAGE_SIZES}
                            // onRecordsPerPageChange={setPageSize}
                            // selectedRecords={selectedRecords}
                            // onSelectedRecordsChange={setSelectedRecords}
                        />
                    )}
                </div>
            </div>
            <UserModal open={openModal} setOpen={setOpenModal} user={userDetail} />
        </div>
    );
};

export default UserList;

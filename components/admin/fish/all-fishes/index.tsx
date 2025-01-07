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
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFishListAdminApi } from '@/api/fish/api-fish';
import { getAllFishCandidateApi } from '@/api/nomination/api-nomination';

const FishList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const user = useSelector((state: IRootState) => state.auth.user);
    const [fishDetail, setFishDetail] = useState<FishJudgesType | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const searchParams = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || 1));
    const [limit, setLimit] = useState(Number(searchParams.get('limit') || 10));
    const [sort, setSort] = useState(searchParams.get('sort') || 'asc');

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getAllUserList = async (): Promise<FishDetailAdminPaginationType> => {
        const getAllFishes = await getAllFishCandidateApi(page, limit, sort, authCookie);
        if (getAllFishes.success) {
            return getAllFishes;
        }
        throw new Error('No ongoing event');
    };

    useEffect(() => {
        setLimit(pageSize);
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
        queryKey: ['AllFishesAdmin', page, limit, sort],
        queryFn: () => getAllUserList(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
        placeholderData: (previousData) => previousData,
    });

    useEffect(() => {
        if (!openModal) {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
        }
    }, [openModal]);

    const [pageSize, setPageSize] = useState(10);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'status',
        direction: 'asc',
    });

    const handleUserDetail = (fish_id: string) => {
        if (!data || !data.data) {
            console.error('Data is not available');
            return;
        }
        const currentFish = data.data.find((fish) => fish.fish_id === fish_id);
        if (currentFish) {
            setFishDetail(currentFish);
            setOpenModal(true);
        } else {
            console.error(`User with ID ${fish_id} not found.`);
        }
    };

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
                                    accessor: 'fish_id',
                                    title: 'ID',
                                    sortable: false,
                                    render: ({ fish_id }) => (
                                        <div className="font-semibold text-primary underline hover:no-underline">{`#${fish_id}`}</div>
                                    ),
                                },
                                {
                                    accessor: 'fish_name',
                                    title: 'Fish Name',
                                    sortable: false,
                                    render: ({ fish_name }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{fish_name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'category',
                                    title: 'Category Size',
                                    sortable: false,
                                    render: ({ event_price_name }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{event_price_name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'owner',
                                    title: 'Owner',
                                    sortable: false,
                                    render: ({ user_name }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{user_name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'nomination_status',
                                    title: 'Nomination Status',
                                    sortable: false,
                                    render: ({ fish_is_nominated }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{fish_is_nominated ? 'Nominated' : 'Unselected'}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    sortable: false,
                                    textAlignment: 'left',
                                    render: ({ fish_id }) => (
                                        <div className="ml-[5%] flex w-full gap-4">
                                            <Link href={`/admin/fish-detail/${fish_id}`}>
                                                <button className="btn2 btn-secondary">Detail</button>
                                            </Link>
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
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FishList;

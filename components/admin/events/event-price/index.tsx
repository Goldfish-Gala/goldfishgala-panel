'use client';

import { getAllEventPrice } from '@/api/event-price/api-event-price';
import SpinnerWithText from '@/components/UI/Spinner';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCookies } from 'next-client-cookies';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const EventPriceList = () => {
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

    const getAllEventPrices = async (): Promise<EventPriceType[]> => {
        const getAllEventPrices = await getAllEventPrice(authCookie);
        if (getAllEventPrices.success) {
            return getAllEventPrices.data;
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
        queryKey: ['allEventPrices', page, limit, sort],
        queryFn: () => getAllEventPrices(),
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
        <div className='flex-column gap-5'>
            <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
            <div className="event-price-table">
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
                                    accessor: 'event_price_id',
                                    title: 'ID',
                                    sortable: true,
                                    render: ({ event_price_id }) => (
                                        <div className="font-semibold hover:no-underline">{event_price_id}</div>
                                    ),
                                },
                                {
                                    accessor: 'event_price_code',
                                    title: 'Code',
                                    sortable: true,
                                    render: ({ event_price_code }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{event_price_code}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'event_price_name',
                                    title: 'Name',
                                    sortable: true,
                                    render: ({ event_price_name }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{event_price_name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'amount',
                                    title: 'amount',
                                    sortable: true,
                                    render: ({ event_price_amount }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{event_price_amount}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    sortable: false,
                                    textAlignment: 'center',
                                    render: ({ event_price_id }) => (
                                        <div className="ml-[5%] flex w-full gap-4">
                                            {/* <Link href={`/user-detail/${event_price_id}`} className="flex hover:text-primary"> */}
                                                <button className="btn2 btn-gradient3">Remove/Add</button>
                                            {/* </Link> */}
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
                <button type="button" className="btn btn-primary mt-5"> 
                    <Link href="/event-price/new">
                        Create New
                    </Link>
                </button>  

        </div>
    );
};

export default EventPriceList;

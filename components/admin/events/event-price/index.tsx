'use client';

import { getAllEventPrice, deleteEventPrice, getOneEventPrice } from '@/api/event-price/api-event-price';
import SpinnerWithText from '@/components/UI/Spinner';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCookies } from 'next-client-cookies';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreateEventPriceModal from './components-create-event-price-modal';
import { formatMataUang } from '@/utils/curency-format';
import Swal from 'sweetalert2';
import UpdateEventPriceModal from './components-update-event-price-modal';

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
    const [openModal, setOpenModal] = useState(false);
    const [dataChange, setDataChange] = useState(false);
    const [dataEventPrice, setDataEventPrice] = useState<EventPriceType>({
        event_price_id: '',
        event_price_code: '',
        event_price_name: '',
        event_price_amount: 0,
    });
    
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

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

    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allEventPrices', page, limit, sort],
        queryFn: () => getAllEventPrices(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
    });

    const deleteEventPrices = async (event_price_id: string) => {
        try {
          const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone. Do you want to delete this event price?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
          });
      
          if (confirmResult.isConfirmed) {
            const deleteOneEventPrice = await deleteEventPrice(event_price_id, authCookie);
      
            if (deleteOneEventPrice.success) {
              await Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Event price deleted successfully.',
                timer: 2000,
                showConfirmButton: false,
              });
    
              queryClient.invalidateQueries({ queryKey: ['allEventPrices'] });
              return deleteOneEventPrice.data;
            } else {
              await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: deleteOneEventPrice.response.data.message || 'Failed to delete event price.',
              });
            }
          } else {
            await Swal.fire({
              icon: 'info',
              title: 'Cancelled',
              text: 'The event price was not deleted.',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (error: any) {
          console.error('Error deleting event price:', error);
      
          await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error?.message || 'An unexpected error occurred while deleting the event price.',
          });
        }
      };

      const getEventPrice = async (event_price_id: string): Promise<User[]> => {
        const getEventPrice = await getOneEventPrice(event_price_id, authCookie);
        if (getEventPrice.success) {
            setOpenUpdateModal(true)
            setDataEventPrice(getEventPrice.data[0])
        }
        throw new Error('No User Found');
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
        if (dataChange) {
            refetch();
            setDataChange(false);
        }
    }, [limit, sort, router, dataChange, refetch]);



    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'status',
        direction: 'asc',
    });

    
    return (
        <>
            <CreateEventPriceModal
                open={openModal}
                setOpen={setOpenModal}
                setDataChange={setDataChange}
            />
        <div className='flex-column gap-5'>
            <button
                    type="button"
                    className="btn btn-primary mb-5"
                    onClick={() => setOpenModal(true)}
                >
                    Create New
                </button>

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
                                    accessor: 'event_price_amount',
                                    title: 'Amount',
                                    sortable: true,
                                    render: ({ event_price_amount }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{ formatMataUang(event_price_amount)}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    sortable: false,
                                    render: ({ event_price_id }) => (
                                        <div className="ml-[5%] flex w-full gap-4">
                                                <button 
                                                className="btn2 btn-primary"
                                                onClick={()=>getEventPrice(event_price_id)}
                                                >
                                                    Update
                                                </button>

                                                <button 
                                                className="btn2 btn-gradient3"
                                                onClick={()=>deleteEventPrices(event_price_id)}
                                                >
                                                    Remove
                                                </button>
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
        </div>
            <UpdateEventPriceModal
                open={openUpdateModal}
                setOpen={setOpenUpdateModal}
                setDataChange={setDataChange}
                eventPriceData={dataEventPrice}
            />
        </>
    );
};

export default EventPriceList;

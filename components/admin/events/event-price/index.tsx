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
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconTrashLines from '@/components/icon/icon-trash-lines';

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
    const [sort, setSort] = useState(searchParams.get('sort') || 'desc');
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
        const getAllEventPrices = await getAllEventPrice(sort, authCookie);
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



    const PAGE_SIZES = [10];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'event_price_amount',
        direction: 'desc',
    });

    
    return (
        <>
        <div className='flex-column gap-5'>
            <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
                <div className='flex items-center justify-between ml-3 mr-6 mb-0'>
                    <h6 className="mb-5 text-lg font-bold">Event Price</h6>
                    <button
                        type="button"
                        className="btn btn-primary mb-5"
                        onClick={() => setOpenModal(true)}
                    >
                        Create New
                    </button>
                </div>
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
                                    sortable: false,
                                    render: ({ event_price_id }) => (
                                        <div className="font-semibold hover:no-underline">{event_price_id}</div>
                                    ),
                                },
                                {
                                    accessor: 'event_price_code',
                                    title: 'Code',
                                    sortable: false,
                                    render: ({ event_price_code }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{event_price_code}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'event_price_name',
                                    title: 'Name',
                                    sortable: false,
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
                                        <div className="ml-[5%] flex w-full gap-2">
                                            <div className="relative group">
                                                <button
                                                className="btn2 btn-secondary p-1 w-7 h-7"
                                                onClick={() => getEventPrice(event_price_id)}
                                                >
                                                <IconPencilPaper />
                                                </button>
                                                <span
                                                className="absolute bottom-full left-1/2 z-10 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                >
                                                Update
                                                </span>
                                            </div>

                                            <div className="relative group">
                                                <button
                                                className="btn2 btn-gradient3 p-1 w-7 h-7"
                                                onClick={() => deleteEventPrices(event_price_id)}
                                                >
                                                <IconTrashLines />
                                                </button>
                                                <span
                                                className="absolute bottom-full left-1/2 z-10 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                >
                                                Delete
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            key="event_price_id"
                            totalRecords={data ? data.length : 0}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            sortStatus={sortStatus}
                            onSortStatusChange={(newSortStatus) => {
                                setSortStatus(newSortStatus);
                                setSort(newSortStatus.direction);
                            }}
                            paginationText={({ from, to, totalRecords }) =>
                                `\u00A0\u00A0\u00A0Showing ${from} to ${to} of ${totalRecords} entries`
                            }
                        />
                    )}
                </div>
            </div>
            </div>
        </div>
            <CreateEventPriceModal
                open={openModal}
                setOpen={setOpenModal}
                setDataChange={setDataChange}
            />
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

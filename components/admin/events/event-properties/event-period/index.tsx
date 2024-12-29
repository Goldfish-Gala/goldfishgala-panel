'use client';

import SpinnerWithText from '@/components/UI/Spinner';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCookies } from 'next-client-cookies';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getAllEventPeriods, deleteEventPeriod, getOneEventPeriod } from '@/api/event-reg/api-event-reg';
import { formatedDate } from '@/utils/date-format';
import CreateEventPeriodModal from './components-create-event-period';
import UpdateEventPeriodModal from './components-update-event-period-modal';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconTrashLines from '@/components/icon/icon-trash-lines';

const EventPeriodList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page') || 1));
    const [limit, setLimit] = useState(Number(searchParams.get('limit') || 5));
    const [sort, setSort] = useState(searchParams.get('sort') || 'asc');
    const [openModal, setOpenModal] = useState(false);
    const [dataChange, setDataChange] = useState(false);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0); 
    const [dataEventPeriod, setDataEventPeriod] = useState<EventRegPeriod>({
        event_reg_period_id: '',
        event_reg_start_date: '',
        event_reg_end_date: '',
        event_reg_created_date: '',
    });

    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getAllEventPeriod = async (): Promise<EventRegPeriod[]> => {
        const response = await getAllEventPeriods(authCookie); 
        if (response.success) {
            setData(response.data);
            setTotalRecords(response.data.length); 
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, refetch } = useQuery({
        queryKey: ['allEventPeriod', page, limit, sort],
        queryFn: () => getAllEventPeriod(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
    });

    const deleteEventPeriods = async (event_reg_period_id: string) => {
        try {
          const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone. Do you want to delete this event reg period?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
          });
      
          if (confirmResult.isConfirmed) {
            const deleteOneEventPeriod = await deleteEventPeriod(event_reg_period_id, authCookie);
      
            if (deleteOneEventPeriod.success) {
              await Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Event reg period deleted successfully.',
                timer: 2000,
                showConfirmButton: false,
              });
    
              queryClient.invalidateQueries({ queryKey: ['allEventPeriod'] });
              return deleteOneEventPeriod.data;
            } else {
              await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: deleteOneEventPeriod.response.data.message || 'Failed to delete event reg period.',
              });
            }
          } else {
            await Swal.fire({
              icon: 'info',
              title: 'Cancelled',
              text: 'The event reg period was not deleted.',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (error: any) {
          console.error('Error deleting event reg period:', error);
      
          await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error?.message || 'An unexpected error occurred while deleting the event reg period.',
          });
        }
      };

      const getEventPeriod = async (event_reg_period_id: string): Promise<User[]> => {
        const getEventPeriod = await getOneEventPeriod(event_reg_period_id, authCookie);
        if (getEventPeriod.success) {
            setOpenUpdateModal(true)
            setDataEventPeriod(getEventPeriod.data[0])
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



    const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'status',
        direction: 'asc',
    });

    const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);
    
    return (
        <> 
            <div className='flex-column gap-5 pb-5'>
                <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
                    <div className='flex items-center justify-between ml-3 mr-6 mb-0'>
                        <h6 className="mb-5 text-lg font-bold">Event Period</h6>
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
                                records={paginatedData}
                                columns={[
                                    {
                                        accessor: 'event_reg_period_id',
                                        title: 'ID',
                                        sortable: true,
                                        render: ({ event_reg_period_id }) => (
                                            <div className="font-semibold hover:no-underline">{event_reg_period_id}</div>
                                        ),
                                    },
                                    {
                                        accessor: 'event_reg_start_date',
                                        title: 'Start Date',
                                        sortable: true,
                                        render: ({ event_reg_start_date }) => (
                                            <div className="flex items-center font-semibold">
                                                <div>{formatedDate(event_reg_start_date)}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'event_reg_end_date',
                                        title: 'End Date',
                                        sortable: true,
                                        render: ({ event_reg_end_date }) => (
                                            <div className="flex items-center font-semibold">
                                                <div>{formatedDate(event_reg_end_date)}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'event_reg_created_date',
                                        title: 'Created Date',
                                        sortable: true,
                                        render: ({ event_reg_created_date }) => (
                                            <div className="flex items-center font-semibold">
                                                <div>{formatedDate(event_reg_created_date)}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'action',
                                        title: 'Action',
                                        sortable: false,
                                        render: ({ event_reg_period_id }) => (
                                            <div className="ml-[5%] flex w-full gap-2">
                                                <div className="relative group">
                                                    <button
                                                    className="btn2 btn-secondary p-1 w-7 h-7"
                                                    onClick={()=>getEventPeriod(event_reg_period_id)}
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
                                                    onClick={()=>deleteEventPeriods(event_reg_period_id)}
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
                                key="invoice_code"
                                totalRecords={totalRecords ? paginatedData.length : 0}
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
            <CreateEventPeriodModal
                open={openModal}
                setOpen={setOpenModal}
                setDataChange={setDataChange}
            />
            <UpdateEventPeriodModal
                open={openUpdateModal}
                setOpen={setOpenUpdateModal}
                setDataChange={setDataChange}
                eventPeriodData={dataEventPeriod}
            />
        </>
    );
};

export default EventPeriodList;

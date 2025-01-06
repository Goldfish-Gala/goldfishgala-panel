'use client';

import SpinnerWithText from '@/components/UI/Spinner';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useCookies } from 'next-client-cookies';
import { useSearchParams, useRouter } from 'next/navigation';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getAllEventRegs, deleteEventReg, getOneEventReg } from '@/api/event-reg/api-event-reg';
import { formatedDate } from '@/utils/date-format';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import CreateEventRegModal from './components-create-event-reg';
import UpdateEventRegModal from './components-update-event-reg-modal';
import IconTrash from '@/components/icon/icon-trash';
import IconTrashLines from '@/components/icon/icon-trash-lines';

const EventRegistrationList = () => {
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
    const [dataEventReg, setDataEventReg] = useState<EventReg>({
        event_reg_id: '',
        event_reg_status_id: '',
        event_reg_phase_id: '',
        event_reg_period_id: '',
        event_reg_phase_code: '',
        event_reg_phase_name: '',
        event_reg_phase_desc: '',
        event_reg_status_code: '',
        event_reg_status_name: '',
        event_reg_status_desc: '',
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

    const getAllEventReg = async (): Promise<EventRegAdminPaginationType> => {
        const getAllEventReg = await getAllEventRegs(page, limit, sort, authCookie);
        if (getAllEventReg.success) {
            return getAllEventReg;
        }
        throw new Error('No ongoing event');
   };
   
   const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allEventReg', page, limit, sort],
        queryFn: () => getAllEventReg(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    });


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

    const deleteEventRegs = async (event_reg_id: string) => {
        try {
          const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone. Do you want to delete this event registration?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
          });
      
          if (confirmResult.isConfirmed) {
            const deleteOneEventReg = await deleteEventReg(event_reg_id, authCookie);
      
            if (deleteOneEventReg.success) {
              await Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Event registration deleted successfully.',
                timer: 2000,
                showConfirmButton: false,
              });
    
              queryClient.invalidateQueries({ queryKey: ['allEventReg'] });
              return deleteOneEventReg.data;
            } else {
              await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: deleteOneEventReg.response.data.message || 'Failed to delete event registration.',
              });
            }
          } else {
            await Swal.fire({
              icon: 'info',
              title: 'Cancelled',
              text: 'The event registration was not deleted.',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (error: any) {
          console.error('Error deleting event registration:', error);
      
          await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error?.message || 'An unexpected error occurred while deleting the event registration.',
          });
        }
      };

    const getEventReg = async (event_reg_id: string): Promise<User[]> => {
        const getEventReg = await getOneEventReg(event_reg_id, authCookie);
        if (getEventReg.success) {
            setOpenUpdateModal(true)
            setDataEventReg(getEventReg.data[0])
        }
        throw new Error('No User Found');
    };

    const PAGE_SIZES = [10];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'event_reg_start_date',
        direction: 'desc',
    });
    
    return (
        <> 
            <div className='flex-column gap-5 pb-5'>
                <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
                    <div className='flex items-center justify-between ml-3 mr-6 mb-0'>
                        <h6 className="mb-5 text-lg font-bold">Event Registration</h6>
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
                                records={data?.data}
                                columns={[
                                    {
                                        accessor: 'event_reg_id',
                                        title: 'ID',
                                        sortable: false,
                                        render: ({ event_reg_id }) => (
                                            <div className="font-semibold hover:no-underline">{event_reg_id}</div>
                                        ),
                                    },
                                    {
                                        accessor: 'event_reg_status_name',
                                        title: 'Status Name',
                                        sortable: false,
                                        render: ({ event_reg_status_name }) => (
                                            <div className="flex items-center font-semibold">
                                                <div>{event_reg_status_name}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'event_reg_phase_name',
                                        title: 'Phase Name',
                                        sortable: false,
                                        render: ({ event_reg_phase_name }) => (
                                            <div className="flex items-center font-semibold">
                                                <div>{event_reg_phase_name}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'event_reg_start_date',
                                        title: 'Period',
                                        sortable: true,
                                        render: ({ event_reg_start_date, event_reg_end_date}) => (
                                            <div className="flex items-center font-semibold">
                                                <div>{ `${formatedDate(event_reg_start_date)} - ${formatedDate(event_reg_end_date)}` }</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'action',
                                        title: 'Action',
                                        sortable: false,
                                        render: ({ event_reg_id }) => (
                                            <div className="ml-[5%] flex w-full gap-2">
                                                <div className="relative group">
                                                    <button
                                                    className="btn2 btn-secondary p-1 w-7 h-7"
                                                    onClick={()=>getEventReg(event_reg_id)}
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
                                                    onClick={()=>deleteEventRegs(event_reg_id)}
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
                                key="event_reg_id"
                                totalRecords={data?.data ? data.pagination.totalData : 0}
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
            <CreateEventRegModal
                open={openModal}
                setOpen={setOpenModal}
                setDataChange={setDataChange}
            />
            <UpdateEventRegModal
                open={openUpdateModal}
                setOpen={setOpenUpdateModal}
                setDataChange={setDataChange}
                eventRegData={dataEventReg}
            />
        </>
    );
};

export default EventRegistrationList;

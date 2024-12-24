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
import CreateEventStatusModal from './components-create-event-phase';
import { deleteEventPhase, getAllEventPhases, getOneEventPhase } from '@/api/event-reg/api-event-reg';
import UpdateEventPhaseModal from './components-update-event-phase-modal';

const EventPhaseList = () => {
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
    const [dataEventPhase, setDataEventPhase] = useState<EventRegPhase>({
        event_reg_phase_id: '',
        event_reg_phase_code: '',
        event_reg_phase_name: '',
        event_reg_phase_desc: '',
    });

    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getAllEventPhase = async (): Promise<EventRegPhase[]> => {
        const getAllEventPhase = await getAllEventPhases(authCookie);
        if (getAllEventPhase.success) {
            return getAllEventPhase.data;
        }
        throw new Error('No ongoing event');
    };


    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allEventPhase', page, limit, sort],
        queryFn: () => getAllEventPhase(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
    });

    const deleteEventPhases = async (event_reg_phase_id: string) => {
        try {
          const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone. Do you want to delete this event reg phase?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
          });
      
          if (confirmResult.isConfirmed) {
            const deleteOneEventPhase = await deleteEventPhase(event_reg_phase_id, authCookie);
      
            if (deleteOneEventPhase.success) {
              await Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Event reg phase deleted successfully.',
                timer: 2000,
                showConfirmButton: false,
              });
    
              queryClient.invalidateQueries({ queryKey: ['allEventPhase'] });
              return deleteOneEventPhase.data;
            } else {
              await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: deleteOneEventPhase.response.data.message || 'Failed to delete event reg phase.',
              });
            }
          } else {
            await Swal.fire({
              icon: 'info',
              title: 'Cancelled',
              text: 'The event reg phase was not deleted.',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (error: any) {
          console.error('Error deleting event reg phase:', error);
      
          await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error?.message || 'An unexpected error occurred while deleting the event reg phase.',
          });
        }
      };

      const getEventPhase = async (event_reg_phase_id: string): Promise<User[]> => {
        const getEventPhase = await getOneEventPhase(event_reg_phase_id, authCookie);
        if (getEventPhase.success) {
            setOpenUpdateModal(true)
            setDataEventPhase(getEventPhase.data[0])
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
            <div className='flex-column gap-5 pb-5'>
                <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
                    <div className='flex items-center justify-between ml-3 mr-6 mb-0'>
                        <h6 className="mb-5 text-lg font-bold">Event Phase</h6>
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
                                        accessor: 'event_reg_phase_id',
                                        title: 'ID',
                                        sortable: true,
                                        render: ({ event_reg_phase_id }) => (
                                            <div className="font-semibold hover:no-underline">{event_reg_phase_id}</div>
                                        ),
                                    },
                                    {
                                        accessor: 'event_reg_phase_code',
                                        title: 'Code',
                                        sortable: true,
                                        render: ({ event_reg_phase_code }) => (
                                            <div className="flex items-center font-semibold">
                                                <div>{event_reg_phase_code}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'event_reg_phase_name',
                                        title: 'Name',
                                        sortable: true,
                                        render: ({ event_reg_phase_name }) => (
                                            <div className="flex items-center font-semibold">
                                                <div>{event_reg_phase_name}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'event_reg_phase_desc',
                                        title: 'Description',
                                        sortable: true,
                                        render: ({ event_reg_phase_desc }) => (
                                            <div className="flex items-center font-semibold">
                                                <div>{ event_reg_phase_desc}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'action',
                                        title: 'Action',
                                        sortable: false,
                                        render: ({ event_reg_phase_id }) => (
                                            <div className="ml-[5%] flex w-full gap-4">
                                                    <button 
                                                    className="btn2 btn-secondary"
                                                    onClick={()=>getEventPhase(event_reg_phase_id)}
                                                    >
                                                        Update
                                                    </button>

                                                    <button 
                                                    className="btn2 btn-gradient3"
                                                    onClick={()=>deleteEventPhases(event_reg_phase_id)}
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
            <CreateEventStatusModal
                open={openModal}
                setOpen={setOpenModal}
                setDataChange={setDataChange}
            />
            <UpdateEventPhaseModal
                open={openUpdateModal}
                setOpen={setOpenUpdateModal}
                setDataChange={setDataChange}
                eventPhaseData={dataEventPhase}
            />
        </>
    );
};

export default EventPhaseList;

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
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import { deleteChampionCategory, getAllChampionCategory, getOneChampionCategory } from '@/api/champion/api-champions';
import CreateChampionCategoryModal from './components-create-champion-category-modal';
import UpdateChampionCategoryModal from './components-update-champion-category-modal';
import { formatedDate } from '@/utils/date-format';

const ChampionCategoryList = () => {
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
    const [dataChampionCategory, setDataChampionCategory] = useState<ChampionCategoryType>({
        champion_category_id: '',
        champion_category_name: '',
        event_price_id: '',
        event_price_name: '',
        champion_category_created_date: ''
    });
    
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getAllChampionCategories = async (): Promise<ChampionCategoryType[]> => {
        const getAllChampionCategories = await getAllChampionCategory(authCookie);
        if (getAllChampionCategories.success) {
            return getAllChampionCategories.data;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data, refetch } = useQuery({
        queryKey: ['allChampionCategories', page, limit, sort],
        queryFn: () => getAllChampionCategories(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
    });

    const deleteChampionCategories = async (champion_category_id: string) => {
        try {
          const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone. Do you want to delete this champion category?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
          });
      
          if (confirmResult.isConfirmed) {
            const deleteOneChampionCategory = await deleteChampionCategory(champion_category_id, authCookie);
      
            if (deleteOneChampionCategory.success) {
              await Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Champion category deleted successfully.',
                timer: 2000,
                showConfirmButton: false,
              });
    
              queryClient.invalidateQueries({ queryKey: ['allChampionCategories'] });
              return deleteOneChampionCategory.data;
            } else {
              await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: deleteOneChampionCategory.response.data.message || 'Failed to delete champion category.',
              });
            }
          } else {
            await Swal.fire({
              icon: 'info',
              title: 'Cancelled',
              text: 'The champion category was not deleted.',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (error: any) {
          console.error('Error deleting champion category:', error);
      
          await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error?.message || 'An unexpected error occurred while deleting the champion category.',
          });
        }
      };

    const getChampionCategory = async (champion_category_id: string): Promise<User[]> => {
        const getChampionCategory = await getOneChampionCategory(champion_category_id, authCookie);
        if (getChampionCategory.success) {
            setOpenUpdateModal(true)
            setDataChampionCategory(getChampionCategory.data[0])
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
        columnAccessor: 'status',
        direction: 'asc',
    });

    
    return (
        <>
        <div className='flex-column gap-5'>
            <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
                <div className='flex items-center justify-between ml-3 mr-6 mb-0'>
                    <h6 className="mb-5 text-lg font-bold">Champion Category</h6>
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
                                    accessor: 'champion_category_id',
                                    title: 'ID',
                                    sortable: true,
                                    render: ({ champion_category_id }) => (
                                        <div className="font-semibold hover:no-underline">{champion_category_id}</div>
                                    ),
                                },
                                {
                                    accessor: 'champion_category_name',
                                    title: 'Name',
                                    sortable: true,
                                    render: ({ champion_category_name }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{champion_category_name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'event_price_name',
                                    title: 'Event Price',
                                    sortable: true,
                                    render: ({ event_price_name }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{event_price_name}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'champion_category_created_date',
                                    title: 'Created Date',
                                    sortable: true,
                                    render: ({ champion_category_created_date }) => (
                                        <div className="flex items-center font-semibold">
                                            <div>{ formatedDate(champion_category_created_date) }</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    sortable: false,
                                    render: ({ champion_category_id }) => (
                                        <div className="ml-[5%] flex w-full gap-2">
                                            <div className="relative group">
                                                <button
                                                className="btn2 btn-secondary p-1 w-7 h-7"
                                                onClick={() => getChampionCategory(champion_category_id)}
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
                                                onClick={() => deleteChampionCategories(champion_category_id)}
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
                            onSortStatusChange={setSortStatus}
                            paginationText={({ from, to, totalRecords }) =>
                                `\u00A0\u00A0\u00A0Showing ${from} to ${to} of ${totalRecords} entries`
                            }
                        />
                    )}
                </div>
            </div>
            </div>
        </div>
            <CreateChampionCategoryModal
                open={openModal}
                setOpen={setOpenModal}
                setDataChange={setDataChange}
            />
            <UpdateChampionCategoryModal
                open={openUpdateModal}
                setOpen={setOpenUpdateModal}
                setDataChange={setDataChange}
                championCategoryData={dataChampionCategory}
            />
        </>
    );
};

export default ChampionCategoryList;

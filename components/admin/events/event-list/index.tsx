/* eslint-disable @next/next/no-img-element */
'use client';

import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerWithText from '@/components/UI/Spinner';
import { deleteEvent, getAllEvent, getOneEvent, updateEventIsActive, } from '@/api/event-reg/api-event';
import { formatedDate } from '@/utils/date-format';
import IconCircle from '@/components/icon/menu/icon-circle';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import Swal from 'sweetalert2';
import CreateEventModal from './components-create-event-modal';
import UpdateEventModal from './components-update-event-modal';
import { formatMataUang } from '@/utils/curency-format';

const EventList = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state: IRootState) => state.auth.user);
    const queryClient = useQueryClient();
    const [openModal, setOpenModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [dataChange, setDataChange] = useState(false);
    const [dataEvent, setDataEvent] = useState<AllEvents>({
        event_id: '',
        event_name: '',
        event_desc: '',
        event_start_date: '',
        event_end_date: '',
        event_price_ids: [''],
        event_reg_id: '',
        event_reg_status_id: '',
        event_reg_status_code: '',
        event_reg_status_name: '',
        event_reg_status_desc: '',
        event_reg_phase_id: '',
        event_reg_phase_code: '',
        event_reg_phase_name: '',
        event_reg_phase_desc: '',
        event_reg_period_id: '',
        event_reg_start_date: '',
        event_reg_end_date: '',
        event_reg_created_date: '',
        event_is_active: false,
        event_created_date: '',
        event_prices: []
    });
    
    
    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const getAllEvents = async (): Promise<AllEvents[]> => {
        const getAllEvents = await getAllEvent(authCookie);
        if (getAllEvents.success) {
            return getAllEvents.data;
        }
        throw new Error('No ongoing event');
    };

    const { isPending, data, error, refetch } = useQuery({
        queryKey: ['allEvent'],
        queryFn: () => getAllEvents(),
        enabled: !!authCookie && !!user?.user_id,
        refetchOnWindowFocus: false,
    });

    const deleteEvents = async (event_id: string) => {
        try {
          const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone. Do you want to delete this event?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
          });
      
          if (confirmResult.isConfirmed) {
            const deleteOneEvent = await deleteEvent(event_id, authCookie);
      
            if (deleteOneEvent.success) {
              await Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Event deleted successfully.',
                timer: 2000,
                showConfirmButton: false,
              });
    
              queryClient.invalidateQueries({ queryKey: ['allEvent'] });
              return deleteOneEvent.data;
            } else {
              await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: deleteOneEvent.response.data.message || 'Failed to delete event.',
              });
            }
          } else {
            await Swal.fire({
              icon: 'info',
              title: 'Cancelled',
              text: 'The event was not deleted.',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (error: any) {
          console.error('Error deleting event:', error);
      
          await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error?.message || 'An unexpected error occurred while deleting the event.',
          });
        }
      };

      useEffect(() => {
        const params = new URLSearchParams();
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        if (window.location.href !== newUrl) {
            window.history.replaceState(null, '', newUrl);
        }
        if (dataChange) {
            refetch();
            setDataChange(false);
        }
    }, [router, dataChange, refetch]);

    const getEvent = async (event_id: string): Promise<User[]> => {
        const getEvent = await getOneEvent(event_id, authCookie);
        if (getEvent.success) {
            setOpenUpdateModal(true)
            setDataEvent(getEvent.data[0])
        }
        throw new Error('No User Found');
    };

    const updateIsActive = async (event_id: string) => {
        try {
          const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone. Do you want to update the activity status of this event?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
          });
      
          if (confirmResult.isConfirmed) {
            const updateIsActive = await updateEventIsActive(event_id, authCookie);
      
            if (updateIsActive.success) {
              await Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Event activity status updated successfully.',
                timer: 2000,
                showConfirmButton: false,
              });
    
              queryClient.invalidateQueries({ queryKey: ['allEvent'] });
              return updateIsActive.data;
            } else {
              await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: updateIsActive.response.data.message || 'Failed to update event activity status.',
              });
            }
          } else {
            await Swal.fire({
              icon: 'info',
              title: 'Cancelled',
              text: 'The event activity status was not updated.',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (error: any) {
          console.error('Error updating event activity status:', error);
      
          await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error?.message || 'An unexpected error occurred while updating the event activity status.',
          });
        }
      };

    if (isPending) {
        return (
            <div className="flex min-h-[75vh] w-full flex-col items-center justify-center">
                <SpinnerWithText text="Memuat..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[75vh] w-full flex-col items-center justify-center text-red-500">
                <p>Error: {error.message}</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="mb-5 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
                <div className="flex min-h-[50vh] min-w-[50vh] h-full items-center justify-center rounded-md shadow-lg ml-25">
                    <div className="text-primary text-center">
                        <p className="text-xl font-extrabold capitalize">No data</p>
                        <p className="mt-1 text-sm font-semibold capitalize">Belum ada event</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-row justify-between items-center mb-5 px-3">
                <h6 className="text-lg font-bold">Events</h6>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setOpenModal(true)}
                >
                    Create New
                </button>
            </div>
            <div className="mb-5 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {data?.map((event) => {
                    const statusColor =
                        event.event_reg_status_code === 'green_status'
                            ? '#66e89b'
                            : event.event_reg_status_code === 'yellow_status'
                            ? '#e2a03f'
                            : event.event_reg_status_code === 'red_status'
                            ? '#e7515a'
                            : '#888ea8';

                    return (
                        <div key={event.event_id} className="panel flex flex-col h-full justify-between rounded-md p-5 shadow-lg min-h-[30vh] ">
                            <div className='font-semibold'>
                                <div className='flex flex-row justify-between'>
                                    <p className="text-xl font-extrabold capitalize text-primary">{event.event_name}</p>
                                    <div className='flex flex-row gap-2'>
                                        <div className="relative group">
                                            <button
                                            className="btn2 btn-secondary p-1 w-7 h-7"
                                            onClick={() => getEvent(event.event_id)}
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
                                            onClick={() => deleteEvents(event.event_id)}
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
                                </div>
                                <p className="mt-1 text-sm capitalize">Description: <span className='font-bold'>{event.event_desc}</span></p>
                                <p className="mt-1 text-sm capitalize">
                                    Status: <span className='font-bold'>{event.event_is_active ? 'Ongoing' : 'Inactive'}</span>
                                </p>
                                <p className="mt-1 text-sm capitalize">
                                    Event Period: 
                                    <span className='font-bold'>{`${formatedDate(event.event_start_date)} - ${formatedDate(event.event_end_date)}`}</span>
                                </p>
                                <p className="mt-1 text-sm capitalize">
                                    Event Status: <span className='font-bold'>{event.event_reg_status_name}</span>
                                </p>
                                <p className="mt-1 text-sm capitalize">
                                    Event Phase: <span className='font-bold'>{event.event_reg_phase_name}</span>
                                </p>
                                <p className="mt-1 text-sm capitalize">
                                    Event Phase's Period: <span className='font-bold'>{`${formatedDate(event.event_reg_start_date)} - ${formatedDate(event.event_reg_end_date)}`}</span>
                                </p>
                                <p className="mt-1 text-sm capitalize">
                                    Event Prices:
                                    <ul className="mt-2 font-bold">
                                        {event.event_prices.map((price: any) => (
                                            <li key={price.event_price_id} className="ml-4">
                                                {`- ${price.event_price_name}: ${formatMataUang(price.event_price_amount)}`}
                                            </li>
                                        ))}
                                    </ul>
                                </p>
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => updateIsActive(event.event_id)}
                            >
                                Toggle Activity
                            </button>
                        </div>
                    );
                })}
            </div>
            <CreateEventModal
                open={openModal}
                setOpen={setOpenModal}
                setDataChange={setDataChange}
            />
            <UpdateEventModal
                open={openUpdateModal}
                setOpen={setOpenUpdateModal}
                setDataChange={setDataChange}
                eventData={dataEvent}
            />
        </>
    );
};

export default EventList;

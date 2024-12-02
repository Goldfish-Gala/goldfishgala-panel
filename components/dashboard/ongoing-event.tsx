'use client';

import { useCookies } from 'next-client-cookies';
import IconClock from '../icon/icon-clock';
import IconCircle from '../icon/menu/icon-circle';
import { getOneEvent, getAllOngoingEvents } from '@/api/api-event';
import SpinnerWithText from '../UI/Spinner';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useState } from 'react';

const OngoingEvent = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [isDisable, setDisable] = useState(false);

    const fetchOngoingEvent = async (): Promise<OneOngoingEvent> => {
        const onGoingEvent = await getAllOngoingEvents(authCookie);
        if (onGoingEvent.success) {
            return onGoingEvent.data.OnGoing[0];
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['ongoingEvent'],
        queryFn: () => fetchOngoingEvent(),
        enabled: !!authCookie,
    });

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const statusCode = data?.event_reg_status_code;
    const statusColor =
        statusCode === 'green_status'
            ? '#00ab55'
            : statusCode === 'yellow_status'
            ? '#e2a03f'
            : statusCode === 'red_status'
            ? '#e7515a'
            : '#888ea8';
    const phaseCode = data?.event_reg_phase_code;
    const eventPhase =
        phaseCode === 'open_phase'
            ? 'Pendaftaran dibuka'
            : phaseCode === 'closed_phase'
            ? 'Pendaftaran ditutup'
            : phaseCode === 'on_review_phase'
            ? 'Sedang dalam penilaian'
            : phaseCode === 'coming_soon_phase'
            ? 'Segera hadir'
            : phaseCode === 'content_upload_phase'
            ? 'Submit post instagram'
            : 'Pengumuman juara';

    const handleRegisterFalse = async () => {
        const msg = phaseCode === 'coming_soon_phase' ? 'Pendaftaran belum dibuka' : 'Pendaftaran sudah ditutup';
        showMessage(msg, 'info');
    };

    const dayLeft = () => {
        const endDate = data?.event_reg_end_date ? new Date(data.event_reg_end_date) : null;
        if (endDate) {
            const currentDate = new Date();
            const timeDiff = endDate.getTime() - currentDate.getTime();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return daysRemaining;
        } else {
            console.log('End date is not available.');
        }
    };

    return (
        <div className="panel lg:col-span-2">
            {isPending ? (
                <div className="flex min-h-[336px] w-full flex-col items-center justify-center md:min-h-[348px]">
                    <SpinnerWithText text="Memuat..." />
                </div>
            ) : (
                <>
                    <div className="mb-5">
                        <h5 className="text-lg font-semibold dark:text-white-light">Event sedang berlangsung</h5>
                    </div>
                    <div className="flex h-full w-full flex-col items-center gap-8 px-6 pb-4 xl:gap-10">
                        <div className="flex w-full flex-col items-center gap-8 font-semibold text-white-dark xl:mt-2">
                            <p className="text-xl font-extrabold text-dark dark:text-white-dark md:text-2xl lg:text-3xl xl:text-4xl">
                                {data?.event_name}
                            </p>
                            <div className="w-[320px] rounded border border-[#ebedf2] p-6 px-3 dark:border-0 dark:bg-[#1b2e4b] sm:px-6 md:w-[420px]">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex w-[40%] items-center justify-between">
                                            <p className="text-sm font-bold md:text-lg">Status / Fase</p>
                                            <p>:</p>
                                        </div>
                                        <div className="item-center flex gap-2">
                                            <div className="pt-0.5 md:pt-1">
                                                <IconCircle fill={statusColor} />
                                            </div>
                                            <p className="text-xs font-semibold md:text-sm">{eventPhase}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex w-[40%] items-center justify-between">
                                            <p className="text-sm font-bold md:text-lg">Durasi</p>
                                            <p>:</p>
                                        </div>
                                        <p className="flex items-center rounded-full bg-white-light px-2 py-0.5 text-xs font-semibold text-dark dark:bg-dark dark:text-white-light">
                                            <IconClock className="h-3 w-3 ltr:mr-1 rtl:ml-1" />
                                            {dayLeft()} Hari lagi
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {phaseCode === 'open_phase' ? (
                            <Link href={`/fish-registration/${data?.event_id}`}>
                                <button
                                    disabled={isDisable}
                                    className="btn btn-primary mb-5 hover:bg-info  active:scale-95"
                                    onClick={() => setDisable(true)}
                                >
                                    {isDisable ? 'Loading...' : 'Daftarkan Ikanmu Sekarang'}
                                </button>
                            </Link>
                        ) : (
                            <button
                                className="btn btn-primary mb-5 hover:bg-info  active:scale-95"
                                onClick={handleRegisterFalse}
                            >
                                Daftarkan Ikanmu Sekarang
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default OngoingEvent;

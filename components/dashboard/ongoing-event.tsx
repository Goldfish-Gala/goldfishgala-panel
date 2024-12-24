'use client';

import { useCookies } from 'next-client-cookies';
import IconClock from '../icon/icon-clock';
import IconCircle from '../icon/menu/icon-circle';
import SpinnerWithText from '../UI/Spinner';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useState } from 'react';
import { getAllOngoingEvents } from '@/api/event-reg/api-event';

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
        refetchOnWindowFocus: false,
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
            ? '#66e89b'
            : statusCode === 'yellow_status'
            ? '#e2a03f'
            : statusCode === 'red_status'
            ? '#e7515a'
            : '#888ea8';
    const phaseCode = data?.event_reg_phase_code;

    // const eventPhase =
    //     phaseCode === 'open_phase'
    //         ? 'PENDAFTARAN DIBUKA'
    //         : phaseCode === 'closed_phase'
    //             ? 'PENDAFTARAN DITUTUP'
    //             : phaseCode === 'on_review_phase'
    //                 ? 'FASE PENILAIAN'
    //                 : phaseCode === 'content_upload_phase'
    //                     ? 'FASE SUBMIT CONTENT'
    //                     : 'PENGUMUMAN JUARA';

    const handleRegisterFalse = async () => {
        const msg =
            phaseCode === 'coming_soon_phase' || statusCode !== 'grey_status'
                ? 'PENDAFTARAAN BELUM DIBUKA'
                : 'PENDAFTARAAN SUDAH DITUTUP';
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

    console.log(data, 'isi data ongoing event');

    return (
        <div className="panel lg:col-span-2">
            {isPending ? (
                <div className="flex min-h-[336px] w-full flex-col items-center justify-center md:min-h-[348px]">
                    <SpinnerWithText text="Memuat..." />
                </div>
            ) : (
                <>
                    {data && (
                        <div className="mb-5 text-center">
                            <h5 className="text-sm font-semibold text-white dark:text-white-light">
                                Introducing Our Latest Event
                            </h5>
                        </div>
                    )}
                    {!data ? (
                        <div className="flex min-h-[200px] flex-wrap items-center justify-center">
                            <p className="mx-auto mt-10 text-base font-extrabold text-white dark:text-white-light md:mt-10">
                                Saat ini tidak ada event yang berlangsung. Follow Instagram kami untuk update terbaru.
                            </p>
                        </div>
                    ) : (
                        <div className="flex h-full w-full flex-col items-center gap-8 px-6 pb-4 xl:gap-10">
                            <div className="flex w-full flex-col items-center gap-2 font-semibold text-white xl:mt-2">
                                <p className="bg-gradient-to-r from-[#C8A02F] to-[#A88E4B] bg-clip-text text-xl font-extrabold text-transparent dark:from-[#F8F3AC] dark:to-[#E0C052] md:text-2xl lg:text-3xl xl:text-4xl">
                                    {data?.event_name}
                                </p>
                                <p className="text-md mb-5 bg-gradient-to-r from-[#C8A02F] to-[#A88E4B] bg-clip-text text-transparent dark:from-[#F8F3AC] dark:to-[#E0C052] md:text-base">
                                    {data?.event_desc}
                                </p>
                                <div
                                    className="w-[320px] rounded-lg bg-white p-6 px-3 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-[#1b2e4b] sm:px-6 md:w-[420px]"
                                    style={{
                                        background: 'linear-gradient(130deg, #FFDE4D, #F1C376)',
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex w-full items-center justify-between text-sm font-semibold text-white">
                                            <p>Status / Fase</p>
                                            <div className="flex items-center gap-2">
                                                <div className="animate-heartbeat pt-0.5 md:pt-0">
                                                    <IconCircle fill={statusColor} />
                                                </div>
                                                <p className="text-gold-400 text-xs font-bold md:text-sm">
                                                    {data?.event_reg_phase_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center justify-between text-sm font-semibold text-white">
                                            <p>Durasi</p>
                                            <p className="bg-gold-300 flex items-center rounded-full bg-dark px-2 py-0.5 text-xs font-semibold text-white dark:text-white-light">
                                                <IconClock className="mr-1 h-3 w-3" />
                                                {dayLeft()} Hari lagi
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {phaseCode === 'open_phase' && statusCode !== 'grey_status' ? (
                                <Link href={`/fish-registration/${data?.event_id}`}>
                                    <button
                                        disabled={isDisable}
                                        className="btn btn-primary bg-gold-500 hover:bg-gold-600 mb-5 text-white transition duration-300 ease-in-out active:scale-95"
                                        onClick={() => setDisable(true)}
                                    >
                                        {isDisable ? 'Loading...' : 'DAFTAR SEKARANG'}
                                    </button>
                                </Link>
                            ) : (
                                <button
                                    className="btn btn-primary bg-gold-400 hover:bg-gold-600 mb-5 text-white-light transition duration-300 ease-in-out active:scale-95"
                                    onClick={handleRegisterFalse}
                                >
                                    DAFTAR SEKARANG
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default OngoingEvent;

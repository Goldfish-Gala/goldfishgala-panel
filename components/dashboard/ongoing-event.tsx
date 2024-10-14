'use client';

import { useCookies } from 'next-client-cookies';
import IconClock from '../icon/icon-clock';
import IconCircle from '../icon/menu/icon-circle';
import { getAllevent, getOneEvent } from '@/api/api-event';
import SpinnerWithText from '../UI/Spinner';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

const OngoingEvent = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('authCookies');

    const fetchOngoingEvent = async (): Promise<OngoingEvent> => {
        const getAllEvent = await getAllevent(authCookie);
        if (getAllEvent.data && getAllEvent.data.OnGoing.length > 0) {
            const getOngoingEvent = await getOneEvent(authCookie, getAllEvent.data.OnGoing[0].event_id);
            console.log('Fetched Ongoing Event:', getOngoingEvent.data[0]);
            return getOngoingEvent.data[0];
        }
        throw new Error('No ongoing event');
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['ongoingEvent'],
        queryFn: () => fetchOngoingEvent(),
        enabled: !!authCookie,
    });

    return (
        <div className="panel lg:col-span-2">
            <div className="mb-5">
                <h5 className="text-lg font-semibold dark:text-white-light">Event sedang berlangsung</h5>
            </div>
            {isPending ? (
                <div className="flex min-h-[336px] w-full flex-col items-center justify-center md:min-h-[348px]">
                    <SpinnerWithText text="Memuat..." />
                </div>
            ) : (
                <div className="flex h-full w-full flex-col items-center gap-8 px-6 pb-4 xl:gap-10">
                    <div className="flex w-full flex-col items-center gap-8 font-semibold text-white-dark xl:mt-8">
                        <p className="text-xl font-extrabold text-dark dark:text-white-dark md:text-2xl lg:text-3xl xl:text-4xl">
                            {data?.event_name}
                        </p>
                        <div className="w-[350px] rounded border border-[#ebedf2] p-6 dark:border-0 dark:bg-[#1b2e4b] md:w-[400px]">
                            <div className="flex flex-col items-center justify-between">
                                <div className="flex w-full items-center justify-between">
                                    <p className="w-1/2 text-base font-bold md:text-lg">Total Hadiah</p>
                                    <div className="flex w-1/2 justify-between">
                                        <p>:</p>
                                        <p>Rp 10.000.000</p>
                                    </div>
                                </div>
                                <div className="flex w-full items-center justify-between">
                                    <p className="w-1/2 text-base font-bold md:text-lg">Status</p>
                                    <div className="flex w-1/2 items-center justify-between">
                                        <p>:</p>
                                        <div className="item-center flex gap-2">
                                            <div className="pt-0.5 md:pt-1">
                                                <IconCircle fill={'#f67062'} />
                                            </div>
                                            <p className="text-xs font-semibold md:text-sm">Pendaftaran dibuka</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <div className="flex w-full items-center justify-between font-semibold">
                            <p className="flex items-center rounded-full bg-dark px-2 py-1 text-xs font-semibold text-white-light">
                                <IconClock className="h-3 w-3 ltr:mr-1 rtl:ml-1" />5 Days Left
                            </p>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-dark-light p-0.5 dark:bg-dark-light/10">
                            <div
                                className="relative h-full w-full rounded-full bg-gradient-to-r from-[#f67062] to-[#fc5296]"
                                style={{ width: '65%' }}
                            ></div>
                        </div>
                    </div>
                    <button
                        className="btn btn-primary mb-5"
                        onClick={() => router.push(`/fish-registration/${data?.event_id}`)}
                    >
                        Daftarkan Ikanmu Sekarang
                    </button>
                </div>
            )}
        </div>
    );
};

export default OngoingEvent;

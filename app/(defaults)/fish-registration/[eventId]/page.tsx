import FishRegistrationForm from '@/components/fish-registration/fish-form';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Fish Registration',
};

const FishRegistration = ({ params }: { params: { eventId: string } }) => {
    return (
        <div>
            <ul className="mb-5 flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Dashboard</span>
                </li>
                <li className="text-primary before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 ">
                    <span>Beranda</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 ">
                    <span>Event Registration</span>
                </li>
            </ul>
            <div className="panel">
                <div className="relative w-full max-w-[870px] rounded-md">
                    <div className="relative flex flex-col rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-6">
                                <h1 className="dark:text-shadow-dark-mode text-2xl font-extrabold uppercase !leading-snug text-primary md:text-3xl">
                                    Pendaftaran Ikan
                                </h1>
                                <p className="text-base font-bold leading-normal text-dark dark:text-white-dark ">
                                    Lengkapi data ikan untuk pendaftaran
                                </p>
                            </div>
                            <FishRegistrationForm params={params} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FishRegistration;

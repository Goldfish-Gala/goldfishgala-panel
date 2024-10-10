/* eslint-disable @next/next/no-img-element */
import FirstLoginForm from '@/components/auth/components-first-login-form';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Register Boxed',
};

const BoxedSignUp = () => {
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/hero.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img
                    src="/assets/images/auth/coming-soon-object1.png"
                    alt="image"
                    className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
                />
                <img
                    src="/assets/images/auth/coming-soon-object2.png"
                    alt="image"
                    className="absolute left-24 top-0 h-40 md:left-[30%]"
                />
                <img
                    src="/assets/images/auth/coming-soon-object3.png"
                    alt="image"
                    className="absolute right-0 top-0 h-[300px]"
                />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-xl dark:bg-black/70 lg:min-h-[758px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="dark:text-shadow-dark-mode text-2xl font-extrabold uppercase !leading-snug text-primary md:text-3xl">
                                    Pembaruan Data
                                </h1>
                                <p className="text-base font-bold leading-normal text-dark dark:text-white-dark ">
                                    Lengkapi data diri untuk melanjutkan ke dashboard
                                </p>
                            </div>
                            <FirstLoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoxedSignUp;

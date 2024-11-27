/* eslint-disable @next/next/no-img-element */
import FirstLoginForm from '@/components/auth/components-first-login-form';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

export const metadata: Metadata = {
    title: 'Register Boxed',
};

const BoxedSignUp = () => {
    return (
        <div>
            <div className="absolute inset-0">
                <Image
                    width={1500}
                    height={1500}
                    src="/assets/images/auth/bg-gradient.png"
                    alt="image"
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="absolute inset-0">
                    <Image
                        src="/assets/images/auth/hero.png"
                        alt="hero background"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>

                <Image
                    src="/assets/images/auth/coming-soon-object1.png"
                    alt="coming soon object 1"
                    width={893}
                    height={893}
                    className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
                />
                <Image
                    src="/assets/images/auth/coming-soon-object2.png"
                    alt="coming soon object 2"
                    width={160}
                    height={160}
                    className="absolute left-24 top-0 h-40 md:left-[30%]"
                />
                <Image
                    src="/assets/images/auth/coming-soon-object3.png"
                    alt="coming soon object 3"
                    width={300}
                    height={300}
                    className="absolute right-0 top-0 h-[300px]"
                />
                <Image
                    src="/assets/images/auth/polygon-object.svg"
                    alt="polygon object"
                    width={150}
                    height={150}
                    className="absolute bottom-0 end-[28%]"
                />
                <div className="relative w-full max-w-[870px] rounded-md">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-xl dark:bg-black/70 lg:min-h-[758px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="dark:text-shadow-dark-mode text-2xl font-extrabold uppercase !leading-snug text-primary md:text-3xl">
                                    Update User Data
                                </h1>
                                <p className="text-base font-bold leading-normal text-dark dark:text-white-dark ">
                                    Complete the user data for continue to panel page
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

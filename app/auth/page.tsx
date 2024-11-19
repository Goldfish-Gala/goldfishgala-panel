/* eslint-disable @next/next/no-img-element */
import GoogleButton from '@/components/components/google-button';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

export const metadata: Metadata = {
    title: 'Authentication',
};

const BoxedSignIn = () => {
    return (
        <div>
            <div className="absolute inset-0">
                <Image
                    layout="fill"
                    src="/assets/images/auth/bg-gradient.png"
                    alt="background gradient"
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

                <div className="relative w-full max-w-[500px] rounded-md dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex min-h-[400px] flex-col justify-center rounded-md bg-white/60 px-6 py-4 backdrop-blur-3xl dark:bg-black/50">
                        <div className="mx-auto flex h-[180px] w-full flex-col items-center justify-between">
                            <div className="flex w-full justify-center">
                                <h1 className="dark:text-shadow-dark-mode text-2xl font-extrabold uppercase !leading-snug text-primary md:text-3xl">
                                    Otentikasi
                                </h1>
                            </div>
                            <div>
                                <ul className="flex justify-center gap-3.5 text-white">
                                    <li>
                                        <GoogleButton />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoxedSignIn;

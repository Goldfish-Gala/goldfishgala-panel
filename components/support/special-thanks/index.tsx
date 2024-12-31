'use client';

import Image from 'next/image';

const SpecialThanks = () => {
    return (
        <div className="mb-10 mt-10 flex h-full w-full flex-col items-center justify-around gap-10 px-4 sm:m-0">
            <div className="flex w-fit flex-col items-center justify-center gap-6">
                <p className="text-2xl font-extrabold uppercase text-primary">our sponsor</p>
                <div className="flex w-full flex-col items-center justify-center space-x-6 rounded-lg px-8 py-2 sm:flex-row">
                    <div className="rounded-md px-6 dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/logo_java.png'}
                            width={1000}
                            height={1000}
                            className="h-[200px] w-auto rounded-md"
                            alt="java image"
                        />
                    </div>
                    <div className="rounded-md px-6 dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/logo_hikari.png'}
                            width={1000}
                            height={1000}
                            className="-ml-3 h-[200px] w-auto rounded-md sm:ml-0"
                            alt="hikari image"
                        />
                    </div>
                    <div className="rounded-md px-6 dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/logo_rad.png'}
                            width={1000}
                            height={1000}
                            className="h-[200px] w-auto rounded-md"
                            alt="rad image"
                        />
                    </div>
                </div>
            </div>
            <div className="flex w-fit flex-col items-center justify-center gap-6">
                <p className="text-2xl font-extrabold uppercase text-primary">partnered with</p>
                <div className="flex w-full flex-col items-center justify-center space-x-6 rounded-lg px-8 py-2 sm:flex-row">
                    <div className="rounded-md px-6 dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/logo_kokohkoki.png'}
                            width={1000}
                            height={1000}
                            className="h-[200px] w-auto rounded-md"
                            alt="kokohkoki image"
                        />
                    </div>
                    <div className="rounded-md px-6 dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/logo_grivo.png'}
                            width={1000}
                            height={1000}
                            className="h-[200px] w-auto rounded-md sm:ml-0"
                            alt="grivo image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecialThanks;

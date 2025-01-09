'use client';

import Image from 'next/image';

const SpecialThanks = () => {
    return (
        <div className="mb-10 mt-10 flex h-full w-full flex-col items-center justify-around gap-10 px-4 sm:m-0">
            <div className="flex w-fit flex-col items-center justify-center gap-4">
                <p className="text-2xl font-extrabold uppercase text-primary">our sponsors</p>
                <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg sm:flex-row sm:gap-2">
                    <div className="rounded-md px-4 dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/logo_hikari.png'}
                            width={1000}
                            height={1000}
                            className="h-auto w-[200px] rounded-md sm:ml-0 sm:h-[190px] sm:w-auto"
                            alt="hikari image"
                        />
                    </div>
                    <div className="rounded-md px-4 dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/logo_java.png'}
                            width={1000}
                            height={1000}
                            className="h-auto w-[200px] rounded-md sm:ml-0 sm:h-[190px] sm:w-auto"
                            alt="java image"
                        />
                    </div>
                    <div className="rounded-md px-4 dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/logo_rad.png'}
                            width={1000}
                            height={1000}
                            className="h-auto w-[200px] rounded-md sm:ml-0 sm:h-[190px] sm:w-auto"
                            alt="rad image"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-4 flex w-fit flex-col items-center justify-center gap-4">
                <p className="text-2xl font-extrabold uppercase text-primary">media partners</p>
                <div className="grid w-full grid-cols-1 items-center justify-center gap-6 rounded-lg sm:grid-cols-2 md:grid-cols-4 md:gap-1 xl:gap-2">
                    <div className="rounded-md dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/holyfish.png'}
                            width={1000}
                            height={1000}
                            className="h-[180px] w-auto rounded-md"
                            alt="holyfish image"
                        />
                    </div>
                    <div className="rounded-md dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/berawal.png'}
                            width={1000}
                            height={1000}
                            className="h-[180px] w-auto rounded-md"
                            alt="berawal image"
                        />
                    </div>
                    <div className="rounded-md dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/gempi.png'}
                            width={1000}
                            height={1000}
                            className="h-[180px] w-auto rounded-md"
                            alt="gempi image"
                        />
                    </div>
                    <div className="rounded-md dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/haibi.png'}
                            width={1000}
                            height={1000}
                            className="h-[180px] w-auto rounded-md"
                            alt="haibi image"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-6 flex w-fit flex-col items-center justify-center gap-4">
                <p className="text-2xl font-extrabold uppercase text-primary">powered by</p>
                <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg sm:flex-row">
                    <div className="rounded-md px-4 dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/logo_kokohkoki.png'}
                            width={1000}
                            height={1000}
                            className="h-[190px] w-auto rounded-md"
                            alt="kokohkoki image"
                        />
                    </div>
                    <div className="rounded-md px-4 dark:bg-dark-light">
                        <Image
                            src={'/assets/images/sponsor/logo_grivo.png'}
                            width={1000}
                            height={1000}
                            className="h-[190px] w-auto rounded-md sm:ml-0"
                            alt="grivo image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecialThanks;

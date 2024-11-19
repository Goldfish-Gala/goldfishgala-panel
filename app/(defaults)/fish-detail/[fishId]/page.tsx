import FishDetailComponent from '@/components/fish-detail';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Fish Detail',
};

const FishDetail = ({ params }: { params: { fishId: string } }) => {
    return (
        <div>
            <ul className="mb-5 flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Dashboard</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 ">
                    <span>Detail ikan</span>
                </li>
            </ul>
            <div className="flex w-full items-center justify-center">
                <div className="panel relative w-full max-w-lg p-0">
                    <FishDetailComponent params={params} />
                </div>
                {/* <div className="panel relative w-full rounded-md">
                    <div className="relative flex flex-col rounded-md bg-white/60 px-6 backdrop-blur-lg dark:bg-black/50">
                        test
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default FishDetail;

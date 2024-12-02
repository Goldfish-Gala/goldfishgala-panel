import Loading from '@/app/loading';
import BackButton from '@/components/components/back-button';
import FishDetailComponent from '@/components/fish-detail';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Fish Detail',
};

type Params = Promise<{ fishId: string }>;

const FishDetail = async (props: { params: Params }) => {
    const fish_id = { fish_id: (await props.params).fishId };
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
            <div className="mt-4 flex flex-wrap items-center justify-start">
                <BackButton />
            </div>
            <div className="flex w-full items-center justify-center">
                <div className="panel relative w-full max-w-lg p-0">
                    <FishDetailComponent params={fish_id} />
                </div>
            </div>
        </div>
    );
};

export default FishDetail;

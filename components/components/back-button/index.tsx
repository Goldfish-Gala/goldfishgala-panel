'use client';

import IconArrowBackward from '@/components/icon/icon-arrow-backward';
import { useRouter } from 'next/navigation';

const BackButton = () => {
    const router = useRouter();
    const handleBack = () => {
        router.back();
    };
    return (
        <div>
            <button onClick={handleBack} className="btn2 btn-gradient2 items-center gap-1 border-none px-3 py-1">
                <IconArrowBackward className="-mt-0.5" />
                Kembali
            </button>
        </div>
    );
};

export default BackButton;

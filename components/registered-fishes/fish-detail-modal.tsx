'use client';

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from '@/components/UI/Modal';
import ImageGallery from 'react-image-gallery';
import './style.css';
import { useEffect, useRef } from 'react';

interface FishDetailModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    data?: UserRegDetailType;
    isLoading: boolean;
}

const FishDetailModal = ({ open, setOpen, data, isLoading }: FishDetailModalProps) => {
    const imageGalleryRef = useRef(null);
    const images = [
        {
            original: data?.fish_image1 || '/assets/images/no-image.png',
            thumbnail: data?.fish_image1 || '/assets/images/no-image.png',
        },
        {
            original: data?.fish_image2 || '/assets/images/no-image.png',
            thumbnail: data?.fish_image2 || '/assets/images/no-image.png',
        },
        {
            original: data?.fish_image3 || '/assets/images/no-image.png',
            thumbnail: data?.fish_image3 || '/assets/images/no-image.png',
        },
    ];

    if (!open) return null;

    return (
        <div className="panel">
            <Dialog open={open}>
                <DialogContent className="panel  max-w-fit">
                    <DialogHeader className="self-start text-xl font-extrabold text-black dark:text-white md:text-2xl">
                        Detail Ikan
                    </DialogHeader>
                    <div className="image-gallery-container">
                        <div ref={imageGalleryRef}>
                            <ImageGallery
                                items={images}
                                infinite={false}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                lazyLoad={true}
                                showNav={false}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-around">
                        <div className="flex w-full justify-between">
                            <p className="dark:text-shadow-dark-mode self-start text-sm font-extrabold !leading-snug text-dark dark:text-secondary-light md:text-base">
                                Nama ikan
                            </p>
                            <p className="dark:text-shadow-dark-mode self-start text-sm font-extrabold !leading-snug text-dark dark:text-secondary-light md:text-base">
                                {':'}
                            </p>
                            <p className="self-end text-dark dark:text-dark-light"> {data?.fish_name}</p>
                        </div>
                        <div className="flex w-full justify-around">
                            <p className="dark:text-shadow-dark-mode text-sm font-extrabold !leading-snug text-dark dark:text-secondary-light md:text-base">
                                Nama event :
                            </p>
                            <p className="text-dark dark:text-dark-light"> {data?.event_name}</p>
                        </div>
                        <div className="flex w-full justify-around">
                            <p className="dark:text-shadow-dark-mode text-sm font-extrabold !leading-snug text-dark dark:text-secondary-light md:text-base">
                                Jenis kelamin ikan :
                            </p>
                            <p className="text-dark dark:text-dark-light"> {data?.fish_gender}</p>
                        </div>
                        <div className="flex w-full justify-around">
                            <p className="dark:text-shadow-dark-mode text-sm font-extrabold !leading-snug text-dark dark:text-secondary-light md:text-base">
                                Ukuran ikan :
                            </p>
                            <p className="text-dark dark:text-dark-light"> {data?.fish_size}</p>
                        </div>
                        <div className="flex w-full justify-around">
                            <p className="dark:text-shadow-dark-mode text-sm font-extrabold !leading-snug text-dark dark:text-secondary-light md:text-base">
                                Deskripsi ikan :
                            </p>
                            <p className="text-dark dark:text-dark-light"> {data?.fish_desc}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <div className="flex justify-center gap-6">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="btn2 btn-gradient2 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                            >
                                Tutup
                            </button>
                            <button
                                disabled={isLoading}
                                className="btn2 btn-gradient3 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                            >
                                Edit ikan
                            </button>
                        </div>
                    </DialogFooter>
                </DialogContent>
                <DialogClose></DialogClose>
            </Dialog>
        </div>
    );
};

export default FishDetailModal;

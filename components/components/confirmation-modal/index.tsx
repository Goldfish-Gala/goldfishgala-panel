'use client';

import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';

interface ConfirmationModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    mainText: string;
    subText?: string;
    isLoading: boolean;
    state?: string;
    cancelButton: string;
    confirmButton: string;
    handleConfirm: () => void;
}

const ConfirmationModal = ({
    open,
    setOpen,
    title,
    mainText,
    subText,
    isLoading,
    state,
    cancelButton,
    confirmButton,
    handleConfirm,
}: ConfirmationModalProps) => {
    useEffect(() => {
        if (state) {
            setOpen(false);
        }
    }, [setOpen, state]);
    return (
        <div className="mb-5">
            <div className="flex flex-wrap items-center justify-center gap-2">
                <div>
                    <Transition appear show={open} as={Fragment}>
                        <Dialog as="div" open={open} onClose={() => setOpen(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0" />
                            </Transition.Child>
                            <div id="zoomIn_up_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                                <div className="flex min-h-screen items-center justify-center px-4">
                                    <Dialog.Panel className="panel animate__animated animate__zoomInUp my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                            <h5 className="text-lg font-bold">{title}</h5>
                                            <button
                                                onClick={() => setOpen(false)}
                                                type="button"
                                                className="text-white-dark hover:text-dark"
                                            >
                                                <IconX />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <p className="dark:text-shadow-dark-mode font-bold !leading-snug text-dark dark:text-secondary-light">
                                                {mainText}
                                            </p>
                                            {subText && (
                                                <p className="text-sm font-thin text-dark dark:text-secondary-light md:text-base">
                                                    {subText}
                                                </p>
                                            )}
                                            <div className="mt-8 flex items-center justify-end gap-6">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpen(false)}
                                                    className="btn2 btn-gradient2 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                                >
                                                    {cancelButton}
                                                </button>
                                                <button
                                                    onClick={handleConfirm}
                                                    disabled={isLoading}
                                                    type="submit"
                                                    className={`btn2 btn-gradient3 !px-6 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] ${
                                                        isLoading ? 'hover:bg-gray-500' : ''
                                                    }`}
                                                >
                                                    {isLoading ? 'Memproses...' : confirmButton}
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

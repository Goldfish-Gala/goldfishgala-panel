'use client';

import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, use, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import Image from 'next/image';
import { formatedDate } from '@/utils/date-format';
import IconVisit from '@/components/icon/icon-visit';
import { blockUserApi, updateAdminUserApi, updateUserApi } from '@/api/user/api-user';
import { useCookies } from 'next-client-cookies';
import Swal from 'sweetalert2';
import { Spinner } from '@/components/UI/Spinner/spinner';
import IconChecks from '@/components/icon/icon-checks';

interface ConfirmationModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: User | null;
}

const UserModal = ({ open, setOpen, user }: ConfirmationModalProps) => {
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const [blockMode, setBlockMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const {
        handleSubmit,
        control,
        reset,
        formState: { isDirty },
    } = useForm({
        defaultValues: {
            role_id: 0,
        },
    });

    useEffect(() => {
        if (open) {
            setUpdateMode(false);
        }
        if (user) {
            reset({
                role_id: user.role_id,
            });
        }
    }, [open, user, reset]);

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const onSubmit = async (formData: { role_id: number }) => {
        setUpdating(true);
        try {
            const response = await updateAdminUserApi(user?.user_id, formData.role_id, authCookie);

            if (!response.success) {
                showMessage(`Update failed, 'error' `);
                return;
            }

            showMessage('User Updated Successfully');
            reset({
                role_id: formData.role_id,
            });
            setUpdating(false);
            setUpdateMode(false);
        } catch (error) {
            console.error(error);
            setUpdating(false);
            showMessage('An error occurred during submission!', 'error');
        }
    };

    const handleBlock = async () => {
        setIsLoading(true);
        try {
            const response = await blockUserApi(user, false, authCookie);
            if (response.success) {
                showMessage('User blocked successfully');
                setIsLoading(false);
                setTimeout(() => {
                    setOpen(false);
                }, 1000);
            } else {
                showMessage('Failed to block user', 'error');
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnBlock = async () => {
        setIsLoading(false);
        try {
            const response = await blockUserApi(user, true, authCookie);
            if (response.success) {
                showMessage('User unblocked successfully');
                setIsLoading(false);
                setTimeout(() => {
                    setOpen(false);
                }, 1000);
            } else {
                showMessage('Failed to unblock user', 'error');
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (open) {
            setBlockMode(false);
        }
    }, [open]);

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
                                <div className="flex min-h-screen items-center justify-center">
                                    <Dialog.Panel className="panel animate__animated animate__zoomInUp my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 pb-6 text-black dark:text-white-dark">
                                        <div className="flex items-center justify-end p-2">
                                            <button
                                                onClick={() => setOpen(false)}
                                                type="button"
                                                className="text-white-dark hover:text-dark"
                                            >
                                                <IconX />
                                            </button>
                                        </div>
                                        <div className="px-20 pb-4 sm:px-6">
                                            <Image
                                                width={800}
                                                height={800}
                                                src={user?.user_avatar || ''}
                                                alt="img"
                                                className="mx-auto h-20 w-20 rounded-full object-cover md:h-32 md:w-32"
                                            />
                                            <p className="mx-auto mt-4 w-fit">
                                                Joined since {formatedDate(user?.user_created_date)}
                                            </p>
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div className="mt-4 flex w-full flex-col items-start justify-between sm:flex-row sm:gap-6">
                                                    <div className="w-full space-y-2">
                                                        <div>
                                                            <label htmlFor="fname">First Name</label>
                                                            <input
                                                                id="fname"
                                                                type="text"
                                                                name="user_fname"
                                                                placeholder={user?.user_fname}
                                                                defaultValue={user?.user_fname}
                                                                className="form-input disabled:opacity-90"
                                                                disabled
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="lname">Last Name</label>
                                                            <input
                                                                id="lname"
                                                                type="text"
                                                                name="user_lname"
                                                                placeholder={user?.user_lname}
                                                                defaultValue={user?.user_lname}
                                                                className="form-input disabled:opacity-90"
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label htmlFor={`role`}>Role</label>
                                                            <div className="flex w-full items-center justify-between">
                                                                <div className="w-36 text-black" id="role">
                                                                    <Controller
                                                                        name="role_id"
                                                                        control={control}
                                                                        render={({ field }) => {
                                                                            const options = [
                                                                                { label: 'guest', value: 1 },
                                                                                { label: 'member', value: 2 },
                                                                                { label: 'judges', value: 4 },
                                                                                { label: 'admin', value: 3 },
                                                                            ];
                                                                            const selectedOption = options.find(
                                                                                (option) => option.value === field.value
                                                                            );

                                                                            return (
                                                                                <Select
                                                                                    {...field}
                                                                                    options={options}
                                                                                    value={selectedOption}
                                                                                    onChange={(selectedOption: any) => {
                                                                                        field.onChange(
                                                                                            selectedOption?.value || 0
                                                                                        );
                                                                                    }}
                                                                                    menuPortalTarget={document.body}
                                                                                    styles={{
                                                                                        menuPortal: (base: any) => ({
                                                                                            ...base,
                                                                                            zIndex: 9999,
                                                                                        }),
                                                                                    }}
                                                                                    isDisabled={!updateMode} //
                                                                                />
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                {updateMode ? (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            className="btn2 btn-cancel !p-0.5"
                                                                            onClick={() => setUpdateMode(false)}
                                                                        >
                                                                            <IconX />
                                                                        </button>
                                                                        <button
                                                                            type="submit"
                                                                            className={`btn2 btn-primary !p-0.5`}
                                                                            disabled={updating || !isDirty}
                                                                        >
                                                                            {updating ? (
                                                                                <div className="flex h-6 w-6 justify-center">
                                                                                    <Spinner className="w-4" />
                                                                                </div>
                                                                            ) : (
                                                                                <IconChecks />
                                                                            )}
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        className="btn2 btn-secondary"
                                                                        onClick={() => setUpdateMode(true)}
                                                                    >
                                                                        Update
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="ig">Instagram</label>
                                                            <div className="relative">
                                                                <input
                                                                    id="ig"
                                                                    type="text"
                                                                    name="user_ig"
                                                                    placeholder={user?.user_ig}
                                                                    defaultValue={user?.user_ig}
                                                                    className="form-input disabled:opacity-90"
                                                                    disabled
                                                                />
                                                                <span
                                                                    className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer text-black"
                                                                    onClick={() =>
                                                                        window.open(
                                                                            `https://www.instagram.com/${user?.user_ig}`,
                                                                            '_blank'
                                                                        )
                                                                    }
                                                                >
                                                                    <IconVisit />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="email">Email</label>
                                                            <input
                                                                id="email"
                                                                type="email"
                                                                name="user_email"
                                                                placeholder={user?.user_email}
                                                                defaultValue={user?.user_email}
                                                                className="form-input disabled:opacity-90"
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-full space-y-2">
                                                        <div>
                                                            <label htmlFor="phone">Phone</label>
                                                            <input
                                                                id="phone"
                                                                type="text"
                                                                name="user_phone"
                                                                placeholder={user?.user_phone}
                                                                defaultValue={user?.user_phone}
                                                                className="form-input disabled:opacity-90"
                                                                disabled
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="address">Address</label>
                                                            <input
                                                                id="address"
                                                                type="text"
                                                                name="user_address"
                                                                placeholder={user?.user_address}
                                                                defaultValue={user?.user_address}
                                                                className="form-input disabled:opacity-90"
                                                                disabled
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="status">Status</label>
                                                            <input
                                                                id="status"
                                                                type="text"
                                                                name="status"
                                                                defaultValue={
                                                                    user?.user_is_active ? 'Active' : 'Inactive'
                                                                }
                                                                className="form-input disabled:opacity-90"
                                                                disabled
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="last_active">Last Active</label>
                                                            <input
                                                                id="last_active"
                                                                type="text"
                                                                name="last_active"
                                                                defaultValue={formatedDate(user?.user_last_active)}
                                                                className="form-input disabled:opacity-90"
                                                                disabled
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="join_date">First Login</label>
                                                            <input
                                                                id="first_login"
                                                                type="text"
                                                                name="first_login"
                                                                defaultValue={user?.user_is_first_login ? 'Yes' : 'No'}
                                                                className="form-input disabled:opacity-90"
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="mt-2 flex w-full items-center justify-end px-6">
                                            {!blockMode ? (
                                                <button
                                                    className="btn2 btn-gradient3 w-[90px] border-none p-2"
                                                    onClick={() => setBlockMode(true)}
                                                >
                                                    {user?.user_is_active ? 'Block User' : 'Unblock User'}
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <p className="mr-2 font-extrabold">Are you sure ?</p>
                                                    <button
                                                        className="btn2 btn-gradient2 w-[60px] border-none p-2"
                                                        onClick={() => setBlockMode(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    {user?.user_is_active ? (
                                                        <button
                                                            className="btn2 btn-gradient3 w-[60px] border-none p-2"
                                                            disabled={isLoading}
                                                            onClick={handleBlock}
                                                        >
                                                            {isLoading ? <Spinner className="h-4 text-white" /> : 'Yes'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn2 btn-gradient3 w-[60px] border-none p-2"
                                                            onClick={handleUnBlock}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? <Spinner /> : 'Yes'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
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

export default UserModal;

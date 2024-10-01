'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';
import { useRouter } from 'next/navigation';
import React from 'react';
import IconPhone from '../icon/icon-phone';
import IconBookmark from '../icon/icon-bookmark';
import IconOpenBook from '../icon/icon-open-book';
import IconHome from '../icon/icon-home';

const ComponentsAuthRegisterForm = () => {
    const router = useRouter();

    const submitForm = (e: any) => {
        e.preventDefault();
        router.push('/');
    };
    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            <div>
                <label htmlFor="Name">Nama Depan</label>
                <div className="relative text-white-dark">
                    <input
                        id="firstName"
                        type="text"
                        placeholder="Masukan nama depan"
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="Name">Nama Belakang</label>
                <div className="relative text-white-dark">
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Masukan nama belakang"
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="phone">Nomor Telepon</label>
                <div className="relative text-white-dark">
                    <input
                        id="Name"
                        type="text"
                        placeholder="Masukan telepon"
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconPhone />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="Name">Alamat</label>
                <div className="relative text-white-dark">
                    <input
                        id="address"
                        type="text"
                        placeholder="Masukan alamat"
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconHome />
                    </span>
                </div>
            </div>
            <button
                type="submit"
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            >
                Perbarui Data
            </button>
        </form>
    );
};

export default ComponentsAuthRegisterForm;

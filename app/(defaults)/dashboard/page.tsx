import OngoingEvent from '@/components/dashboard/ongoing-event';
import PendingPayment from '@/components/dashboard/pending-payment';
import WelcomeCard from '@/components/dashboard/welcome-card';
import IconCalendar from '@/components/icon/icon-calendar';
import IconClock from '@/components/icon/icon-clock';
import IconCoffee from '@/components/icon/icon-coffee';
import IconCreditCard from '@/components/icon/icon-credit-card';
import IconDribbble from '@/components/icon/icon-dribbble';
import IconGithub from '@/components/icon/icon-github';
import IconInfoCircle from '@/components/icon/icon-info-circle';
import IconMail from '@/components/icon/icon-mail';
import IconMapPin from '@/components/icon/icon-map-pin';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconPhone from '@/components/icon/icon-phone';
import IconShoppingBag from '@/components/icon/icon-shopping-bag';
import IconTag from '@/components/icon/icon-tag';
import IconTwitter from '@/components/icon/icon-twitter';
import IconCircle from '@/components/icon/menu/icon-circle';
import ComponentsUsersProfilePaymentHistory from '@/components/users/profile/components-users-profile-payment-history';
import { IRootState } from '@/store';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

export const metadata: Metadata = {
    title: 'Dashboard',
};

const Dashboard = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Dashboard</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Beranda</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <WelcomeCard />
                    <OngoingEvent />
                    <PendingPayment />
                </div>
                {/* <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="panel">
                        <div className="mb-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">Summary</h5>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded border border-[#ebedf2] dark:border-0 dark:bg-[#1b2e4b]">
                                <div className="flex items-center justify-between p-4 py-2">
                                    <div className="grid h-9 w-9 place-content-center rounded-md bg-secondary-light text-secondary dark:bg-secondary dark:text-secondary-light">
                                        <IconShoppingBag />
                                    </div>
                                    <div className="flex flex-auto items-start justify-between font-semibold ltr:ml-4 rtl:mr-4">
                                        <h6 className="text-[13px] text-white-dark dark:text-white-dark">
                                            Income
                                            <span className="block text-base text-[#515365] dark:text-white-light">
                                                $92,600
                                            </span>
                                        </h6>
                                        <p className="text-secondary ltr:ml-auto rtl:mr-auto">90%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded border border-[#ebedf2] dark:border-0 dark:bg-[#1b2e4b]">
                                <div className="flex items-center justify-between p-4 py-2">
                                    <div className="grid h-9 w-9 place-content-center rounded-md bg-info-light text-info dark:bg-info dark:text-info-light">
                                        <IconTag />
                                    </div>
                                    <div className="flex flex-auto items-start justify-between font-semibold ltr:ml-4 rtl:mr-4">
                                        <h6 className="text-[13px] text-white-dark dark:text-white-dark">
                                            Profit
                                            <span className="block text-base text-[#515365] dark:text-white-light">
                                                $37,515
                                            </span>
                                        </h6>
                                        <p className="text-info ltr:ml-auto rtl:mr-auto">65%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded border border-[#ebedf2] dark:border-0 dark:bg-[#1b2e4b]">
                                <div className="flex items-center justify-between p-4 py-2">
                                    <div className="grid h-9 w-9 place-content-center rounded-md bg-warning-light text-warning dark:bg-warning dark:text-warning-light">
                                        <IconCreditCard />
                                    </div>
                                    <div className="flex flex-auto items-start justify-between font-semibold ltr:ml-4 rtl:mr-4">
                                        <h6 className="text-[13px] text-white-dark dark:text-white-dark">
                                            Expenses
                                            <span className="block text-base text-[#515365] dark:text-white-light">
                                                $55,085
                                            </span>
                                        </h6>
                                        <p className="text-warning ltr:ml-auto rtl:mr-auto">80%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel">
                        <div className="mb-10 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Pro Plan</h5>
                            <button className="btn btn-primary">Renew Now</button>
                        </div>
                        <div className="group">
                            <ul className="mb-7 list-inside list-disc space-y-2 font-semibold text-white-dark">
                                <li>10,000 Monthly Visitors</li>
                                <li>Unlimited Reports</li>
                                <li>2 Years Data Storage</li>
                            </ul>
                            <div className="mb-4 flex items-center justify-between font-semibold">
                                <p className="flex items-center rounded-full bg-dark px-2 py-1 text-xs font-semibold text-white-light">
                                    <IconClock className="h-3 w-3 ltr:mr-1 rtl:ml-1" />5 Days Left
                                </p>
                                <p className="text-info">$25 / month</p>
                            </div>
                            <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-dark-light p-0.5 dark:bg-dark-light/10">
                                <div
                                    className="relative h-full w-full rounded-full bg-gradient-to-r from-[#f67062] to-[#fc5296]"
                                    style={{ width: '65%' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <ComponentsUsersProfilePaymentHistory />
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">Card Details</h5>
                        </div>
                        <div>
                            <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex-none">
                                        <img src="/assets/images/card-americanexpress.svg" alt="img" />
                                    </div>
                                    <div className="flex flex-auto items-center justify-between ltr:ml-4 rtl:mr-4">
                                        <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                            American Express
                                            <span className="block text-white-dark dark:text-white-light">
                                                Expires on 12/2025
                                            </span>
                                        </h6>
                                        <span className="badge bg-success ltr:ml-auto rtl:mr-auto">Primary</span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex-none">
                                        <img src="/assets/images/card-mastercard.svg" alt="img" />
                                    </div>
                                    <div className="flex flex-auto items-center justify-between ltr:ml-4 rtl:mr-4">
                                        <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                            Mastercard
                                            <span className="block text-white-dark dark:text-white-light">
                                                Expires on 03/2025
                                            </span>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex-none">
                                        <img src="/assets/images/card-visa.svg" alt="img" />
                                    </div>
                                    <div className="flex flex-auto items-center justify-between ltr:ml-4 rtl:mr-4">
                                        <h6 className="font-semibold text-[#515365] dark:text-white-dark">
                                            Visa
                                            <span className="block text-white-dark dark:text-white-light">
                                                Expires on 10/2025
                                            </span>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;

'use client';

import AnimateHeight from 'react-animate-height';
import IconCaretDown from '../../icon/icon-caret-down';
import IconMinus from '../../icon/icon-minus';
import IconNominee from '../../icon/icon-nominee';
import Link from 'next/link';
import IconSelection from '../../icon/icon-selection';
import { usePathname } from 'next/navigation';
import IconCircleCheck from '../../icon/icon-circle-check';
import IconAward from '../../icon/icon-award';
import IconPencilPaper from '../../icon/icon-pencil-paper';
import IconUserList from '@/components/icon/icon-userlist';
import IconUser from '@/components/icon/icon-user';
import IconUsers from '@/components/icon/icon-users';
import IconUsersGroup from '@/components/icon/icon-users-group';
import IconUserTable from '@/components/icon/icon-user-table';
import IconEvent from '@/components/icon/icon-event';
import IconEventList from '@/components/icon/icon-eventlist';
import IconEventDetail from '@/components/icon/icon-event-detail';
import IconPriceTag from '@/components/icon/icon-pricetag';
import IconRegister from '@/components/icon/icon-register';
import IconFishMenu from '@/components/icon/icon-fish-menu';
import IconFishList from '@/components/icon/icon-fishlist';
import IconFish from '@/components/icon/icon-fish';
import IconScore from '@/components/icon/icon-score';
import IconFinalScore from '@/components/icon/icon-final-score';
import IconUserReg from '@/components/icon/icon-user-reg';
import IconUserRegistration from '@/components/icon/icon-user-registration';
import IconRegStatus from '@/components/icon/icon-user-reg-status';
import IconChampion from '@/components/icon/icon-champion';
import IconCup from '@/components/icon/icon-cup';
import IconCreateCup from '@/components/icon/icon-create-cup';
import IconCategory from '@/components/icon/icon-category';
import IconInvoices from '@/components/icon/icon-invoices';
import IconInvoiceList from '@/components/icon/icon-invoice-list';
import IconPayment from '@/components/icon/icon-payment';
import IconCreateInvoice from '@/components/icon/icon-create-invoice';

interface AdminBarProps {
    currentMenu: string;
    toggleMenu: (value: string) => void;
    T: (key: string) => any | undefined;
}

const AdminSideBar = ({ currentMenu, toggleMenu, T }: AdminBarProps) => {
    const pathname = usePathname();
    return (
        <>
            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{T!('Admin')}</span>
            </h2>
            <button
                type="button"
                className={`${currentMenu === 'users' ? 'active' : ''} nav-link group w-full`}
                onClick={() => toggleMenu('users')}
            >
                <div className="flex items-center">
                    <IconUserList className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                        {T!('Users')}
                    </span>
                </div>
                <div className={currentMenu !== 'events' ? '-rotate-90 rtl:rotate-90' : ''}>
                    <IconCaretDown />
                </div>
            </button>
            <AnimateHeight duration={300} height={currentMenu === 'users' ? 'auto' : 0}>
                <ul className="sub-menu text-gray-500">
                    <li>
                        <Link href="/admin/all-users">
                            <div className="flex items-center">
                                <IconUserTable className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/all-users'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('All Users')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/profile-id'}>
                            <div className="flex items-center">
                                <IconUsers className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/profile-id'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Profile by id')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/update-profile'}>
                            <div className="flex items-center">
                                <IconUsersGroup className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/update-profile'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Update Profile')}
                                </span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </AnimateHeight>
            <button
                type="button"
                className={`${currentMenu === 'event' ? 'active' : ''} nav-link group w-full`}
                onClick={() => toggleMenu('event')}
            >
                <div className="flex items-center">
                    <IconEvent className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                        {T!('Event')}
                    </span>
                </div>
                <div className={currentMenu !== 'event' ? '-rotate-90 rtl:rotate-90' : ''}>
                    <IconCaretDown />
                </div>
            </button>
            <AnimateHeight duration={300} height={currentMenu === 'event' ? 'auto' : 0}>
                <ul className="sub-menu text-gray-500">
                    <li>
                        <Link href="/admin/all-events">
                            <div className="flex items-center">
                                <IconEventList className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/all-events'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Event List')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/event-detail'}>
                            <div className="flex items-center">
                                <div className="ml-0.5">
                                    <IconEventDetail className="shrink-0 group-hover:!text-primary" />
                                </div>
                                <span
                                    className={`${
                                        pathname === '/admin/event-detail'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } -ml-0.5 ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Event Detail')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/event-price'}>
                            <div className="flex items-center">
                                <IconPriceTag className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/event-price'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Event Price')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/event-registration'}>
                            <div className="flex items-center">
                                <div className="ml-1.5">
                                    <IconRegister className="shrink-0 group-hover:!text-primary" />
                                </div>
                                <span
                                    className={`${
                                        pathname === '/admin/event-registration'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } -ml-1.5 ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Event Registration')}
                                </span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </AnimateHeight>
            <button
                type="button"
                className={`${currentMenu === 'fish' ? 'active' : ''} nav-link group w-full`}
                onClick={() => toggleMenu('fish')}
            >
                <div className="flex items-center">
                    <IconFishMenu className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                        {T!('Fish')}
                    </span>
                </div>
                <div className={currentMenu !== 'fish' ? '-rotate-90 rtl:rotate-90' : ''}>
                    <IconCaretDown />
                </div>
            </button>
            <AnimateHeight duration={300} height={currentMenu === 'fish' ? 'auto' : 0}>
                <ul className="sub-menu text-gray-500">
                    <li>
                        <Link href="/admin/fish-list">
                            <div className="flex items-center">
                                <IconFishList className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/fish-list'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Fishes')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/fish-nominations'}>
                            <div className="flex items-center">
                                <IconNominee className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/fish-list'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Fish Nomination')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/nominated-fish'}>
                            <div className="flex items-center">
                                <IconCircleCheck className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/nominated-fish'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Nominated Fish')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/fish-scores'}>
                            <div className="flex items-center">
                                <IconScore className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/fish-scores'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Fish Scores')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/fish-final-scores'}>
                            <div className="flex items-center">
                                <IconFinalScore className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/fish-final-scores'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Fish Final Scores')}
                                </span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </AnimateHeight>
            <button
                type="button"
                className={`${currentMenu === 'user-registration' ? 'active' : ''} nav-link group w-full`}
                onClick={() => toggleMenu('user-registration')}
            >
                <div className="flex items-center">
                    <IconUserReg className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                        {T!('User Registration')}
                    </span>
                </div>
                <div className={currentMenu !== 'user-registration' ? '-rotate-90 rtl:rotate-90' : ''}>
                    <IconCaretDown />
                </div>
            </button>
            <AnimateHeight duration={300} height={currentMenu === 'user-registration' ? 'auto' : 0}>
                <ul className="sub-menu text-gray-500">
                    <li>
                        <Link href="/admin/user-reg">
                            <div className="flex items-center">
                                <IconUserRegistration className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/user-reg'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('User Regs')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/user-reg-status'}>
                            <div className="flex items-center">
                                <IconRegStatus className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/user-reg-status'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('User Reg Status')}
                                </span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </AnimateHeight>
            <button
                type="button"
                className={`${currentMenu === 'champions' ? 'active' : ''} nav-link group w-full`}
                onClick={() => toggleMenu('champions')}
            >
                <div className="flex items-center">
                    <IconChampion className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                        {T!('Champions')}
                    </span>
                </div>
                <div className={currentMenu !== 'champions' ? '-rotate-90 rtl:rotate-90' : ''}>
                    <IconCaretDown />
                </div>
            </button>
            <AnimateHeight duration={300} height={currentMenu === 'champions' ? 'auto' : 0}>
                <ul className="sub-menu text-gray-500">
                    <li>
                        <Link href="/admin/champions-final-scores">
                            <div className="flex items-center">
                                <IconFinalScore className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/champions-final-scores'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Final Scores')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/champions'}>
                            <div className="flex items-center">
                                <IconCup className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/champions'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Champions')}
                                </span>
                            </div>
                        </Link>
                        <li>
                            <Link href={'/admin/create-champion'}>
                                <div className="flex items-center">
                                    <IconCreateCup className="shrink-0 group-hover:!text-primary" />
                                    <span
                                        className={`${
                                            pathname === '/admin/create-champion'
                                                ? 'text-primary'
                                                : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                        } ltr:pl-3 rtl:pr-3`}
                                    >
                                        {T!('Create Champion')}
                                    </span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/admin/champion-categories'}>
                                <div className="flex items-center">
                                    <IconCategory className="shrink-0 group-hover:!text-primary" />
                                    <span
                                        className={`${
                                            pathname === '/admin/champion-categories'
                                                ? 'text-primary'
                                                : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                        } ltr:pl-3 rtl:pr-3`}
                                    >
                                        {T!('Categories')}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    </li>
                </ul>
            </AnimateHeight>
            <button
                type="button"
                className={`${currentMenu === 'invoices' ? 'active' : ''} nav-link group w-full`}
                onClick={() => toggleMenu('invoices')}
            >
                <div className="flex items-center">
                    <IconInvoices className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                        {T!('Invoices')}
                    </span>
                </div>
                <div className={currentMenu !== 'invoices' ? '-rotate-90 rtl:rotate-90' : ''}>
                    <IconCaretDown />
                </div>
            </button>
            <AnimateHeight duration={300} height={currentMenu === 'invoices' ? 'auto' : 0}>
                <ul className="sub-menu text-gray-500">
                    <li>
                        <Link href="/admin/invoices">
                            <div className="flex items-center">
                                <IconInvoiceList className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/invoices'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Invoice List')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/admin/payments'}>
                            <div className="flex items-center">
                                <IconPayment className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/admin/payments'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Payments')}
                                </span>
                            </div>
                        </Link>
                        <li>
                            <Link href={'/admin/create-invoice'}>
                                <div className="flex items-center">
                                    <IconCreateInvoice className="shrink-0 group-hover:!text-primary" />
                                    <span
                                        className={`${
                                            pathname === '/admin/create-invoice'
                                                ? 'text-primary'
                                                : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                        } ltr:pl-3 rtl:pr-3`}
                                    >
                                        {T!('Create Invoice')}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    </li>
                </ul>
            </AnimateHeight>
        </>
    );
};

export default AdminSideBar;
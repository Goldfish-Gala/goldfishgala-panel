'use client';

import AnimateHeight from 'react-animate-height';
import IconCaretDown from '../../icon/icon-caret-down';
import IconMinus from '../../icon/icon-minus';
import IconNominee from '../../icon/icon-nominee';
import Link from 'next/link';
import IconSelection from '../../icon/icon-selection';
import { usePathname } from 'next/navigation';
import IconCircleCheck from '../../icon/icon-circle-check';
import IconMenuElements from '@/components/icon/menu/icon-menu-elements';
import IconMenuInvoice from '@/components/icon/menu/icon-menu-invoice';
import IconFishMenu from '@/components/icon/icon-fish-menu';

interface AdminBarProps {
    currentMenu: string;
    toggleMenu: (value: string) => void;
    T: (key: string) => any | undefined;
}

const MemberSideBar = ({ currentMenu, toggleMenu, T }: AdminBarProps) => {
    const pathname = usePathname();
    return (
        <>
            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{T!('event')}</span>
            </h2>
            <li className="menu nav-item">
                <Link href={'/registered-fishes'}>
                    <div className="flex items-center">
                        <IconFishMenu className="shrink-0 group-hover:!text-primary" />
                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                            {T!('Ikan Terdaftar')}
                        </span>
                    </div>
                </Link>
            </li>
            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{T!('tagihan')}</span>
            </h2>
            <li className="nav-item">
                <ul>
                    <li className="menu nav-item">
                        <Link href={'/invoices'}>
                            <div className="flex items-center">
                                <IconMenuInvoice className="shrink-0 group-hover:!text-primary" />
                                <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                                    {T!('Riwayat Tagihan')}
                                </span>
                            </div>
                        </Link>

                        <AnimateHeight duration={300} height={currentMenu === 'invoice' ? 'auto' : 0}>
                            <ul className="sub-menu text-gray-500">
                                <li>
                                    <Link href="/apps/invoice/list">{T!('Belum dibayar')}</Link>
                                </li>
                                <li>
                                    <Link href="/apps/invoice/preview">{T!('Sudah dibayar')}</Link>
                                </li>
                            </ul>
                        </AnimateHeight>
                    </li>
                </ul>
            </li>
        </>
    );
};

export default MemberSideBar;

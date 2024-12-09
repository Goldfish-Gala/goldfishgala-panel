'use client';

import AnimateHeight from 'react-animate-height';
import IconCaretDown from '../../icon/icon-caret-down';
import IconMinus from '../../icon/icon-minus';
import IconNominee from '../../icon/icon-nominee';
import Link from 'next/link';
import IconSelection from '../../icon/icon-selection';
import { usePathname } from 'next/navigation';
import IconCircleCheck from '../../icon/icon-circle-check';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconAward from '@/components/icon/icon-award';

interface AdminBarProps {
    currentMenu: string;
    toggleMenu: (value: string) => void;
    T: (key: string) => any | undefined;
}

const JudgesSideBar = ({ currentMenu, toggleMenu, T }: AdminBarProps) => {
    const pathname = usePathname();
    return (
        <>
            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{T!('Judges')}</span>
            </h2>
            <button
                type="button"
                className={`${currentMenu === 'nomination' ? 'active' : ''} nav-link group w-full`}
                onClick={() => toggleMenu('nomination')}
            >
                <div className="flex items-center">
                    <IconNominee className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                        {T!('Nomination')}
                    </span>
                </div>

                <div className={currentMenu !== 'nomination' ? '-rotate-90 rtl:rotate-90' : ''}>
                    <IconCaretDown />
                </div>
            </button>
            <AnimateHeight duration={300} height={currentMenu === 'nomination' ? 'auto' : 0}>
                <ul className="sub-menu text-gray-500">
                    <li>
                        <Link href="/judges/fish-candidates">
                            <div className="flex items-center">
                                <IconSelection className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/judges/fish-candidates'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Fish Candidates')}
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/judges/selected-nominees'}>
                            <div className="flex items-center">
                                <IconCircleCheck className="shrink-0 group-hover:!text-primary" />
                                <span
                                    className={`${
                                        pathname === '/judges/selected-nominees'
                                            ? 'text-primary'
                                            : 'text-black dark:text-[#506690] dark:group-hover:text-white-dark'
                                    } ltr:pl-3 rtl:pr-3`}
                                >
                                    {T!('Selected Nominees')}
                                </span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </AnimateHeight>
            <li className="menu nav-item">
                <Link href={'/judges/fishes-score'}>
                    <div className="flex items-center">
                        <IconPencilPaper className="shrink-0 group-hover:!text-primary" />
                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                            {T!('Fishes Score')}
                        </span>
                    </div>
                </Link>
            </li>
            <li className="menu nav-item">
                <Link href={'/judges/winner-selection'}>
                    <div className="flex items-center">
                        <IconAward className="shrink-0 group-hover:!text-primary" />
                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                            {T!('Winner Selection')}
                        </span>
                    </div>
                </Link>
            </li>
        </>
    );
};

export default JudgesSideBar;

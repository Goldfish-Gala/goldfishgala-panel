'use client';

import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useCookies } from 'next-client-cookies';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactCardFlip from 'react-card-flip';
import { toPng } from 'html-to-image';
import './index.css';
import { formatName } from '@/utils/name-format';
import IconDownload from '@/components/icon/icon-download';

const MemberCard = () => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies?.get('token');
    const dispatch = useDispatch();
    const [isFlipped, setFlipped] = useState(false);
    const user = useSelector((state: IRootState) => state.auth.user);
    const cardRef = useRef<HTMLDivElement>(null);
    const [downloaded, setDownloaded] = useState(false);

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const handleDownload = async () => {
        if (cardRef.current) {
            try {
                const png = await toPng(cardRef.current, { cacheBust: true });
                const link = document.createElement('a');
                link.download = `${user?.user_fname}-member-card`;
                link.href = png;
                link.click();

                setDownloaded(true);
            } catch (error) {
                console.error('Failed to generate image:', error);
            }
        }
    };

    const CardContent = () => (
        <div ref={cardRef} className="relative">
            <Image
                src={'/assets/images/account/user-card.png'}
                height={2000}
                width={320}
                alt="member card image"
                className="h-auto w-[320px] rounded-xl object-cover"
            />
            <div className="absolute left-28 top-[28%]">
                <div className="losange">
                    <div className="los1">
                        <Image src={user?.user_avatar!} alt="user avatar" width={1000} height={1000} />
                    </div>
                </div>
            </div>
            <p className="absolute bottom-[44.25%] left-36 font-bold text-black">{user?.user_id}</p>
            <p className="absolute bottom-[34%] left-12 text-xl font-bold capitalize text-[#E0C052]">
                {formatName(user?.user_fname || '', user?.user_lname || '', 22)}
            </p>
            <p className="absolute bottom-[26%] left-12 text-xl font-bold capitalize text-[#E0C052]">
                {user?.role_name}
            </p>
            <p className="absolute bottom-[17%] left-12 text-base font-bold text-[#E0C052]">{user?.user_email}</p>
            <p className="absolute bottom-[10.5%] left-12 text-base font-bold text-[#E0C052]">{user?.user_phone}</p>
        </div>
    );

    if (user?.role_id === 1) return null;

    return (
        <div className="panel flex min-w-[330px] flex-col items-center justify-center gap-4 px-1 py-12">
            {!downloaded && (
                <button
                    type="button"
                    className="btn btn-success mr-[4vw] flex gap-2 self-end px-2 py-1 sm:mr-[8vw] md:mr-[0] xl:mr-[3vw]"
                    onClick={handleDownload}
                >
                    <IconDownload />
                    Download
                </button>
            )}
            <div onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)}>
                <ReactCardFlip
                    isFlipped={isFlipped}
                    flipDirection="horizontal"
                    flipSpeedBackToFront={2}
                    flipSpeedFrontToBack={2}
                >
                    <CardContent />
                    <CardContent />
                </ReactCardFlip>
            </div>
        </div>
    );
};

export default MemberCard;

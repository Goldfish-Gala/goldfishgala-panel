'use client';

import { API_URL } from '@/api/api-config';
import IconGoogle from '@/components/icon/icon-google';

const GoogleButton = () => {
    const handleLogin = () => (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
    return (
        <button
            className="inline-flex h-12 w-56 items-center justify-center rounded-full p-0 transition hover:scale-110"
            style={{
                background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)',
            }}
            onClick={handleLogin}
        >
            Masuk dengan &nbsp;
            <IconGoogle />
            &nbsp; Google
        </button>
    );
};

export default GoogleButton;

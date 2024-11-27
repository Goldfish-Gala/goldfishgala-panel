'use client';


import IconGoogle from "@/components/icon/icon-google";

const GoogleButton = ({ text = "Sign up with Google" }) => {
    const handleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
    };

    return (
        <button
            onClick={handleLogin}
            className="inline-flex items-center justify-center h-12 w-64 rounded-md border border-blue-500 text-blue-500 font-medium hover:bg-blue-50 transition bg-white"
        >
            <IconGoogle className="h-6 w-6 mr-2" />
            {text}
        </button>
    );
};

export default GoogleButton;

import { FC } from 'react';
import { FcGoogle } from "react-icons/fc";

interface IconGoogleProps {
    size?: string;
    className?: string;
}

const IconGoogle: FC<IconGoogleProps> = ({ size = "medium", ...className }) => {
    return (
        <FcGoogle size={size} {...className} />
    );
};

export default IconGoogle;

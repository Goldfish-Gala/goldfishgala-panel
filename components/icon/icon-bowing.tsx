import { FC } from 'react';

interface IconBowingProps {
    className?: string;
}

const IconBowing: FC<IconBowingProps> = ({ className }) => {
    return (
        <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 73.39 122.88"
            className={className}
        >
            <title>bowing</title>
            <path
                fill="currentColor"
                d="M60.64,0A12.75,12.75,0,1,1,47.89,12.75,12.75,12.75,0,0,1,60.64,0ZM37.35,21.14c5.38-.33,10,2.67,13.52,6.24,2.49,2.53,3.54,4.83,2.82,8.55a9,9,0,0,1-2.43,4.55L25.64,67.87l.08,47.48c.19,6.72-10.37,12.43-14.95,1L5.13,74c6.26.58,8.67-5.52,10.92-12.28,5.6-16.84,2.2-12.51,13.12-21.37L41,30.78,18.82,44.41,10.33,67.28c-3,6.37-12,1.8-10-4.4L8.45,40.82a11.67,11.67,0,0,1,4-5.55l13.11-8.41c3.89-2.5,7.09-5.42,11.78-5.72Z"
            />
        </svg>
    );
};

export default IconBowing;

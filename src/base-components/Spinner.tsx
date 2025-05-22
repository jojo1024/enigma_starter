import React from 'react';

interface SpinnerProps {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
    return (
        <div className={`animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 ${className || ''}`} />
    );
};

export default Spinner; 
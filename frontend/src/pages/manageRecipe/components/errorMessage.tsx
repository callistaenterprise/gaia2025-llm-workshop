import React from 'react';

interface ErrorMessageProps {
    title: string;
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
    return (
        <div className="flex justify-center items-center mt-2 border bg-red-100 border-red-500 p-2 rounded">
            <div className="relative w-8 h-8">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-red-500 text-lg font-bold">!</span>
                </div>
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-transparent border-b-red-500"></div>
            </div>
            <div className="flex flex-col ml-2">
                <span className="text-red-500 font-bold">{title}</span>
                <span className="text-red-400">{message}</span>
            </div>
        </div>
    );
};

import React from 'react'

interface iProps {}

function Loading(iProps: iProps) {
    return (
        <div className="fixed flex left-0 top-0 w-screen h-screen">
            <div className="flex m-auto items-center justify-center space-x-2 animate-pulse">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
        </div>
        
    );
}

export default Loading;


import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { RootState } from 'app/store';
import { Message, deleteMessage, MessageType } from './slice';

interface iProps {}

function MessageList(props: iProps) {
    const dispatch = useDispatch();
    const messages = useSelector<RootState, Message[]>((state) => state.messages);

    const getColor = (type: MessageType) => {
        switch (type) {
            case "INFO":
                return "bg-blue-600";
            case "SUCCESS":
                return "bg-green-600";
            case "WARNING":
                return "bg-yellow-600";
            case "ERROR":
                return "bg-red-600";
        }
    }

    return (
        <div className="flex flex-col">
            {messages.map(message => (
                <div key={message.id} className={`flex justify-between items-center mx-auto mb-1 py-2 px-3 min-w-1/2 shadow-lg rounded-lg ${getColor(message.type)}`}>
                    <p className="font-bold text-white">{message.detail}</p>
                        
                    <XMarkIcon className="h-4 ml-2 text-white hover:opacity-75 active:opacity-100" onClick={() => dispatch(deleteMessage(message.id))}/>
                </div>
            ))}
            
        </div>
    );
}

export default MessageList;
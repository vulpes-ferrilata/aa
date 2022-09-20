import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { RootState } from 'app/store';
import { Message, deleteMessage } from './slice';

interface iProps {}

function MessageList(props: iProps) {
    const dispatch = useDispatch();
    const messages = useSelector<RootState, Message[]>((state) => state.messages);

    return (
        <div className="flex flex-col">
            {messages.map(message => (
                <div key={message.id} className="flex justify-between items-center mx-auto mb-1 py-2 px-3 w-96 max-w-full bg-red-600 shadow-lg text-sm pointer-events-auto bg-clip-padding rounded-lg">
                    <p className="font-bold text-white">{message.detail}</p>
                        
                    <XMarkIcon className="box-content w-4 h-4 ml-2 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline" onClick={() => dispatch(deleteMessage(message.id))}/>
                </div>
            ))}
            
        </div>
    );
}

export default MessageList;
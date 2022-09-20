import { isRejectedWithValue, nanoid } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'

import { Message, addMessage, deleteMessage } from 'features/messages/slice'

const rtkQueryMiddleware: Middleware = api => next => action => {
    if (isRejectedWithValue(action)) {
        const details: string[] = []

        if (action.payload.data) {
            if (action.payload.data.errors) {
                for (let error of action.payload.data.errors) {
                    details.push(error)
                }
            } else {
                details.push(action.payload.data.detail)
            }
        } else {
            details.push("something went wrong")
        }
        
        for (let detail of details) {
            let message: Message = {
                id: nanoid(),
                detail: detail,
            }
    
            api.dispatch(addMessage(message));

            setTimeout(() => api.dispatch(deleteMessage(message.id)), 3000)
        }
    }

    return next(action)
}

export default rtkQueryMiddleware
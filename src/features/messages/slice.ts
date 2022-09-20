import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Message {
  id: string;
  detail: string;
}

const slice = createSlice({
  name: 'messages',
  initialState: [] as Message[],
  reducers: {
    addMessage: (state: Message[], action: PayloadAction<Message>) => {
      state.push(action.payload);
    },
    deleteMessage: (state: Message[], action: PayloadAction<string>) => {
      return state.filter(message => message.id !== action.payload)
    }
  },
  
})

export default slice.reducer

export const { addMessage, deleteMessage } = slice.actions

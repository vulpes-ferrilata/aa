import { createAsyncThunk, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'

export type Message = {
  id: string;
  type: MessageType;
  detail: string;  
}

export type MessageType = "INFO" | "SUCCESS" | "WARNING" | "ERROR"

export const addMessage = createAsyncThunk("messages/add", async (message: Omit<Message, "id">, thunkAPI) => {
	const id = nanoid();
	thunkAPI.dispatch(slice.actions.addMessage({id, ...message}))
	setTimeout(() => thunkAPI.dispatch(deleteMessage(id)), 3000)
})

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

export const { deleteMessage } = slice.actions

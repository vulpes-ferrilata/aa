import { createAsyncThunk, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

export type Notification = {
	id: string;
	type: NotificationType;
	detail: string;  
};

export enum NotificationType {
	Info = "INFO",
	Success = "SUCCESS",
	Warning = "WARNING",
	Error = "ERROR",
};

export const addNotification = createAsyncThunk("notifications/add", async (toast: Omit<Notification, "id">, thunkAPI) => {
	let id = nanoid();
	thunkAPI.dispatch(slice.actions.addNotification({id, ...toast}));
	setTimeout(() => thunkAPI.dispatch(slice.actions.deleteNotification(id)), 3000);
});

const slice = createSlice({
	name: 'notifications',
	initialState: [] as Notification[],
	reducers: {
		addNotification: (state: Notification[], action: PayloadAction<Notification>) => {
			state.push(action.payload);
		},
		deleteNotification: (state: Notification[], action: PayloadAction<string>) => {
			return state.filter(message => message.id !== action.payload)
		},
		clearNotifications: (state: Notification[], action: PayloadAction<void>) => {
			return [];
		}
	},
});

export default slice.reducer;

export const { clearNotifications } = slice.actions;

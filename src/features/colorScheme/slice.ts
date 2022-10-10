import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const enum LocalStorage {
	ColorScheme = "COLOR_SCHEME"
};

export const enum ColorScheme {
	Dark = "DARK",
	Light = "LIGHT",
};

const slice = createSlice({
	name: 'colorScheme',
	initialState: (): ColorScheme => {
		switch(localStorage.getItem(LocalStorage.ColorScheme)) {
			case ColorScheme.Dark:
				return ColorScheme.Dark;
			case ColorScheme.Light:
				return ColorScheme.Light;
		}

		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return ColorScheme.Dark;
		}

		return ColorScheme.Light;
	},
	reducers: {
		setScheme: (state: ColorScheme, action: PayloadAction<ColorScheme>) => {
			localStorage.setItem(LocalStorage.ColorScheme, action.payload);

			return action.payload
		}
	},
});

export default slice.reducer;

export const { setScheme } = slice.actions;

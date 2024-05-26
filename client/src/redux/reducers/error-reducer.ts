import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	error: ''
}

const ErrorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
		setError(state, action) {
			state.error = action.payload;
		},
		removeError(state) {
			state.error = initialState.error;
		}
    },
    extraReducers: (builder) => {
    }
})

export const { setError, removeError } = ErrorSlice.actions

export default ErrorSlice.reducer

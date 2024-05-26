import { createSlice } from "@reduxjs/toolkit";


const initialState = {
	loader: true,
	modal: {
		isOpen: false,
		text: '',
		onConfirm: () => {},
		onCancel: () => {},
	},
}

const AppSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
		openLoader(state) {
			state.loader = true;
		},
		closeLoader(state) {
			state.loader = false;
		},
		openModal(state, action) {
			state.modal = {
				...state.modal,
				isOpen: true,
				...action.payload
			}
		},
		closeModal(state) {
			state.modal = initialState.modal;
		}
    },
    extraReducers: (builder) => {
        // builder
        //     .addCase(getDicesFromDb.fulfilled, (state, action) => {

        //     })
            // .addCase(rollDices.fulfilled, (state, action) => {

            // })
    }
})

export const { openLoader, closeLoader, openModal, closeModal} = AppSlice.actions

export default AppSlice.reducer

import { createSlice } from "@reduxjs/toolkit";


const initialState = {
	headerNameMenuDisplay: false,
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
        setHeaderNameMenuDisplay(state, action) {
			state.headerNameMenuDisplay =  action.payload;
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

export const {setHeaderNameMenuDisplay, openModal, closeModal} = AppSlice.actions

export default AppSlice.reducer

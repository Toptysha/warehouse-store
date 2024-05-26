import { createSlice } from "@reduxjs/toolkit";
import { ROLE } from "../../constants";


const initialState = {
	id: null,
	login: null,
	roleId: ROLE.GUEST,
	session: null,
}

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
			state.id = action.payload.id;
			state.login = action.payload.login;
			state.roleId = action.payload.roleId;
			state.session = action.payload.session;
		},
		logout(state) {
			state.id = initialState.id;
			state.login = initialState.login;
			state.roleId = initialState.roleId;
			state.session = initialState.session;
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

export const {setUser, logout} = UserSlice.actions

export default UserSlice.reducer

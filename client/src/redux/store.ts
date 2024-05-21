// import { reducer } from '../redux/reducer';
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userReducer from "./reducers/user-reducer";
import appReducer from "./reducers/app-reducer";

export const store = configureStore({
    reducer: {
		app: appReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const useAppDispatch: () => typeof store.dispatch = useDispatch;

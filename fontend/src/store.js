import { configureStore } from "@reduxjs/toolkit";
import notiReducer from "../reducers/notiReducer";
import userReducer from "../reducers/userReducer";

export default configureStore({
    reducer: {
        notiReducer,
        user: userReducer,
    },
});

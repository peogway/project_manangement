import { configureStore } from "@reduxjs/toolkit";
import notiReducer from "./reducers/notiReducer";
import userReducer from "./reducers/userReducer";
import prjReducer from "./reducers/prjReducer";
import categoryReducer from "./reducers/categoryReducer";
import taskReducer from "./reducers/taskReducer";

export default configureStore({
    reducer: {
        notiReducer,
        user: userReducer,
        projects: prjReducer,
        tasks: taskReducer,
        categories: categoryReducer,
    },
});

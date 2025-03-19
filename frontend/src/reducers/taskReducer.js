import { createSlice } from "@reduxjs/toolkit";
import taskService from "../services/task";
import { setAllProject } from "./prjReducer";
import { getToken, isTokenExpired } from "../services/login";
import { rmUserFn } from "./userReducer";

const initialState = [];

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        createTask(state, action) {
            state.push(action.payload);
        },
        setTasks(state, action) {
            return action.payload;
        },
        dltTask(state, action) {
            return state.filter((task) => task.id !== action.payload);
        },
        editTask(state, action) {
            const id = action.payload.id;
            return state.map((task) =>
                task.id !== id ? task : { ...task, ...action.payload }
            );
        },
    },
});

export const { createTask, setTasks, dltTask, editTask } = taskSlice.actions;

export const createNewTask = (body) => {
    return async (dispatch) => {
        const token = getToken();
        if (isTokenExpired(token)) {
            dispatch(rmUserFn());
            return;
        }
        const newTask = await taskService.addTask(body);
        dispatch(createTask(newTask));
        dispatch(setAllProject());
    };
};

export const setAllTasks = () => {
    return async (dispatch) => {
        const token = getToken();
        if (isTokenExpired(token)) {
            dispatch(rmUserFn());
            return;
        }
        const tasks = await taskService.getAll();
        dispatch(setTasks(tasks));
    };
};

export const updateTask = (task) => {
    return async (dispatch) => {
        const token = getToken();
        if (isTokenExpired(token)) {
            dispatch(rmUserFn());
            return;
        }
        const updatedTask = await taskService.editTask(task);
        dispatch(editTask(updatedTask));
    };
};

export const deleteTask = (taskId) => {
    return async (dispatch) => {
        const token = getToken();
        if (isTokenExpired(token)) {
            dispatch(rmUserFn());
            return;
        }
        await taskService.deleteTask(taskId);
        dispatch(dltTask(taskId));
    };
};

export default taskSlice.reducer;

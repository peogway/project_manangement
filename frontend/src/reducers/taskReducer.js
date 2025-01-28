import { createSlice } from "@reduxjs/toolkit";
import taskService from "../services/task";
import task from "../services/task";

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
        const newTask = await taskService.addTask(body);
        dispatch(createTask(newTask));
    };
};

export const setAllTasks = () => {
    return async (dispatch) => {
        const tasks = await taskService.getAll();
        dispatch(setTasks(newTask));
    };
};

export const updateTask = (task) => {
    return async (dispatch) => {
        const updatedTask = await taskService.editTask(task);
        dispatch(editTask(updatedTask));
    };
};

export const deleteTask = (taskId) => {
    return async (dispatch) => {
        await taskService.deleteTask(taskId);
        dispatch(dltTask(taskId));
    };
};

export default taskSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import prjService from "../services/prj";

const initialState = [];

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        createProject(state, action) {
            state.push(action.payload);
        },

        setProjects(state, action) {
            return action.payload;
        },

        editProject(state, action) {
            const id = action.payload.id;

            return state.map((project) =>
                project.id !== id ? project : action.payload
            );
        },
        dltProject(state, action) {
            return state.filter((project) => project.id !== action.payload);
        },
    },
});

export const { createProject, setProjects, editProject, dltProject } =
    projectSlice.actions;

export const createNewProject = (project) => {
    return async (dispatch) => {
        const newProject = await prjService.addProject(project);
        dispatch(createProject(newProject));
    };
};

export const setAllProject = () => {
    return async (dispatch) => {
        const projects = await prjService.getAll();
        dispatch(setProjects(projects));
    };
};

export const updateProject = (project) => {
    return async (dispatch) => {
        await prjService.editProject(project);
        dispatch(editProject(project));
    };
};

export const deleteProject = (prjId) => {
    return async (dispatch) => {
        await prjService.deleteProject(prjId);
        dispatch(dltProject(prjId));
    };
};

export default projectSlice.reducer;

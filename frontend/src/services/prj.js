import axios from "axios";
const baseUrl = "/api/projects";

import { getToken } from "./login";

const getAll = async () => {
    const config = {
        headers: { Authorization: getToken() },
    };

    const res = await axios.get(baseUrl, config);
    return res.data;
};

const addProject = async (project) => {
    const config = {
        headers: { Authorization: getToken() },
    };

    const res = await axios.post(baseUrl, {
        ...project,
        categories: project.categories.map((cate) => cate.id),
    }, config);
    return res.data;
};

const deleteProject = async (projectId) => {
    const config = {
        headers: { Authorization: getToken() },
    };

    const res = await axios.delete(`${baseUrl}/${projectId}`, config);
    return res.data;
};

const editProject = async (project) => {
    const config = {
        headers: { Authorization: getToken() },
    };

    const res = await axios.put(`${baseUrl}/${project.id}`, {
        ...project,
        categories: project.categories.map((cate) => cate.id),
    }, config);
    return res.data;
};

export default { getAll, addProject, deleteProject, editProject };

import axios from "react";
const baseUrl = "http://localhost:3001/api/projects";

import { token } from "./login";

const getAll = async () => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.get(baseUrl, config);
    return res.data;
};

const addProject = async (project) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.post(baseUrl, project, config);
    return res.data;
};

const deleteProject = async (projectId) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.delete(`${baseUrl}/${projectId}`, config);
    return res.data;
};

const editProject = async (project) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.put(`${baseUrl}/${project.id}`, project, config);
    return res.data;
};

export default { getAll, addProject, deleteProject, editProject };

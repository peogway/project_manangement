import axios from "react";
const baseUrl = "http://localhost:3001/api/tasks";

import { token } from "./login";

const getAll = async (prjId) => {
    const config = {
        headers: { Authorization: token },
        params: {
            projectId: prjId,
        },
    };

    const response = await axios.get(baseUrl, config);
    return response.data;
};

const addTask = async (body) => {
    const { projectId, ...task } = body;
    const config = {
        headers: { Authorization: token },
        params: {
            projectId: projectId,
        },
    };

    const res = await axios.post(baseUrl, task, config);
    return res.data;
};

const deleteTask = async (taskId) => {
    const config = {
        headers: { Authorization: token },
    };
    const res = await axios.delete(`${baseUrl}/${taskId}`, config);
    return res.data;
};

const editTask = async (task) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.put(`${baseUrl}/${task.id}`, task, config);
    return res.data;
};

export default { getAll, addTask, deleteTask, editTask };

import axios from "axios";
const baseUrl = "http://localhost:3001/api/categories";

import { getToken } from "./login";

const getAll = async () => {
    const config = {
        headers: { Authorization: getToken() },
    };

    const res = await axios.get(baseUrl, config);
    return res.data;
};

const addCategory = async (category) => {
    const config = {
        headers: { Authorization: getToken() },
    };

    const res = await axios.post(baseUrl, {
        ...category,
        projects: category.projects.map((project) => project.id),
    }, config);
    return res.data;
};

const deleteCategory = async (cateId) => {
    const config = {
        headers: { Authorization: getToken() },
    };

    const res = await axios.delete(`${baseUrl}/${cateId}`, config);
    return res.data;
};

const editCategory = async (category) => {
    const config = {
        headers: { Authorization: getToken() },
    };

    const res = await axios.put(`${baseUrl}/${category.id}`, {
        ...category,
        projects: category.projects.map((project) => project.id),
    }, config);
    return res.data;
};

export default { getAll, addCategory, deleteCategory, editCategory };

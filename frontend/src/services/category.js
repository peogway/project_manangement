import axios from "react";
const baseUrl = "http://localhost:3001/api/categories";

import { token } from "./login";

const getAll = async () => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.get(baseUrl, config);
    return res.data;
};

const addCategory = async (category) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.post(baseUrl, category, config);
    return res.data;
};

const deleteCategory = async (cateId) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.delete(`${baseUrl}/${cateId}`, config);
    return res.data;
};

const editCategory = async (category) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.put(`${baseUrl}/${category.id}`, category, config);
    return res.data;
};

export default { getAll, addCategory, deleteCategory, editCategory };

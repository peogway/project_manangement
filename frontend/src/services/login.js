import axios from "axios";
const baseUrl = "http://localhost:3001/login";
let token = null;

const setToken = (newToken) => token = `Bearer ${newToken}`;

const login = async (credentials) => {
    const response = await axios.post(baseUrl, credentials);
    return response.data;
};

const getToken = () => token;

export { getToken, setToken };
export default { login };

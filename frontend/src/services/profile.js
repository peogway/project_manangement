import axios from 'axios'

const baseUrl = 'http://localhost:3001/profile'
import { getToken } from './login'

const updateAvatar = async (pic) => {
	const formData = new FormData()
	formData.append('avatar', pic)
	const config = {
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: getToken(),
		},
	}

	const res = await axios.post(`${baseUrl}/upload-avatar`, formData, config)
	return res.data
}

const updateProfile = async (data) => {
	const config = {
		headers: {
			Authorization: getToken(),
		},
	}
	const res = await axios.put(`${baseUrl}`, data, config)
	return res.data
}

export default { updateAvatar, updateProfile }

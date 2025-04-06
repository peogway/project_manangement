import axios from 'axios'

const baseUrl = 'http://localhost:3001/upload-avatar'
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

	const res = await axios.post(baseUrl, formData, config)
	return res.data
}

export default { updateAvatar }


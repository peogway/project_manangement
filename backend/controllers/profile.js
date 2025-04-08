const User = require('../models/user')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const validator = require('validator')
const { isValidPhoneNumber } = require('libphonenumber-js')

const profileRouter = require('express').Router()

// Ensure the 'uploads/avatars' directory exists, if not, create it
const uploadDir = path.join(__dirname, '../uploads/avatars')
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true })
}

// Storage configuration for multer
const storage = multer.diskStorage({
	// Define the destination folder for uploaded files
	destination: './uploads/avatars/',
	// Define how to name the uploaded file (using timestamp for uniqueness)
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`)
	},
})

// Initialize multer with the defined storage config
const upload = multer({ storage })

// Profile upload endpoint to handle avatar image uploads
profileRouter.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
	const userRequest = req.user // Get the user from the request (assumed to be set by authentication middleware)

	// Check if the user is authenticated
	if (!userRequest) {
		return res.status(401).json({ error: 'token invalid' })
	}

	// Find the user in the database using their ID from the token
	const user = await User.findById(userRequest.id)
	if (!user) {
		return res.status(404).json({ error: 'User not found' })
	}

	// Check if a file was uploaded
	if (!req.file) return res.status(400).send('No file uploaded.')

	// If the user already has an avatar, delete the old file
	if (user.avatarUrl) {
		const oldAvatarPath = path.join(__dirname, '..', user.avatarUrl) // Get the full path to the old avatar file
		if (fs.existsSync(oldAvatarPath)) {
			fs.unlinkSync(oldAvatarPath) // Delete the old avatar
		}
	}

	// Save the new avatar file path in the user document
	const filePath = `/uploads/avatars/${req.file.filename}`
	user.avatarUrl = filePath
	await user.save()

	// Respond with the URL of the uploaded avatar
	res.json({ avatarUrl: filePath })
})

profileRouter.put('/', async (req, res) => {
	const userRequest = req.user
	if (!userRequest) {
		return res.status(401).json({ error: 'token invalid' })
	}

	const user = await User.findById(userRequest.id)
	if(!user) {
		return res.status(404).json({ error: 'User not' })
	}
	const { name, email, phone } = req.body
	
	if ( !name ) return res.status(400).send('Missing field name')
	if ( email?.length > 0 && !validator.isEmail(email) ) return res.status(400).send('Invalid email')
	if ( phone?.length > 0 && !isValidPhoneNumber(phone) ) return res.status(400).send('Invalid phone')

	const updatedUser = await User.findByIdAndUpdate(userRequest.id, {name, email: email?.length > 0 ? email : null , phoneNumber: phone?.length > 0 ? phone : null}, { new: true })
	res.status(204).end();
})

// Export the profileRouter to be used in other parts of the application
module.exports = profileRouter

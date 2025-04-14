import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Heading from './Heading'
import profilePicNull from '../assets/profile-picture-null.png'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import Avatar from 'react-avatar-edit'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

import { setError, setNotification } from '../reducers/notiReducer'
import userEditPng from '../assets/user-edit.png'

import { isValidPhoneNumber } from 'libphonenumber-js'
import { updateAvatar, updateProfile } from '../reducers/userReducer'

import NotListedLocationIcon from '@mui/icons-material/NotListedLocation'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import PhoneDisplay from './PhoneDisplay'

const Profile = ({ user }) => {
	const [imageCrop, setImageCrop] = useState(false) // to control the cropping dialog
	const [src, setSrc] = useState(null) // source for the avatar image
	const [pview, setPview] = useState(null) // cropped image preview

	const [isHovered, setIsHovered] = useState(false)
	const dialogRef = useRef(null)
	const avatarUrl = user?.avatarUrl
	const [profileImage, setProfileImage] = useState(avatarUrl)

	const [isEditting, setIsEditting] = useState(false)
	const [emailValid, setEmailValid] = useState(true)

	const [genders, setGenders] = useState([
		user.gender === 'Male',
		user.gender === 'Female',
		user.gender === 'Other',
	])

	const [nameInput, setNameInput] = useState(user.name)
	const [emailInput, setEmailInput] = useState(user.email || '')
	const [dob, setDob] = useState(
		user.dateOfBirth
			? new Date(user.dateOfBirth).toISOString().split('T')[0]
			: ''
	)
	const [phone, setPhone] = useState(user.phoneNumber || '')

	const dispatch = useDispatch()

	const nameValid = nameInput.length > 0

	// Handle validate email
	useEffect(() => {
		if (
			emailInput.length === 0 ||
			emailInput.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
		) {
			setEmailValid(true)
		} else {
			setEmailValid(false)
		}
	}, [emailInput])

	// Detect click outside of the dialog
	useEffect(() => {
		const handleClickOutside = (event) => {
			// Check if the dialog is rendered
			if (dialogRef.current) {
				const dialogRect = dialogRef.current.getBoundingClientRect()

				// Get mouse click position
				const mouseX = event.clientX
				const mouseY = event.clientY

				// Calculate the distance from the click to the dialog's nearest edge
				const distanceTop = dialogRect.top - mouseY
				const distanceBottom = mouseY - dialogRect.bottom
				const distanceLeft = dialogRect.left - mouseX
				const distanceRight = mouseX - dialogRect.right

				// Check if the click is outside and the distance from the edge is greater than 100px
				if (
					distanceTop > 34 ||
					distanceBottom > 34 ||
					distanceLeft > 41 ||
					distanceRight > 41
				) {
					closeDialog()
				}
			}
		}
		document.addEventListener('mousedown', handleClickOutside)

		if (user.avatarUrl !== null)
			setProfileImage(`http://localhost:3001${avatarUrl}`)

		// Cleanup the event listener on component unmount
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])
	// Handle update avatar
	useEffect(() => {
		if (avatarUrl) {
			setProfileImage(`http://localhost:3001${avatarUrl}`) // Make sure the URL is absolute and points to your server
		}
	}, [user])

	const closeDialog = () => {
		setImageCrop(false)
	}
	const onClose = () => {
		setPview(null)
	}

	const onCrop = (view) => {
		setPview(view)
	}
	const saveCropImage = () => {
		// Convert base64 image to a File object
		const base64Image = pview.split(',')[1] // Remove the base64 prefix
		const byteArray = new Uint8Array(
			atob(base64Image)
				.split('')
				.map((char) => char.charCodeAt(0))
		)
		const file = new File([byteArray], 'avatar.png', { type: 'image/png' })

		// Dispatch updateAvatar to upload the cropped image
		dispatch(updateAvatar(file))
		// setProfileImage(pview)
		setImageCrop(false)
	}

	useEffect(() => {
		window.localStorage.setItem('loggedPrjMnUser', JSON.stringify(user))
	}, [user])

	const onBeforeFileLoad = (elem) => {
		const file = elem.target.files[0]
		// File size check: 1MB limit (in bytes)
		const maxSize = 1024 * 1024 // 1MB
		if (file.size > maxSize) {
			alert('File is too big! Max size is 1MB.')
			elem.target.value = '' // Reset the input
			return
		}
	}

	const handleUpdateUser = () => {
		if (!nameValid) {
			dispatch(setError('Invalid name', 2))
			return
		}
		if (!emailValid) {
			dispatch(setError('Invalid email format', 2))
			return
		}
		if (phone.length > 0 && !isValidPhoneNumber(`+${phone}`)) {
			dispatch(setError('Invalid phone number', 2))
			return
		}

		const userToUpdate = {
			...user,
			name: nameInput,
			email: emailInput ? emailInput : null,
			gender: genders[0]
				? 'Male'
				: genders[1]
				? 'Female'
				: genders[2]
				? 'Other'
				: null,
			dateOfBirth: dob ? dob : null,
			phoneNumber: phone ? phone : null,
		}
		dispatch(updateProfile(userToUpdate))
		setIsEditting(false)
	}

	const onCancel = () => {
		setIsEditting(false)
		setGenders([
			user.gender === 'Male',
			user.gender === 'Female',
			user.gender === 'Other',
		])
		setNameInput(user.name)
		setEmailInput(user.email ? user.email : '')
		setDob(
			user.dateOfBirth
				? new Date(user.dateOfBirth).toISOString().split('T')[0]
				: ''
		)
		setPhone(user.phoneNumber || '')
	}

	const toggleCheckbox = (index) => {
		if (genders[index]) {
			setGenders([false, false, false])
		} else {
			setGenders(genders.map((gender, i) => (i === index ? true : false)))
		}
	}
	const formatDate = (dateStr) => {
		const d = new Date(dateStr)
		return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
			.toString()
			.padStart(2, '0')}/${d.getFullYear()}`
	}
	const phoneValid = isValidPhoneNumber(`+${phone}`)

	return (
		<div className='z-999 flex flex-col items-center h-screen flex-1 overflow-auto left-[60px] max-w-[calc(100vw-60px)]  relative'>
			<Heading name='Profile' user={user} />
			<div className='relative h-full w-[60%]  top-[200px]'>
				<div className='absolute h-[700px] bg-white top-0 w-full rounded-t-[10%] rounded-b-4xl '></div>
				<div className='absolute top-0 w-full h-[750px]'></div>
				{/* Photo */}
				<div className='flex flex-col relative justify-center items-center w-full h-[95%]'>
					{/* picure */}
					<div
						className={`absolute w-50 h-50 bottom-full left-0 rounded-full translate-y-[70%] right-[50%] translate-x-[50%] box`}
						style={{
							// backgroundImage: user.avatarUrl ? '' : `url(${profilePicNull})`,
							backgroundImage: profileImage
								? `url(${profileImage})`
								: `url(${profilePicNull})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						onClick={() => setImageCrop(true)} // Trigger cropping modal when clicked
					>
						{isHovered && (
							<div className='w-full h-full flex rounded-full items-center justify-center'>
								<div className='absolute w-full top-0 right-0 h-full  rounded-full  bg-black opacity-50'></div>
								<div className='flex text-white relative z-1000 scale-170 !opacity-100'>
									<AddAPhotoIcon fontSize='large' />
								</div>
							</div>
						)}
					</div>

					{/* Dialog and File input */}
					<Dialog
						visible={imageCrop}
						header={() => (
							<p className='text-2xl font-semibold text-slat-800 pt-4 px-10 left-0 absolute top-0 '>
								Update Profile Photo
							</p>
						)}
						onHide={() => setImageCrop(false)}
						style={{ zIndex: 9998 }}
						className='pt-5 px-10 pb-8 bg-white !rounded-2xl'
					>
						<div
							className='flex flex-col items-center select-nones '
							ref={dialogRef}
						>
							<div className='mt-10 cursor-pointer avatar-crop react-avatar-edit'>
								<Avatar
									width={500}
									height={300}
									onCrop={onCrop}
									onClose={onClose}
									src={src}
									shadingColor={'#474649'}
									backgroundColor={'#474649'}
									label='Choose a photo'
									labelStyle={{
										fontSize: '24px', // Adjust font size as needed
										display: 'flex', // Use flex to center label
										justifyContent: 'center',
										alignItems: 'center',
										position: 'absolute', // Position it absolutely within the Avatar
										width: '500px', // Make it take the entire width of the Avatar
										height: '300px', // Make it take the entire height of the Avatar
										textAlign: 'center', // Center the text inside the circle
										cursor: 'pointer', // Make it clickable
									}}
									onBeforeFileLoad={onBeforeFileLoad}
								/>
							</div>

							<div className='flex flex-col items-center mt-5 w-12 rounded-2xl'>
								<Button
									onClick={saveCropImage}
									label='Save'
									icon='pi pi-external-link"'
									className='flex justify-around w-12 mt-4 bg-orange-500 rounded-2xl text-white w-30 h-10 text-xl'
								></Button>
							</div>
						</div>
					</Dialog>
				</div>

				<div
					className='absolute top-10 right-20 scale-60 hover:scale-62'
					onClick={() => setIsEditting(true)}
				>
					<img src={userEditPng} />
				</div>

				<div className='flex flex-col items-center gap-10 absolute w-[80%] h-[490px] top-50 translate-x-[50%] right-[50%]'>
					{/* Name */}
					<div className='flex w-full'>
						<label className='font-bold w-60  text-xl text-slate-700 ml-30'>
							Name:
						</label>
						{isEditting ? (
							<div
								className={`${
									nameValid
										? 'border-1 border-slate-500'
										: 'border-2 border-red-600'
								} max-w-[280px] flex flex-1 items-center ml-5 text-slate-600 rounded-lg relative`}
							>
								<input
									type='text'
									value={nameInput}
									onChange={(e) => setNameInput(e.target.value)}
									className='focus:outline-none px-2'
									placeholder='Enter your name'
								/>
								{!nameValid && (
									<div className='absolute bottom-full left-0 text-red-700 text-sm'>
										Invalid name
									</div>
								)}
							</div>
						) : (
							<div className='flex text-lg flex-1 items-center ml-5 text-slate-600'>
								{user.name}
							</div>
						)}
					</div>

					{/* Username */}
					<div className='flex w-full'>
						<label className='font-bold w-60  text-xl text-slate-700 ml-30'>
							Username:
						</label>

						<div className='flex flex-1 text-lg items-center ml-5 text-slate-600'>
							{user.username}
						</div>
					</div>

					{/* Email */}
					<div className='flex w-full'>
						<label className='font-bold w-60  text-xl text-slate-700 ml-30'>
							Email:
						</label>
						{isEditting ? (
							<div
								className={`${
									emailValid
										? 'border-slate-500 border-1'
										: 'border-2 border-red-600'
								} flex max-w-[280px] flex-1 items-center ml-5 text-slate-600 rounded-lg  relative`}
							>
								{!emailValid && (
									<div className='absolute bottom-full left-0 text-red-700 text-sm'>
										Invalid email
									</div>
								)}
								<input
									type='text'
									value={emailInput}
									onChange={(e) => setEmailInput(e.target.value)}
									className='focus:outline-none px-2'
									placeholder='Enter your email'
								/>
							</div>
						) : (
							<div className='flex flex-1 text-lg items-center ml-5 text-slate-600 relative'>
								{user.email ? (
									<div className='absolute top-0 left-0 flex text-lg flex-1 items-center  text-slate-600'>
										{user.email}
									</div>
								) : (
									<NotListedLocationIcon className='scale-130' />
								)}
							</div>
						)}
					</div>

					{/* Gender */}
					<div className='flex w-full'>
						<label className='font-bold w-60  text-xl text-slate-700 ml-30'>
							Gender:
						</label>
						{isEditting ? (
							<div className='flex max-w-[330px] w-[330px]  justify-between items-center text-slate-600 relative'>
								<div className='flex gap-1 items-center'>
									<input
										type='checkbox'
										checked={genders[0]}
										onChange={() => toggleCheckbox(0)}
										className='text-orange-200 accent-orange-300 w-5 h-5'
									/>
									<label className='semi-bold text-slate-600'>Male</label>
								</div>
								<div className='flex gap-1 items-center'>
									<input
										type='checkbox'
										checked={genders[1]}
										onChange={() => toggleCheckbox(1)}
										className='text-orange-200 accent-orange-300 w-5 h-5'
									/>
									<label className='semi-bold text-slate-600'>Female</label>
								</div>
								<div className='flex gap-1 items-center'>
									<input
										type='checkbox'
										checked={genders[2]}
										onChange={() => toggleCheckbox(2)}
										className='text-orange-200 accent-orange-300 w-5 h-5'
									/>
									<label className='semi-bold text-slate-600'>Other</label>
								</div>
							</div>
						) : (
							<div className='flex flex-1 text-lg items-center ml-5 text-slate-600'>
								{user.gender === null ? (
									<NotListedLocationIcon className='scale-130' />
								) : (
									<div className='flex text-lg flex-1 items-center text-slate-600'>
										{user.gender}
									</div>
								)}
							</div>
						)}
					</div>

					{/* Date of Birth */}
					<div className='flex w-full'>
						<label className='font-bold w-60  text-xl text-slate-700 ml-30'>
							Date of birth:
						</label>
						{isEditting ? (
							<div className='flex max-w-[280px] flex-1 items-center ml-5 border-1 border-slate-500 rounded-lg text-slate-600'>
								<input
									className='focus:outline-none px-2'
									type='date'
									value={dob}
									onChange={(e) => setDob(e.target.value)}
								/>
							</div>
						) : (
							<div className='flex flex-1 text-lg items-center ml-5 text-slate-600'>
								{user.dateOfBirth === null ? (
									<NotListedLocationIcon className='scale-130' />
								) : (
									<div className=''>{formatDate(user.dateOfBirth)}</div>
								)}
							</div>
						)}
					</div>

					{/* Phone Number */}
					<div className='flex w-full'>
						<label className='font-bold w-60  text-xl text-slate-700 ml-30'>
							Phone number:
						</label>
						{isEditting ? (
							<div
								className={`flex max-w-[280px]  flex-1 items-center ml-5  relative`}
							>
								<div
									className={`flex w-full h-full items-center text-slate-500 ${
										phoneValid
											? 'border border-slate-500'
											: 'border-2 border-red-600'
									} overflow-hidden`}
								>
									<PhoneInput
										country={'auto'}
										value={phone}
										onChange={setPhone}
										enableSearch={true}
										enableAreaCodes={true}
										autoFormat={true}
										disableDropdown={false}
										localization={{}}
										placeholder='Enter phone number'
										inputProps={{
											name: 'phone',
											required: true,
											autoFocus: true,
										}}
									/>
								</div>
								{!phoneValid && (
									<div className='absolute bottom-full left-0 text-red-700 text-sm'>
										Invalid phone number
									</div>
								)}
							</div>
						) : (
							<div className='flex flex-1 text-lg items-center ml-5 text-slate-600'>
								{user.phoneNumber === null ? (
									<NotListedLocationIcon className='scale-130' />
								) : (
									<PhoneDisplay user={user} />
								)}
							</div>
						)}
					</div>

					{/* Buttons */}
					{isEditting && (
						<div className='flex w-full items-center mt-2 justify-center select-none'>
							<div
								className='text-white bg-orange-500 mr-4 p-2 rounded-xl semi-bold'
								onClick={handleUpdateUser}
							>
								Apply changes
							</div>
							<div
								className='text-slate-800 bg-slate-300 rounded-xl p-2 semi-bold'
								onClick={onCancel}
							>
								Cancel
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Profile

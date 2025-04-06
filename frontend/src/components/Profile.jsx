import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Heading from './Heading'
import profilePicNull from '../assets/profile-picture-null.png'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import Avatar from 'react-avatar-edit'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'

import { updateAvatar } from '../reducers/userReducer'

const Profile = () => {
	const [imageCrop, setImageCrop] = useState(false) // to control the cropping dialog
	const [src, setSrc] = useState(null) // source for the avatar image
	const [pview, setPview] = useState(null) // cropped image preview
	const [isHovered, setIsHovered] = useState(false)
	const dialogRef = useRef(null)
	const user = useSelector((state) => state.user)
	const avatarUrl = user?.avatarUrl
	const [profileImage, setProfileImage] = useState(avatarUrl)

	const dispatch = useDispatch()

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

	useEffect(() => {
		if (avatarUrl) {
			setProfileImage(`http://localhost:3001${avatarUrl}`) // Make sure the URL is absolute and points to your server
		}
	}, [avatarUrl])

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

	return (
		<div className='z-999 flex flex-col items-center h-screen flex-1 overflow-auto left-[60px] max-w-[calc(100vw-60px)]  relative'>
			<Heading name='Profile' user={user} />
			<div className='relative h-full w-[60%]  top-[200px]'>
				<div className='absolute h-[95%] bg-white top-0 w-full rounded-t-[10%] rounded-b-4xl '></div>
				{/* Photo */}
				<div className='flex flex-col relative justify-center items-center w-full h-[95%]'>
					{/* picure */}
					<div
						className={`absolute w-50 h-50 bottom-full rounded-full translate-y-[70%] right-[50%] translate-x-[50%] box`}
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
									width={600}
									height={400}
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
										width: '600px', // Make it take the entire width of the Avatar
										height: '400px', // Make it take the entire height of the Avatar
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
			</div>
		</div>
	)
}

export default Profile

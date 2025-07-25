import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { rmUserFn } from '../reducers/userReducer'

import profilePicNull from '../assets/profile-picture-null.png'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PersonIcon from '@mui/icons-material/Person'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

const Avatar = ({ user, optionsPosRight }) => {
	const { t, i18n } = useTranslation()
	const [showOptions, setShowOptions] = useState(false)
	const optionsRef = useRef(null)

	const navigate = useNavigate()
	const dispatch = useDispatch()

	// Toggle showOptions when click outside or resize
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (optionsRef.current && !optionsRef.current.contains(event.target)) {
				setShowOptions(false)
			}
		}

		const handleResize = () => {
			// Close the drop down menu when the window is resized
			setShowOptions(false)
		}
		if (showOptions) {
			document.addEventListener('mousedown', handleClickOutside)
			window.addEventListener('resize', handleResize)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('resize', handleResize)
			// Restore scrolling
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('resize', handleResize)

			// Restore scrolling on cleanup
		}
	}, [showOptions])
	return (
		<div
			className={`flex z-1000 w-12 h-12 rounded-full justify-center items-center relative box ${
				showOptions ? '' : 'hover:opacity-90'
			} `}
			style={{
				backgroundImage: user.avatarUrl
					? `url(${user.avatarUrl})`
					: `url(${profilePicNull})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
			onMouseDown={(e) => {
				if (optionsRef.current && optionsRef.current.contains(e.target)) {
					// Click inside options, don't block event
					return
				}
				if (e.target === e.currentTarget) {
					// Only prevent default if clicking on the div itself, not text
					e.preventDefault()
				}

				e.stopPropagation()
				setShowOptions(!showOptions)
			}}
		>
			<div className='rounded-full bg-black opacity-40 absolute w-4 h-4 bottom-0 right-0  flex justify-center items-center'></div>
			<div className='flex justify-center items-center scale-70 absolute text-white bottom-[-4px] right-[-3px]'>
				<KeyboardArrowDownIcon />
			</div>
			<div
				className={`absolute box ${showOptions ? 'block' : 'hidden'} top-full ${
					optionsPosRight ? 'left-0' : 'right-0'
				} w-[150px] h-[240px] bg-white mt-3 rounded-xl flex flex-col gap-3 items-center`}
				ref={optionsRef}
			>
				<div
					className='w-[90%] p-2 rounded-xl h-[60px] hover:bg-blue-200 mt-4 flex text-slate-600'
					onClick={() => {
						setShowOptions(false)
						navigate('/profile')
					}}
				>
					<div className=' flex items-center gap-4 ml-2 '>
						<div className='items-center flex justify-center'>
							<PersonIcon />
						</div>
						<span>{t('Profile')}</span>
					</div>
				</div>

				<div
					className='w-[90%] p-2 rounded-xl h-[60px] hover:bg-blue-200 flex text-slate-600'
					onClick={() => {
						setShowOptions(false)
						navigate('/account')
					}}
				>
					<div className=' flex items-center gap-4 ml-2'>
						<div className='items-center flex justify-center'>
							<VpnKeyIcon />
						</div>
						<span>{t('Account')}</span>
					</div>
				</div>

				<div
					className='w-[90%] p-2 rounded-xl h-[60px] hover:bg-blue-200 flex text-slate-600'
					onClick={() => {
						setShowOptions(false)
						window.localStorage.removeItem('loggedPrjMnUser') // Remove user from localStorage
						window.localStorage.removeItem('visitedDashboard')
						dispatch(rmUserFn()) // Dispatch action to remove user from Redux
						navigate('/')
					}}
				>
					<div className=' flex items-center gap-4 ml-2'>
						<div className='items-center flex justify-center'>
							<LogoutIcon />
						</div>
						<span>{t('Sign Out')}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Avatar

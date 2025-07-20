import VNFlag from '../assets/flag_vietnam.png'
import EnFlag from '../assets/flag_uk.png'
import FiFlag from '../assets/flag_finland.png'
import { useTranslation } from 'react-i18next'
import LanguageIcon from '@mui/icons-material/Language'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import React, { useRef, useEffect } from 'react'

const LanguageDropDown = ({
	openLanguageDropDown,
	setOpenLanguageDropDown,
	setChosenCard,
	chosenCard,
}) => {
	const { t, i18n } = useTranslation()
	const dropDownRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
				setOpenLanguageDropDown(false)
			}
		}

		const handleResize = () => {
			// Close the drop down menu when the window is resized
			setOpenLanguageDropDown(false)
		}
		if (openLanguageDropDown) {
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
	}, [openLanguageDropDown])
	return (
		<div className='flex absolute left-250 justify-center items-center w-[150px]'>
			<div className=''>
				<LanguageIcon fontSize='large' />
			</div>
			<div
				className='flex relative justify-center items-center left-4 cursor-pointer border-gray-200 p-1 border-1 rounded-xl'
				// onClick={() => setOpenLanguageDropDown((prev) => !prev)}
				onMouseDown={(e) => {
					if (e.target === e.currentTarget) {
						// Only prevent default if clicking on the div itself, not text
						e.preventDefault()
					}

					e.stopPropagation()
					setOpenLanguageDropDown((prev) => !prev)
				}}
			>
				<div className=''>{React.createElement(chosenCard)}</div>
				<div className='ml-3'>
					<KeyboardArrowDownIcon />
				</div>
			</div>
			<div
				ref={dropDownRef}
				className={` ${
					openLanguageDropDown ? 'block' : 'hidden'
				} z-20 overflow-auto whitespace-nowrap bg-white absolute p-2 
            select-none  user-select-none border border-slate-50 w-auto shadow-md box rounded-lg flex flex-col gap-2 top-full mt-2 right-0 ml-13  `}
			>
				<div
					className='hover:text-orange-600 hover hover:bg-orange-100 rounded-xl p-2'
					onClick={(e) => {
						e.stopPropagation()
						localStorage.setItem('language', 'en')
						setChosenCard(() => enCard)
						setOpenLanguageDropDown(false)

						i18n.changeLanguage('en')
					}}
				>
					{enCard()}
				</div>
				<hr className='w-[80%] text-slate-400  mx-auto opacity-55 '></hr>

				<div
					className='hover:text-orange-600 hover hover:bg-orange-100 rounded-xl p-2'
					onClick={(e) => {
						e.stopPropagation()
						localStorage.setItem('language', 'fi')
						setChosenCard(() => fiCard)
						setOpenLanguageDropDown(false)
						i18n.changeLanguage('fi')
					}}
				>
					{fiCard()}
				</div>
				<hr className='w-[80%] text-slate-400 mx-auto opacity-55 '></hr>

				<div
					className='hover:text-orange-600 hover hover:bg-orange-100 rounded-xl p-2'
					onClick={(e) => {
						e.stopPropagation()
						localStorage.setItem('language', 'vn')
						setChosenCard(() => vnCard)
						setOpenLanguageDropDown(false)
						i18n.changeLanguage('vn')
					}}
				>
					{vnCard()}
				</div>
			</div>
		</div>
	)
}

const vnCard = () => (
	<div className=' flex relative '>
		<p className='ml-1 text-lg'>Vn</p>
		<img
			src={VNFlag}
			width='30'
			height='30'
			style={{ objectFit: 'contain' }}
			className='ml-2'
		/>
	</div>
)
const enCard = () => (
	<div className=' flex relative '>
		<p className='ml-1 text-lg'>En</p>
		<img
			src={EnFlag}
			width='30'
			height='30'
			style={{ objectFit: 'contain' }}
			className='ml-2'
		/>
	</div>
)
const fiCard = () => (
	<div className=' flex relative '>
		<p className='ml-1 text-lg'>Fi</p>
		<img
			src={FiFlag}
			width='30'
			height='30'
			style={{ objectFit: 'contain' }}
			className='ml-2'
		/>
	</div>
)

const getCard = () => {
	const language = localStorage.getItem('language')
	if (!language) return enCard

	if (language === 'en') return enCard
	if (language === 'fi') return fiCard
	if (language === 'vn') return vnCard
	return enCard
}

export { enCard, vnCard, fiCard, getCard }
export default LanguageDropDown


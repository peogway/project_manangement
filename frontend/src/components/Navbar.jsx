import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageDropDown, { getCard } from './LanguageDropDown'
import { useState } from 'react'

const Navbar = ({ user, displayButtons }) => {
	const [chosenCard, setChosenCard] = useState(getCard)
	const [openLanguageDropDown, setOpenLanguageDropDown] = useState(false)
	const Logo = () => {
		const { t, i18n } = useTranslation()
		const navigate = useNavigate()
		const isVietnamese = i18n.language === 'vn'
		return (
			<div className='flex gap-2 items-center'>
				{/* Icon Container */}

				<div onClick={() => navigate('/')} className='flex cursor-pointer'>
					{/* Icon */}
					<TaskAltIcon sx={{ fontSize: 34 }} className='text-orange-500  ' />

					{/* App Name */}
					<div className='flex gap-1 text-[22px] '>
						{isVietnamese ? (
							<>
								<span className='font-bold text-orange-500'>{t('Master')}</span>{' '}
								<span className='text-slate-600'>{t('Project')}</span>
							</>
						) : (
							<>
								<span className='font-bold text-orange-500'>
									{t('Project')}
								</span>{' '}
								<span className='text-slate-600'>{t('Master')}</span>
							</>
						)}
					</div>
				</div>
			</div>
		)
	}

	const Buttons = ({ user }) => {
		const { t, i18n } = useTranslation()
		return (
			<div className='flex gap-2 select-none max-sm:flex-col max-sm:w-full max-sm:mt-8'>
				{!user && (
					<>
						<Link to='/authentication'>
							<button
								className={` hover:opacity-70 max-sm:w-full text-sm border border-orange-500 text-white bg-orange-500 p-[8px] px-6 rounded-md `}
							>
								{t('Sign In')}
							</button>
						</Link>

						<Link to='/authentication' state={{ active: true }}>
							<button
								className={` max-sm:w-full text-sm border border-orange-500 text-orange-500 hover:bg-slate-100 p-[8px] px-6 rounded-md `}
							>
								{t('Sign Up')}
							</button>
						</Link>
					</>
				)}
			</div>
		)
	}
	return (
		<nav className='flex relative m-7 p-2 select-none max-sm:mt-9 mx-8 items-center justify-between max-sm:flex-col  '>
			<Logo />
			{/* Language Dropdown */}
			<div className='absolute top-[50%] translate-y-[-50%] left-[35%]'>
				{/* Display language options */}
				<LanguageDropDown
					openLanguageDropDown={openLanguageDropDown}
					setOpenLanguageDropDown={setOpenLanguageDropDown}
					setChosenCard={setChosenCard}
					chosenCard={chosenCard}
				/>
			</div>
			{displayButtons && <Buttons user={user} />}
		</nav>
	)
}

export default Navbar

import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { useTranslation } from 'react-i18next'
import LanguageDropDown, { getCard } from './LanguageDropDown'

const Heading = ({ name, user }) => {
	const { t, i18n } = useTranslation()
	const [chosenCard, setChosenCard] = useState(getCard)
	const [openLanguageDropDown, setOpenLanguageDropDown] = useState(false)
	const isVietnamese = i18n.language === 'vn'
	const isFinnish = i18n.language === 'fi'
	return (
		/* Heading */
		<div className='min-h-[110px] left-[20px] right-0 box flex flex-row justify-between z-990 bg-white rounded-2xl absolute  '>
			<div className='flex w-full justify-end select-none relative'>
				<div className='absolute top-[50%] translate-y-[-50%] left-15'>
					{isVietnamese && (
						<h1 className='text-3xl text-slate-800 font-bold'>
							<span className='text-orange-600'>{t(name)}</span> {t('my')}
						</h1>
					)}
					{isFinnish && (
						<h1 className='text-3xl text-slate-800 font-bold'>
							<span className='text-orange-600'>{t(`My ${name}`)}</span>
						</h1>
					)}
					{!isVietnamese && !isFinnish && (
						<h1 className='text-3xl text-slate-800 font-bold'>
							My <span className='text-orange-600'>{name}</span>
						</h1>
					)}
				</div>

				{/* Display language options */}
				<div className='mt-10'>
					<LanguageDropDown
						openLanguageDropDown={openLanguageDropDown}
						setOpenLanguageDropDown={setOpenLanguageDropDown}
						setChosenCard={setChosenCard}
						chosenCard={chosenCard}
					/>
				</div>

				{/* Avartar */}
				<div className='absolute right-[86px] top-[50%] translate-y-[-50%]'>
					<Avatar user={user} />
				</div>
			</div>
		</div>
	)
}

export default Heading

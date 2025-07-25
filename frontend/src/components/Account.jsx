import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { rmUserFn } from '../reducers/userReducer'
import Heading from './Heading'
import pwPng from '../assets/password.png'
import visiblePng from '../assets/visible.png'
import invisiblePng from '../assets/invisible.png'
import { setError, setNotification } from '../reducers/notiReducer'
import { isTokenExpired, getToken } from '../services/login'
import { changePassword } from '../services/profile'
import { useTranslation } from 'react-i18next'

const Account = ({ user }) => {
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()
	const [oldPw, setOldPw] = useState('')
	const [newPw, setNewPw] = useState('')
	const [retypeNewPw, setRetypeNewPw] = useState('')

	const [isEditting, setIsEditting] = useState(false)
	const [isVisible, setIsVisible] = useState(false)

	const isMatch = retypeNewPw === newPw
	const onCancel = () => {
		setIsEditting(false)
		setOldPw('')
		setNewPw('')
		setRetypeNewPw('')
		setIsVisible(false)
	}

	const handleChangePassword = async () => {
		if (isTokenExpired(getToken())) {
			dispatch(rmUserFn())
			return
		}
		if (oldPw.length === 0 || newPw.length === 0 || retypeNewPw.length === 0) {
			dispatch(setError(`${t('Fields must not be empty.')}`, 2))
			return
		}
		if (newPw.length < 3) {
			dispatch(setError(`${t('New password length must be at least 3.')}`, 2))
			return
		}
		if (!isMatch) {
			dispatch(setError(`${t('Password confirmation does not match.')}`, 2))
			return
		}
		if (oldPw.length < 3) {
			dispatch(setError(`${t('Old password does not match.')}`, 2))

			return
		}

		const res = await changePassword({ oldPassword: oldPw, newPassword: newPw })

		if (res && res.error === 'Incorect old password') {
			dispatch(setError(`${t('Incorect old password.')}`, 2))
			return
		}

		try {
			dispatch(setNotification(`${t('Password updated successfully.')}`, 2))
			onCancel()
		} catch (error) {
			dispatch(setError(`${t('Failed to update password.')}`, 2))
		}
	}
	return (
		<div className='z-999 flex flex-col items-center h-screen flex-1 overflow-auto left-[60px] max-w-[calc(100vw-60px)]  relative'>
			<Heading name='Account' user={user} />
			<div className='relative  w-[700px]  top-[170px]'>
				<div className='absolute h-[380px] bg-white top-0 w-full rounded-t-[10%] rounded-b-4xl flex items-center'>
					<div
						className={`absolute top-5 right-5 ${
							isEditting ? '' : 'hover:opacity-70'
						}`}
						onClick={() => setIsEditting(true)}
					>
						<img src={pwPng} />
					</div>

					{isEditting ? (
						<div className='flex flex-col items-center justify-center w-full  gap-7 self-start mt-24'>
							{/* visibility button */}
							<div
								className='absolute top-7 right-30 hover:opacity-60'
								onClick={() => setIsVisible((prev) => !prev)}
							>
								<img src={isVisible ? visiblePng : invisiblePng} />
							</div>

							<div className='flex  relative w-full items-center justify-center text-center'>
								<label className='font-bold w-[50%] text-end  text-xl text-slate-700'>
									<p className='mr-20'>{t('Current password')}</p>
								</label>
								<div className='flex flex-1'>
									<div
										className={`${
											oldPw.length === 0
												? 'border-2 border-red-600'
												: 'border border-slate-300'
										} flex  text-lg text-slate-600 rounded-xl p-2 relative`}
									>
										{oldPw.length === 0 && (
											<div className='absolute bottom-full left-0 text-red-700 text-sm'>
												{t('Can not be empty')}
											</div>
										)}
										<input
											className='px-2 focus:outline-none'
											onKeyDown={(e) => {
												if (e.key === 'Enter') handleChangePassword()
											}}
											type={isVisible ? 'text' : 'password'}
											value={oldPw}
											onChange={(e) => setOldPw(e.target.value)}
											placeholder={t('Enter old password')}
										/>
									</div>
								</div>
							</div>

							<div className='flex  relative w-full items-center justify-center text-center relative'>
								<label className='font-bold w-[50%] text-end  text-xl text-slate-700'>
									<p className='mr-20'>{t('New password')}</p>
								</label>
								<div className='flex flex-1'>
									<div
										className={`${
											newPw.length < 3
												? 'border-2 border-red-600'
												: 'border border-slate-300'
										} flex  text-lg text-slate-600 rounded-xl p-2 relative`}
									>
										{newPw.length < 3 && (
											<div className='absolute bottom-full left-0 text-red-700 text-sm'>
												{t('Minium length of 3')}
											</div>
										)}
										<input
											className='px-2 focus:outline-none'
											onKeyDown={(e) => {
												if (e.key === 'Enter') handleChangePassword()
											}}
											type={isVisible ? 'text' : 'password'}
											value={newPw}
											onChange={(e) => setNewPw(e.target.value)}
											placeholder={t('Enter new password')}
										/>
									</div>
								</div>
							</div>

							<div className='flex  relative w-full items-center justify-center text-center relative'>
								<label className='font-bold w-[50%] text-end  text-xl text-slate-700 '>
									<p className='mr-20'>{t('Re-type new password')}</p>
								</label>
								<div className='flex flex-1'>
									<div
										className={`${
											!isMatch
												? 'border-2 border-red-600'
												: 'border border-slate-300'
										} flex  text-lg text-slate-600 rounded-xl p-2 relative`}
									>
										{!isMatch && (
											<div className='absolute bottom-full left-0 text-red-700 text-sm'>
												{t('Does not match new password')}
											</div>
										)}
										<input
											className='px-2 focus:outline-none'
											type={isVisible ? 'text' : 'password'}
											onKeyDown={(e) => {
												if (e.key === 'Enter') handleChangePassword()
											}}
											value={retypeNewPw}
											onChange={(e) => setRetypeNewPw(e.target.value)}
											placeholder={t('Re-type new password')}
										/>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className='flex  relative w-full items-center justify-center text-center overflow-hidden'>
							<label className='font-bold w-[50%] text-end  text-xl text-slate-700'>
								<p className='mr-20'>{t('Password')}</p>
							</label>
							<div className='text-lg flex-1 flex ml-20 text-slate-600'>
								●●●●●●●●
							</div>
						</div>
					)}

					{/* Buttons */}
					{isEditting && (
						<div className='flex w-full items-center absolute bottom-0 right-[50%] translate-x-[50%] justify-center select-none mb-5'>
							<div
								className='text-white w-16 text-center bg-orange-500 mr-4 p-2 rounded-xl semi-bold'
								onClick={handleChangePassword}
							>
								{t('Save')}
							</div>
							<div
								className='text-slate-800 w-16 text-center bg-slate-300 rounded-xl p-2 semi-bold'
								onClick={onCancel}
							>
								{t('Cancel')}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Account

import { useDispatch } from 'react-redux'
import { setError } from '../reducers/notiReducer'
import { setUserFn } from '../reducers/userReducer'
import loginService, { setToken } from '../services/login'
import registerService from '../services/register'
import { useField } from '../hooks/hook'
import { useState, useEffect } from 'react'
import '../styles/authen.css'

import { useLocation, useNavigate } from 'react-router-dom'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { useTranslation } from 'react-i18next'
import LanguageDropDown, { getCard } from './LanguageDropDown'

const Authentication = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const [active, setActive] = useState(location.state?.active || false)
	const [isVisible, setIsVisible] = useState(false)
	const [isHover, setIsHover] = useState(false)
	const { t, i18n } = useTranslation()
	const [chosenCard, setChosenCard] = useState(getCard)
	const [openLanguageDropDown, setOpenLanguageDropDown] = useState(false)
	useEffect(() => {
		document.title = active ? 'Registration' : 'Login'
	}, [active])
	const { remove: rmUsername, ...username } = useField('text')
	// const { remove: rmPassword, ...password } = useField('password')
	const [password, setPassword] = useState('')

	const { remove: rmUsernameRegis, ...usernameRegis } = useField('text')
	const { remove: rmEmail, ...email } = useField('email')

	const [passwordRegis, setPasswordRegis] = useState('')
	const [cfPasswordRegis, setCfPasswordRegis] = useState('')

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username: username.value,
				password: password,
			})

			window.localStorage.setItem('loggedPrjMnUser', JSON.stringify(user))
			setToken(user.token)
			dispatch(setUserFn(user))
			dispatch(('Login successfully', 2))
			rmUsername()
			setPassword('')
			navigate('/dashboard')
		} catch (exception) {
			dispatch(setError(`${t('Wrong Credentials')}`, 2))
		}
	}

	const handleRegister = async (event) => {
		event.preventDefault()

		try {
			if (passwordRegis !== cfPasswordRegis) {
				dispatch(setError(`${t('Password does not match')}`, 2))
				return
			}

			const user = await registerService.register({
				username: usernameRegis.value,
				email: email.value,
				password: passwordRegis,
			})

			dispatch(setNotification(`${t('Register successfully')}`, 2))
			rmEmail()
			rmUsernameRegis()
			setPasswordRegis('')
			setCfPasswordRegis('')
			setActive(false)
		} catch (err) {
			// Handle error
			if (err.response.data.error) {
				dispatch(setError(err.response.data.error, 2))
				return
			}

			dispatch(setError(`${t('Something went wrong')}`, 2))
		}
	}

	return (
		<div className='body relative'>
			<div
				className='absolute top-5 text-slate-500 left-2 scale-110'
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
			>
				<ArrowBackIcon
					className={`${
						isHover
							? 'text-orange-500 transition-all duration-200 ease-out box'
							: 'text-slate-500 hover:text-orange-500'
					} cursor-pointer scale-110`}
					onClick={() => {
						navigate('/')
					}}
					fontSize='large'
				/>
				{isHover && (
					<div className='absolute top-full left-2 translate-y-2 min-w-30 w-auto text-center bg-slate-200 text-slate-600 rounded-lg'>
						{t('Back to Home')}
					</div>
				)}
			</div>
			<div className={`container  ${active ? 'active' : ''}`}>
				<div className='form-box login'>
					<form onSubmit={handleLogin}>
						<h1 className='font-bold'>{t('Login')}</h1>
						<div className='input-box'>
							<input {...username} placeholder={t('Username')} />
							<i className='bx bxs-user'></i>
						</div>
						<div className='input-box'>
							<input
								value={password}
								type={isVisible ? 'text' : 'password'}
								onChange={(e) => setPassword(e.target.value)}
								placeholder={t('Password')}
								className='pr-20! self-start!'
							/>
							<i className='bx bxs-lock-alt relative'>
								{isVisible ? (
									<VisibilityIcon
										className='absolute right-full top-1/2 -translate-y-1/2 cursor-pointer -translate-x-[5px] hover:opacity-70 hover:border rounded-lg'
										fontSize='medium'
										onClick={() => setIsVisible(!isVisible)}
									/>
								) : (
									<VisibilityOffIcon
										className='absolute right-full top-1/2 -translate-y-1/2 cursor-pointer -translate-x-[5px] hover:opacity-70 hover:border rounded-lg'
										onClick={() => setIsVisible(!isVisible)}
									/>
								)}
							</i>
						</div>
						<div className='forgot-link '>
							<a href='#' className='hover:text-blue-500!'>
								{t('Forgot Password?')}
							</a>
						</div>
						<button className='btn  hover:opacity-80!' type='submit'>
							{t('Login')}
						</button>
						<p>{t('or login with social platforms')}</p>
						<div className='social-icons'>
							<a
								href='#'
								className='hover:bg-[#eece1a]! hover:text-white! transition-all duration-200 ease-out'
							>
								<i className='bx bxl-google'></i>
							</a>
							<a
								href='#'
								className='hover:bg-[#eece1a]! hover:text-white! transition-all duration-500 ease-out'
							>
								<i className='bx bxl-facebook'></i>
							</a>
							<a
								href='#'
								className='hover:bg-[#eece1a]! hover:text-white! transition-all duration-500 ease-out'
							>
								<i className='bx bxl-github'></i>
							</a>
							<a
								href='#'
								className='hover:bg-[#eece1a]! hover:text-white! transition-all duration-500 ease-out'
							>
								<i className='bx bxl-linkedin'></i>
							</a>
						</div>
					</form>
				</div>

				<div className='form-box register' onSubmit={handleRegister}>
					<form action='#'>
						<h1 className='font-bold translate-y-[10px]!'>
							{t('Registration')}
						</h1>
						<div className='input-box'>
							<input {...usernameRegis} placeholder={t('Username')} required />
							<i className='bx bxs-user'></i>
						</div>
						<div className='input-box'>
							<input placeholder={t('Email')} required {...email} />
							<i className='bx bxs-envelope'></i>
						</div>
						<div className='input-box'>
							<input
								type={isVisible ? 'text' : 'password'}
								value={passwordRegis}
								onChange={(e) => setPasswordRegis(e.target.value)}
								placeholder={t('Password')}
								required
								className='pr-20! self-start!'
							/>
							<i className='bx bxs-lock-alt relative'>
								{isVisible ? (
									<VisibilityIcon
										className='absolute right-full top-1/2 -translate-y-1/2 cursor-pointer -translate-x-[5px] hover:opacity-70 hover:border rounded-lg'
										onClick={() => setIsVisible(!isVisible)}
									/>
								) : (
									<VisibilityOffIcon
										className='absolute right-full top-1/2 -translate-y-1/2 cursor-pointer -translate-x-[5px] hover:opacity-70 hover:border rounded-lg'
										onClick={() => setIsVisible(!isVisible)}
									/>
								)}
							</i>
						</div>
						<div className='input-box'>
							<input
								type={isVisible ? 'text' : 'password'}
								value={cfPasswordRegis}
								onChange={(e) => setCfPasswordRegis(e.target.value)}
								placeholder={t('Re-type password')}
								required
								className='pr-20! self-start!'
							/>
							<i className='bx bxs-lock-alt'></i>
						</div>
						<button type='submit' className='btn hover:opacity-80!'>
							{t('Register')}
						</button>
						<p className='font-normal'>
							{t('or register with social platforms')}
						</p>
						<div className='social-icons'>
							<a
								href='#'
								className='hover:bg-[#eece1a]! hover:text-white! transition-all duration-500 ease-out'
							>
								<i className='bx bxl-google'></i>
							</a>
							<a
								href='#'
								className='hover:bg-[#eece1a]! hover:text-white! transition-all duration-500 ease-out'
							>
								<i className='bx bxl-facebook'></i>
							</a>
							<a
								href='#'
								className='hover:bg-[#eece1a]! hover:text-white! transition-all duration-500 ease-out'
							>
								<i className='bx bxl-github'></i>
							</a>
							<a
								href='#'
								className='hover:bg-[#eece1a]! hover:text-white! transition-all duration-500 ease-out'
							>
								<i className='bx bxl-linkedin'></i>
							</a>
						</div>
					</form>
				</div>

				<div className='toggle-box'>
					<div className='toggle-panel toggle-left'>
						<h1 className='font-bold'>{t('Hello, Welcome!')}</h1>
						<p>{t("Don't have an account?")}</p>
						<button
							className='btn register-btn hover:opacity-80!'
							onClick={() => {
								setActive(true)
								setIsVisible(false)
							}}
						>
							{t('Register')}
						</button>
					</div>

					<div className='toggle-panel toggle-right'>
						<h1 className='font-bold'>{t('Welcome Back!')}</h1>
						<p className='font-normal'>{t('Already have an account?')}</p>
						<button
							className='btn login-btn hover:opacity-80!'
							onClick={() => {
								setActive(false)
								setIsVisible(false)
							}}
						>
							{t('Login')}
						</button>
					</div>
				</div>
			</div>
			<div className='absolute top-5 left-0 '>
				{/* Display language options */}
				<LanguageDropDown
					openLanguageDropDown={openLanguageDropDown}
					setOpenLanguageDropDown={setOpenLanguageDropDown}
					setChosenCard={setChosenCard}
					chosenCard={chosenCard}
				/>
			</div>
		</div>
	)
}

export default Authentication

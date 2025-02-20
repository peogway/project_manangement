import { useDispatch } from 'react-redux'
import { setError, setNotification } from '../reducers/notiReducer'
import { setUserFn } from '../reducers/userReducer'
import loginService, { setToken } from '../services/login'
import { useField } from '../hooks/hook'
import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	useEffect(() => {
		document.title = 'Sign In'
	}, [])
	const { remove: rmUsername, ...username } = useField('text')
	const { remove: rmPassword, ...password } = useField('password')

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username: username.value,
				password: password.value,
			})

			window.localStorage.setItem('loggedPrjMnUser', JSON.stringify(user))
			setToken(user.token)
			dispatch(setUserFn(user))
			dispatch(setNotification('Login successfully', 5))
			rmUsername()
			rmPassword()
			navigate('/dashboard')
		} catch (exception) {
			dispatch(setError('Wrong Credentials', 5))
		}
	}
	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div className='username'>
					<label>Username: </label>
					<input {...username} placeholder='Enter username' />
				</div>
				<div className='password'>
					<label>Password: </label>
					<input {...password} placeholder='Enter password' />
				</div>
				<button className='btn submitBtn' type='submit'>
					Sign in
				</button>
			</form>
			<p onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>
				Create New Account
			</p>
		</div>
	)
}

export default LoginForm


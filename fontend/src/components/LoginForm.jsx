import { useDispatch } from 'react-redux'
import { setError, setNotification } from '../reducers/notiReducer'
import { setUserFn } from '../reducers/userReducer'
import loginService from '../services/login'
import { useField } from '../hooks/hook'
import RegisterForm from './RegisterFrom'
import { useState } from 'react'

const LoginForm = () => {
	const dispatch = useDispatch()
	const [status, setStatus] = useState('login')

	const { remove: rmUsername, ...username } = useField('text')
	const { remove: rmPassword, ...password } = useField('password')

	const handleLogin = async (event) => {
		event.preventDefault()

		try {
			const user = await loginService.login({
				username: username.value,
				password: password.value,
			})

			window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

			dispatch(setUserFn(user))
			dispatch(setNotification('Login successfully', 5))
			rmUsername()
			rmPassword()
		} catch (exception) {
			dispatch(setError('Wrong Credentials', 5))
		}
	}
	if (status === 'register') return <RegisterForm />
	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div className='username'>
					<label>Username: </label>
					<input {...username} />
				</div>
				<div className='password'>
					<label>Password: </label>
					<input {...password} />
				</div>
				<button className='btn submitBtn' type='submit'>
					Login
				</button>
			</form>
			<p onClick={() => setStatus('register')} style={{ cursor: 'pointer' }}>
				Create New Account
			</p>
		</div>
	)
}

export default LoginForm


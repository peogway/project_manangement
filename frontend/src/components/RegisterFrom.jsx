import { useDispatch } from 'react-redux'
import { setError, setNotification } from '../reducers/notiReducer'
import registerService from '../services/register'
import { useField } from '../hooks/hook'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const RegisterForm = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { remove: rmName, ...name } = useField('text')
	const { remove: rmUsername, ...username } = useField('text')
	const { remove: rmPassword, ...password } = useField('password')
	const { remove: rmCfPassword, ...cfPassword } = useField('password')
	useEffect(() => {
		document.title = 'Registration'
	}, [])
	const handleRegister = async (event) => {
		event.preventDefault()

		try {
			if (password.value !== cfPassword.value)
				throw new Error('Confirmation password must match')
			const user = await registerService.register({
				name: name.value,
				username: username.value,
				password: password.value,
			})

			dispatch(setNotification('Register successfully', 5))
			rmName()
			rmUsername()
			rmPassword()
			rmCfPassword()
			navigate('/login')
		} catch (exception) {
			rmPassword()
			rmCfPassword()
			dispatch(setError('Something went wrong', 5))
		}
	}
	return (
		<div>
			<h2>Registration</h2>
			<form onSubmit={handleRegister}>
				<div className='name'>
					<label>Name: </label>
					<input {...name} />
				</div>
				<div className='username'>
					<label>Username: </label>
					<input {...username} placeholder='Enter username' />
				</div>
				<div className='password'>
					<label>Password: </label>
					<input {...password} placeholder='Enter password' />
				</div>
				<div className='password'>
					<label>Confirm Password: </label>
					<input {...cfPassword} />
				</div>

				<button className='btn submitBtn' type='submit'>
					Sign up
				</button>
			</form>
			<p onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
				I already had an account
			</p>
		</div>
	)
}

export default RegisterForm


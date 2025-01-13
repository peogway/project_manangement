import { useState, useEffect } from 'react'
import Notification from './components/Notification'

import LoginForm from './components/LoginForm'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification, setError } from './reducers/notiReducer'
import { setUserFn, rmUserFn } from './reducers/userReducer'

const App = () => {
	const dispatch = useDispatch()
	const notification = useSelector((state) => state.notiReducer)
	const user = useSelector((state) => state.user)

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedPrjMnUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			dispatch(setUserFn(user))
		}
	}, [])

	const loginForm = () => (
		<div>
			<LoginForm />
		</div>
	)
	const handleLogout = () => {
		window.localStorage.removeItem('loggedPrjMnUser')
		dispatch(rmUserFn())
	}

	return (
		<div>
			<Notification message={notification.error} className='error' />

			<Notification message={notification.noti} className='notification' />
			<h1>Project Management</h1>

			{user === null ? (
				loginForm()
			) : (
				<div>
					<button onClick={handleLogout}>Sign out</button>
				</div>
			)}
		</div>
	)
}

export default App


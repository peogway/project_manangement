import { useState } from 'react'
import Notification from './components/Notification'

import LoginForm from './components/LoginForm'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification, setError } from './reducers/notiReducer'
import { setUserFn, rmUserFn } from './reducers/userReducer'

const App = () => {
	const dispatch = useDispatch()
	const notification = useSelector((state) => state.notiReducer)
	const user = useSelector((state) => state.user)
	const loginForm = () => (
		<div>
			<LoginForm />
		</div>
	)
	const handleLogout = () => {
		window.localStorage.removeItem('loggedBlogAppUser')
		dispatch(rmUserFn())
	}
	return (
		<div>
			<Notification message={notification.error} className='error' />

			<Notification message={notification.noti} className='notification' />
			<h1>Project Management</h1>

			{user === null ? loginForm() : <div>logined</div>}
		</div>
	)
}

export default App


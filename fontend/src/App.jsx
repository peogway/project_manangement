import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Dashboard from './components/Dashboard'
import Project from './components/Project'
import Category from './components/Category'
import LoginForm from './components/LoginForm'
import Home from './components/Home'

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification, setError } from './reducers/notiReducer'
import { setUserFn, rmUserFn } from './reducers/userReducer'
import RegisterForm from './components/RegisterFrom'

const App = () => {
	const dispatch = useDispatch()
	const notification = useSelector((state) => state.notiReducer)
	const user = useSelector((state) => state.user)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedPrjMnUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			dispatch(setUserFn(user))
		}
		setLoading(false)
	}, [dispatch])

	const handleLogout = () => {
		window.localStorage.removeItem('loggedPrjMnUser')
		dispatch(rmUserFn())
	}
	if (loading) return <div>Loading...</div>

	return (
		<div>
			<Notification message={notification.error} className='error' />

			<Notification message={notification.noti} className='notification' />
			<h1>Project Management</h1>

			<Router>
				<div>
					<Link style={{ padding: 5 }} to='/'>
						Home
					</Link>

					{user === null ? (
						<div>
							<Link style={{ padding: 5 }} to='/login'>
								Sign in
							</Link>
							<Link style={{ padding: 5 }} to='/register'>
								Sign up
							</Link>
						</div>
					) : (
						<div>
							<Link style={{ padding: 5 }} to='/dashboard'>
								Dashboard
							</Link>
							<Link style={{ padding: 5 }} to='projects'>
								Project
							</Link>
							<Link style={{ padding: 5 }} to='categories'>
								Category
							</Link>
							<div>
								<button onClick={handleLogout}>Sign out</button>
							</div>
						</div>
					)}
				</div>

				<Routes>
					<Route path='/login' element={<LoginForm />} />
					<Route path='/register' element={<RegisterForm />} />
					<Route
						path='/'
						element={user ? <Navigate replace to='/dashboard' /> : <Home />}
					/>
					<Route
						path='/dashboard'
						element={user ? <Dashboard /> : <Navigate replace to='/login' />}
					/>

					<Route
						path='/projects'
						element={user ? <Project /> : <Navigate replace to='/login' />}
					/>
					<Route
						path='/categories'
						element={user ? <Category /> : <Navigate replace to='/login' />}
					/>
				</Routes>
			</Router>
		</div>
	)
}

export default App


import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Categories from './components/Categories'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import RegisterForm from './components/RegisterFrom'

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
	useNavigate,
} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification, setError } from './reducers/notiReducer'
import { setUserFn, rmUserFn } from './reducers/userReducer'

const App = () => {
	const dispatch = useDispatch()
	const notification = useSelector((state) => state.notiReducer) // Notification state from Redux
	const user = useSelector((state) => state.user) // User state from Redux
	const [loading, setLoading] = useState(true) // Loading state for initial app load
	const navigate = useNavigate()

	useEffect(() => {
		// Check for logged-in user in localStorage on initial load
		const loggedUserJSON = window.localStorage.getItem('loggedPrjMnUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON) // Parse user data
			dispatch(setUserFn(user)) // Dispatch user data to Redux
		}
		setLoading(false) // Mark loading as complete
	}, [dispatch])

	const handleLogout = () => {
		// Logout logic
		window.localStorage.removeItem('loggedPrjMnUser') // Remove user from localStorage
		dispatch(rmUserFn()) // Dispatch action to remove user from Redux
		navigate('/')
	}

	// Display loading spinner or message until initial load completes
	if (loading) return <div>Loading...</div>

	return (
		<div>
			{/* Display notifications */}
			<Notification message={notification.error} className='error' />
			<Notification message={notification.noti} className='notification' />
			<h1>Project Management</h1>

			<div>
				<nav>
					{/* Navigation links */}
					<Link style={{ padding: 5 }} to='/'>
						Home
					</Link>

					{user === null ? ( // Show different links based on authentication state
						<div>
							<nav>
								<Link style={{ padding: 5 }} to='/login'>
									Sign in
								</Link>
								<Link style={{ padding: 5 }} to='/register'>
									Sign up
								</Link>
							</nav>
						</div>
					) : (
						<div>
							<nav>
								<Link style={{ padding: 5 }} to='/dashboard'>
									Dashboard
								</Link>
								<Link style={{ padding: 5 }} to='/tasks'>
									Tasks
								</Link>
								<Link style={{ padding: 5 }} to='/categories'>
									Categories
								</Link>
								<div>
									{/* Logout button */}
									<button onClick={handleLogout}>Sign out</button>
								</div>
							</nav>
						</div>
					)}
				</nav>
			</div>

			{/* Define routes */}
			<Routes>
				{/* Public routes */}
				<Route path='/login' element={<LoginForm />} />
				<Route path='/register' element={<RegisterForm />} />
				<Route
					path='/'
					element={user ? <Navigate replace to='/dashboard' /> : <Home />}
				/>

				{/* Private routes, redirect to login if not authenticated */}
				<Route
					path='/dashboard'
					element={user ? <Dashboard /> : <Navigate replace to='/' />}
				/>
				<Route
					path='/tasks'
					element={user ? <Tasks /> : <Navigate replace to='/' />}
				/>
				<Route
					path='/categories'
					element={user ? <Categories /> : <Navigate replace to='/' />}
				/>
			</Routes>
		</div>
	)
}

export default App


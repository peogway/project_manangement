import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Projects from './components/Projects'
import Categories from './components/Categories'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import RegisterForm from './components/RegisterFrom'
import { setToken } from './services/login'
import LogoutIcon from '@mui/icons-material/Logout'
import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CategoryIcon from '@mui/icons-material/Category'
import StorageIcon from '@mui/icons-material/Storage'
import LayersIcon from '@mui/icons-material/Layers'

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
			setToken(user.token)
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
		<div className='flex w-full h-screen poppins'>
			{/* <Link style={{ padding: 5 }} to='/'>
						<HomeIcon></HomeIcon>
					</Link> */}

			{/* Sidebar and Navigation Links */}
			{/* Soft Layer */}

			{user && (
				<div className='w-full h-full z-50 bg-slate-800 fixed opacity-30'></div>
			)}
			{user && (
				<nav className='w-[97px] max-[940px]:hidden h-screen py-10 bg-white flex flex-col items-center justify-between z-[60] transition-all'>
					<Link style={{ padding: 5 }} to='/dashboard'>
						<DashboardIcon></DashboardIcon>Dashboard
					</Link>
					<Link style={{ padding: 5 }} to='/projects'>
						<StorageIcon></StorageIcon>
						Projects
					</Link>
					<Link style={{ padding: 5 }} to='/tasks'>
						<LayersIcon></LayersIcon>
						Tasks
					</Link>
					<Link style={{ padding: 5 }} to='/categories'>
						<CategoryIcon></CategoryIcon>Categories
					</Link>

					{/* Logout button */}
					<div onClick={handleLogout}>
						<LogoutIcon></LogoutIcon>
					</div>
				</nav>
			)}

			{/* Display notifications */}
			<Notification message={notification.error} className='error' />
			<Notification message={notification.noti} className='notification' />

			{/* Define routes */}
			<Routes>
				{/* Public routes */}
				<Route path='/login' element={<LoginForm />} />
				<Route path='/register' element={<RegisterForm />} />
				<Route
					path='/'
					element={
						user ? <Navigate replace to='/dashboard' /> : <Home user={user} />
					}
				/>

				{/* Private routes (only for logged-in users) */}
				{user && (
					<>
						<Route
							path='/dashboard'
							element={user ? <Dashboard /> : <Navigate replace to='/login' />}
						/>
						<Route
							path='/projects'
							element={user ? <Projects /> : <Navigate replace to='/login' />}
						/>
						<Route
							path='/tasks'
							element={user ? <Tasks /> : <Navigate replace to='/login' />}
						/>
						<Route
							path='/categories'
							element={user ? <Categories /> : <Navigate replace to='/login' />}
						/>
					</>
				)}
			</Routes>
		</div>
	)
}

export default App


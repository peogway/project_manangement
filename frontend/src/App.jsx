import { useState, useEffect, cloneElement } from 'react'
import Notification from './components/Notification'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Projects from './components/Projects'
import Categories from './components/Categories'
import Authentication from './components/Authentication'
import Home from './components/Home'
import Profile from './components/Profile'
import Account from './components/Account'
import { setToken } from './services/login'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CategoryIcon from '@mui/icons-material/Category'
import StorageIcon from '@mui/icons-material/Storage'
import LayersIcon from '@mui/icons-material/Layers'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { isTokenExpired } from './services/login'
import { useTranslation } from 'react-i18next'

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
	useNavigate,
	useLocation,
} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { clearMessages } from './reducers/notiReducer'
import { setUserFn, rmUserFn } from './reducers/userReducer'
import Navbar from './components/Navbar'

const AnimatedRoute = ({ element }) => {
	const hasVisited = window.localStorage.getItem('visitedDashboard')

	if (!hasVisited) window.localStorage.setItem('visitedDashboard', true)
	return cloneElement(element, { animate: hasVisited ? false : true })
}

const App = () => {
	const { t, i18n } = useTranslation()
	const dispatch = useDispatch()
	const location = useLocation()
	const notification = useSelector((state) => state.notiReducer) // Notification state from Redux
	const user = useSelector((state) => state.user) // User state from Redux
	const [loading, setLoading] = useState(true) // Loading state for initial app load
	const navigate = useNavigate()
	const [isHovered, setIsHovered] = useState(null)

	useEffect(() => window.localStorage.removeItem('visitedDashboard'), [])
	useEffect(() => {
		// Check for logged-in user in localStorage on initial load
		const loggedUserJSON = window.localStorage.getItem('loggedPrjMnUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON) // Parse user data
			if (isTokenExpired(user.token)) {
				window.localStorage.removeItem('loggedPrjMnUser')
				dispatch(rmUserFn())
			} else {
				dispatch(setUserFn(user)) // Dispatch user data to Redux
				setToken(user.token)
			}
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
		<div className='flex w-[100%] h-[100%] poppins justify-start items-center relative'>
			{/* <Link style={{ padding: 5 }} to='/'>
						<HomeIcon></HomeIcon>
					</Link> */}

			{/* Soft Layer */}
			{user && location.pathname !== '/authentication' && (
				<div className='w-full h-full z-50 bg-slate-300 fixed opacity-30'></div>
			)}

			{/* Sidebar and Navigation Links */}
			{user && location.pathname !== '/authentication' && (
				<nav className='navbar w-[60px] fixed max-[940px]:hidden h-screen py-10 pl-1 bg-white flex flex-col items-start justify-between z-[1000] transition-all rounded-xl select-none'>
					<div
						className='  flex items-center gap-2 justify-center'
						onClick={() => {
							navigate('/')
						}}
					>
						<TaskAltIcon
							className='text-orange-500 font-bold'
							sx={{ fontSize: '41px' }}
						/>
					</div>
					<Link
						style={{ padding: 5 }}
						to='/dashboard'
						className={`${
							location.pathname === '/dashboard'
								? 'text-orange-500'
								: 'text-slate-500'
						} relative`}
						onMouseEnter={() => setIsHovered('Dashboard')}
						onMouseLeave={() => setIsHovered(null)}
					>
						<DashboardIcon />
						{isHovered === 'Dashboard' && (
							<span
								className={`ml-1 absolute  rounded-xl p-2 top-0 text-select-none ${
									location.pathname === '/dashboard'
										? 'bg-orange-500 text-white'
										: 'bg-slate-200 text-slate-600'
								} box`}
							>
								{t(isHovered)}
							</span>
						)}
					</Link>
					<Link
						style={{ padding: 5 }}
						to='/projects'
						className={`${
							location.pathname === '/projects'
								? 'text-orange-500'
								: 'text-slate-500'
						} relative`}
						onMouseEnter={() => setIsHovered('Projects')}
						onMouseLeave={() => setIsHovered(null)}
					>
						<StorageIcon />
						{isHovered === 'Projects' && (
							<span
								className={`ml-1 absolute  rounded-xl p-2 top-0 text-select-none ${
									location.pathname === '/projects'
										? 'bg-orange-500 text-white'
										: 'bg-slate-200 text-slate-600'
								} box`}
							>
								{t(isHovered)}
							</span>
						)}
					</Link>
					<Link
						style={{ padding: 5 }}
						to='/tasks'
						className={`${
							location.pathname === '/tasks'
								? 'text-orange-500'
								: 'text-slate-500'
						} relative`}
						onMouseEnter={() => setIsHovered('Tasks')}
						onMouseLeave={() => setIsHovered(null)}
					>
						<LayersIcon />
						{isHovered === 'Tasks' && (
							<span
								className={`ml-1 absolute  rounded-xl p-2 top-0 text-select-none ${
									location.pathname === '/tasks'
										? 'bg-orange-500 text-white'
										: 'bg-slate-200 text-slate-600'
								} box`}
							>
								{t(isHovered)}
							</span>
						)}
					</Link>
					<Link
						style={{ padding: 5 }}
						to='/categories'
						className={`${
							location.pathname === '/categories'
								? 'text-orange-500'
								: 'text-slate-500'
						} relative`}
						onMouseEnter={() => setIsHovered('Categories')}
						onMouseLeave={() => setIsHovered(null)}
					>
						<CategoryIcon />
						{isHovered === 'Categories' && (
							<span
								className={`ml-1 absolute  rounded-xl p-2 top-0 text-select-none ${
									location.pathname === '/categories'
										? 'bg-orange-500 text-white'
										: 'bg-slate-200 text-slate-600'
								} box`}
							>
								{t(isHovered)}
							</span>
						)}
					</Link>

					{/* Logout button */}
					<div
						onClick={handleLogout}
						onMouseEnter={() => setIsHovered('Sign Out')}
						onMouseLeave={() => setIsHovered(null)}
						className='relative hover:text-orange-500'
					>
						<LogoutIcon />
						{isHovered === 'Sign Out' && (
							<span
								className={`ml-1 absolute  rounded-xl p-2 top-[-5px] bg-orange-500 text-white whitespace-nowrap text-select-none `}
							>
								{t(isHovered)}
							</span>
						)}
					</div>
				</nav>
			)}

			{/* Display notifications */}
			<Notification
				message={notification.error}
				className='error'
				removeMessage={() => dispatch(clearMessages())}
			/>
			<Notification
				message={notification.noti}
				className='notification'
				removeMessage={() => dispatch(clearMessages())}
			/>

			{/* Define routes */}
			<Routes>
				{/* Public routes */}
				<Route path='/authentication' element={<Authentication />} />
				<Route
					path='/'
					element={
						user ? <Navigate replace to='/dashboard' /> : <Home user={user} />
					}
				/>

				{/* Private routes (only for logged-in users) */}
				<Route
					path='/dashboard'
					element={
						user ? (
							<AnimatedRoute element={<Dashboard user={user} />} />
						) : (
							<Navigate replace to='/authentication' />
						)
					}
				/>
				<Route
					path='/projects'
					element={
						user ? (
							<Projects user={user} />
						) : (
							<Navigate replace to='/authentication' />
						)
					}
				/>
				<Route
					path='/tasks'
					element={
						user ? (
							<Tasks user={user} />
						) : (
							<Navigate replace to='/authentication' />
						)
					}
				/>
				<Route
					path='/categories'
					element={
						user ? (
							<Categories user={user} />
						) : (
							<Navigate replace to='/authentication' />
						)
					}
				/>
				<Route
					path='/profile'
					element={
						user ? (
							<Profile user={user} />
						) : (
							<Navigate replace to='/authentication' />
						)
					}
				/>
				<Route
					path='/account'
					element={
						user ? (
							<Account user={user} />
						) : (
							<Navigate replace to='/authentication' />
						)
					}
				/>
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
		</div>
	)
}

export default App

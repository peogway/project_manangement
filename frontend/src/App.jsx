import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Projects from './components/Projects'
import Categories from './components/Categories'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import RegisterForm from './components/RegisterForm'
import { setToken } from './services/login'
import LogoutIcon from '@mui/icons-material/Logout'
import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CategoryIcon from '@mui/icons-material/Category'
import StorageIcon from '@mui/icons-material/Storage'
import LayersIcon from '@mui/icons-material/Layers'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { isTokenExpired } from './services/login'

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
import { setNotification, setError } from './reducers/notiReducer'
import { setUserFn, rmUserFn } from './reducers/userReducer'
import Navbar from './components/Navbar'

const App = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const notification = useSelector((state) => state.notiReducer) // Notification state from Redux
	const user = useSelector((state) => state.user) // User state from Redux
	const [loading, setLoading] = useState(true) // Loading state for initial app load
	const navigate = useNavigate()
	const [isHovered, setIsHovered] = useState(null)

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
			{user && (
				<div className='w-full h-full z-50 bg-slate-100 fixed opacity-30'></div>
			)}

			{/* Sidebar and Navigation Links */}
			{user && (
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
								}`}
							>
								{isHovered}
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
								} `}
							>
								{isHovered}
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
								} `}
							>
								{isHovered}
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
								} `}
							>
								{isHovered}
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
								{isHovered}
							</span>
						)}
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
			</Routes>
		</div>
	)
}

export default App

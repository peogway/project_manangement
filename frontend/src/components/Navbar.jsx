import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ user, displayButtons }) => {
	const Logo = () => {
		const navigate = useNavigate()
		return (
			<div className='flex gap-2 items-center'>
				{/* Icon Container */}

				<div onClick={() => navigate('/')} className='flex cursor-pointer'>
					{/* Icon */}
					<TaskAltIcon sx={{ fontSize: 34 }} className='text-orange-500  ' />

					{/* App Name */}
					<div className='flex gap-1 text-[22px] '>
						<span className={`font-bold text-orange-500`}>Project</span>
						<span className='text-slate-600'>Master</span>
					</div>
				</div>
			</div>
		)
	}

	const Buttons = ({ user }) => {
		return (
			<div className='flex gap-2 select-none max-sm:flex-col max-sm:w-full max-sm:mt-8'>
				{!user && (
					<>
						<Link to='/authentication'>
							<button
								className={` hover:opacity-70 max-sm:w-full text-sm border border-orange-500 text-white bg-orange-500 p-[8px] px-6 rounded-md `}
							>
								Sign In
							</button>
						</Link>

						<Link to='/authentication' state={{ active: true }}>
							<button
								className={` max-sm:w-full text-sm border border-orange-500 text-orange-500 hover:bg-slate-100 p-[8px] px-6 rounded-md `}
							>
								Sign Up
							</button>
						</Link>
					</>
				)}
			</div>
		)
	}
	return (
		<nav className='flex m-7 p-2 select-none max-sm:mt-9 mx-8 items-center justify-between max-sm:flex-col  '>
			<Logo />
			{displayButtons && <Buttons user={user} />}
		</nav>
	)
}

export default Navbar


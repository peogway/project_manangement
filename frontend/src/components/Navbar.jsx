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
					<TaskAltIcon sx={{ fontSize: 34 }} className='text-orange-600  ' />

					{/* App Name */}
					<div className='flex gap-1 text-[22px] '>
						<span className={`font-bold text-orange-600`}>Project</span>
						<span className='text-slate-600'>Master</span>
					</div>
				</div>
			</div>
		)
	}

	const Buttons = ({ user }) => {
		return (
			<div className='flex gap-2 max-sm:flex-col max-sm:w-full max-sm:mt-8'>
				{!user && (
					<>
						<Link to='/login'>
							<button
								className={` max-sm:w-full text-sm border border-orange-600 text-white bg-orange-600 p-[8px] px-6 rounded-md `}
							>
								Sign In
							</button>
						</Link>

						<Link to='/register'>
							<button
								className={` max-sm:w-full text-sm border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white p-[8px] px-6 rounded-md `}
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
		<nav className='flex m-7 p-2 max-sm:mt-9 mx-8 items-center justify-between max-sm:flex-col  '>
			<Logo />
			{displayButtons && <Buttons user={user} />}
		</nav>
	)
}

export default Navbar


import { useEffect } from 'react'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import SortRoundedIcon from '@mui/icons-material/SortRounded'
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded'
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

const Home = ({ user }) => {
	useEffect(() => {
		document.title = 'Project Management'
	}, [])
	return (
		<div className='poppins'>
			<Navbar user={user} displayButtons={true} />
			<CTASection />
			<Features />
		</div>
	)
}

const Features = () => {
	const features = [
		{
			id: 4,
			name: 'Seamless Project and Task Management',
			icon: <ListAltRoundedIcon className='text-orange-500 text-[32px]' />,
			description: ` Create, edit, and delete projects and tasks with ease. Use sorting, filtering, and tabs to keep your workspace organized.`,
		},
		{
			id: 5,
			name: 'Dynamic Interface with Responsive Design',
			icon: <DevicesRoundedIcon className='text-orange-500 text-[32px]' />,
			description: ` Navigate through a responsive dashboard and task pages that adapt to any screen size. Open and close sidebars, dropdowns, and menus intuitively, enhancing your productivity.`,
		},
		{
			id: 6,
			name: 'Advanced Task Sorting and Progress Tracking',
			icon: <SortRoundedIcon className='text-orange-500 text-[32px]' />,
			description: ` Track ongoing and completed tasks, switch between tabs, and sort tasks or projects based on status, priority, or date to stay on top of your workload.`,
		},
	]

	return (
		<section className=' py-12 bg-slate-50 mt-12 px-9'>
			<div className=' mx-auto px-4 '>
				<h2 className='text-2xl font-bold text-center '>Key Features</h2>
				{/*  */}
				<div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 px-10 '>
					{features.map((feature, index) => (
						<div
							key={index}
							className=' p-6 bg-white rounded-lg shadow-sm flex flex-col items-center '
						>
							<div className='w-20 h-20 rounded-full items-center justify-center flex bg-orange-100'>
								{feature.icon}
							</div>
							<h3 className='text-lg font-semibold text-orange-500 mt-6 text-center'>
								{feature.name}
							</h3>
							<p className='text-slate-600 text-[13px] mt-2 text-center w-[80%]'>
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

const CTASection = () => {
	const navigate = useNavigate()
	return (
		<div className='flex flex-col mx-16 items-center mt-[120px] gap-6 '>
			{/*  */}
			<h2 className='font-bold text-2xl text-center'>
				Manage Your Projects and Tasks
				<span className={`text-orange-500`}> Effortlessly!</span>
			</h2>
			{/*  */}
			<p className='text-center text-[15px] w-[510px] max-sm:w-full text-slate-500 '>
				Take full control of your projects today – start adding tasks, sorting
				your priorities, and tracking progress with ease. Stay organized and
				boost your productivity effortlessly!
			</p>

			<button
				className={`block bg-orange-500 rounded-md  px-9 py-3 text-sm font-medium text-white hover:bg-orange-500    `}
				onClick={() => navigate('/authentication')}
				type='button'
			>
				{`Let's get started!`}
			</button>

			{/* <Image
				src={'/app.png'}
				alt='dashboard'
				width={900}
				height={400}
				className='shadow-xl mt-9 aspect-auto sm:w-auto w-[398px] rounded-lg max-w-full   sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl'
			/> */}
		</div>
	)
}

export default Home


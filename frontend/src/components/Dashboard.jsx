import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setAllCategories } from '../reducers/categoryReducer'
import { setAllProject } from '../reducers/prjReducer'
import { setAllTasks } from '../reducers/taskReducer'
import { getIconComponent } from './AllIcons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import { faBarsProgress } from '@fortawesome/free-solid-svg-icons'
import { faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'

import { BarChart, Bar, ResponsiveContainer } from 'recharts'

import ProjectForm from './ProjectForm'
import ProgressBar from './ProgressBar'
import IconsWindow from './IconsWindow'

const Dashboard = ({ user }) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [showAddProject, setShowAddProject] = useState(false)
	const [iconId, setIconId] = useState(1)
	const [showIconsMenu, setShowIconsMenu] = useState(false)

	useEffect(() => {
		document.title = 'Dashboard'
		dispatch(setAllCategories())
		dispatch(setAllProject())
		dispatch(setAllTasks())
	}, [])

	const projects = useSelector((state) => state.projects)
	const categories = useSelector((state) => state.categories)
	const tasks = useSelector((state) => state.tasks)

	const data = [
		{
			name: 'Page A',
			uv: 4000,
			pv: 2400,
			amt: 2400,
		},
	]
	return (
		<div className='z-999 flex flex-row h-screen flex-1 overflow-auto left-[60px] max-w-[calc(100vw-60px)]  relative'>
			<div className='min-h-[110px] left-[20px] right-0 box flex flex-row justify-between items-center z-990 bg-white rounded-2xl absolute  '>
				<div className='flex flex-row justify-between items-center w-full'>
					<div className='flex flex-col'>
						<div className=''>Hello, {user.name}</div>
						<div className=''> welcom back</div>
					</div>
					<div className='flex gap-3'>
						<div className=''>search</div>
						<div className=''>avt</div>
					</div>
				</div>
			</div>

			{/* General stats */}
			<div className='absolute flex flex-row gap-7 p-3 top-[130px] right-[400px] left-[75px] bg-white rounded-xl box'>
				<div
					className='bg-orange-500  items-center text-white p-2 flex flex-row flex-1/3 rounded-2xl cursor-pointer select-none'
					onClick={() => {
						navigate('/projects')
					}}
				>
					<div className='flex w-full justify-between items-center'>
						<div className='flex flex-col items-start	ml-5'>
							<div className='font-bold text-[20px]'>{projects.length}</div>
							<div className='text-white text-[15px]'>Projects</div>
						</div>
					</div>
					<div className='bg-white mr-6 text-orange-500 rounded-full w-10 h-8 flex items-center justify-center'>
						<FontAwesomeIcon icon={faDiagramProject} />
					</div>
				</div>

				<div
					className='bg-orange-500  items-center text-white p-2 flex flex-row flex-1/3 rounded-2xl cursor-pointer select-none'
					onClick={() => {
						navigate('/tasks')
					}}
				>
					<div className='flex w-full justify-between items-center'>
						<div className='flex flex-col items-start ml-5'>
							<div className='font-bold text-[20px]'>
								{tasks.filter((task) => task.completed).length}
							</div>
							<div className='text-white text-[15px]'>Tasks Completed</div>
						</div>
					</div>
					<div className='bg-white mr-6 text-orange-500 rounded-full w-10 h-8 flex items-center justify-center'>
						<FontAwesomeIcon icon={faListCheck} />
					</div>
				</div>

				<div
					className='bg-orange-500  items-center text-white p-2 flex flex-row flex-1/3 rounded-2xl cursor-pointer select-none'
					onClick={() => {
						navigate('/categories')
					}}
				>
					<div className='flex w-full ml-5 justify-between items-center'>
						<div className='flex flex-col items-start'>
							<div className='font-bold text-[20px]'>{categories.length}</div>
							<div className='text-white text-[15px]'>Categories</div>
						</div>
					</div>
					<div className='bg-white mr-6 text-orange-500 rounded-full w-10 h-8 flex items-center justify-center'>
						<FontAwesomeIcon icon={faLayerGroup} />
					</div>
				</div>
			</div>

			{/* Barchart */}
			<div className='absolute p-5 bg-white flex flex-col right-[400px] left-[75px] top-[250px]  h-[400px] box rounded-xl'>
				<BarChart width={150} height={40} data={data} barSize={29}>
					<Bar dataKey='uv' fill='#8884d8' />
				</BarChart>
			</div>

			{/* Recent Tasks */}
			<div className='absolute p-5 bg-white flex flex-col right-[400px] left-[75px] top-[700px]  box rounded-xl pb-10'>
				<div className='font-bold text-[]'>Recents Task</div>
				<div className='mt-5 ml-2 p-2 flex flex-col gap-5 items-center select-none'>
					{[...tasks].reverse().map((task, index) => {
						const date1 = new Date(task.createAt)
						const date2 = new Date()

						const intervalInMilliseconds = date2 - date1
						const intervalInSeconds = intervalInMilliseconds / 1000
						const intervalInMinutes = intervalInSeconds / 60
						const intervalInHours = intervalInMinutes / 60
						const intervalInDays = intervalInHours / 24

						const displayInterval =
							intervalInSeconds < 60
								? `${Math.floor(intervalInSeconds)} ${
										intervalInSeconds >= 2 ? 'seconds' : 'second'
								  }`
								: intervalInMinutes < 60
								? `${Math.floor(intervalInMinutes)} ${
										intervalInMinutes >= 2 ? 'minutes' : 'minute'
								  }`
								: intervalInHours < 24
								? `${Math.floor(intervalInHours)} ${
										intervalInHours >= 2 ? 'hours' : 'hour'
								  }`
								: `${Math.floor(intervalInDays)} ${
										intervalInDays >= 2 ? 'days' : 'day'
								  }`
						return (
							index < 6 && (
								<div
									key={task.id}
									className='h-auto rounded-xl bg-slate-100 relative p-2 flex cursor-pointer w-full  items-center'
									onClick={(e) => {
										navigate('/tasks', {
											state: {
												project: projects.filter(
													(project) => project.id === task.project.id
												)[0],
											},
										})
									}}
								>
									{/* Task Icon and Name */}
									<div className='flex flex-row  w-[150px]'>
										{/* Task Icon */}
										<div className=' left-0 top-4 ml-5 flex justify-center items-center'>
											{getIconComponent(
												task.icon,
												'text-orange-500',
												'text-[15px]',
												'bg-orange-300',
												'p-1'
											)}
										</div>

										{/* Task Name */}
										<p className='font-bold  overflow-auto left-5 ml-5'>
											{task.name}
										</p>
									</div>

									{/* Task Create At */}
									<div className='flex flex-col  ml-10'>
										<p className='text-slate-400'>Created</p>
										<p className='text-blue-500 flex'>{displayInterval} ago</p>
									</div>

									{/* Task Project */}
									<div className='flex flex-col w-[150px]  max-w-[150px] ml-20'>
										<p className='text-slate-400'>In Project</p>
										<p className='text-blue-500 overflow-auto  '>
											{task.project.name}
										</p>
									</div>

									{/* Status */}
									<div className='flex flex-col  ml-10'>
										<p className='text-slate-400'>Status</p>
										<p className='text-blue-500'>{task.status}</p>
									</div>
								</div>
							)
						)
					})}
				</div>
			</div>

			{/* Overall Progress */}
			<div className='absolute right-0 top-[130px] bg-white w-[320px]  h-[200px] box rounded-2xl flex items-center justify-center'>
				<div className='flex flex-col justify-between items-center'>
					<div className='font-bold '>Overall Progress</div>
					<div className='w-27 h-27 rounded-full bg-orange-500 flex justify-center items-center mt-4'>
						<div className='flex flex-col items-center justify-between'>
							<div className='font-bold text-[19px] text-white'>
								{tasks.length === 0
									? 0
									: Math.floor(
											(tasks.filter((task) => task.completed).length /
												tasks.length) *
												100
									  )}
								%
							</div>
							<div className='text-white text-[14px]'>Progress</div>
						</div>
					</div>
				</div>
			</div>

			{/* Latest Projects */}
			<div className='pb-10 absolute right-0 top-[350px] w-[320px] h-auto min-h-[100px] rounded-2xl flex flex-col box p-1'>
				<div className='flex items-center justify-between p-4 w-full '>
					<div className='font-bold'>Latest Projects</div>
					<div
						className='bg-orange-500 select-none cursor-pointer text-white p-2 whitespace-nowrap rounded-xl '
						onClick={() => setShowAddProject(true)}
					>
						+ Add New
					</div>
				</div>
				<div className='flex flex-col gap-7 p-2 '>
					{[...projects].reverse().map(
						(project, index) =>
							index < 4 && (
								<div
									key={project.id}
									className='rounded-xl bg-slate-100 p-2 flex flex-col w-full'
									onClick={(e) => {
										navigate('/tasks', {
											state: { project: project },
										})
									}}
								>
									<div className='flex p-1 gap-1'>
										<div className='flex justify-center items-center'>
											{getIconComponent(
												project.icon,
												'text-white',
												'text-[15px]',
												'bg-orange-500',
												'p-[2px]'
											)}
										</div>
										<div className='text-slate-500 overflow-auto'>
											{project.name}
										</div>
									</div>

									<div className='flex w-full justify-between items-center text-slate-500 mt-4'>
										<div className='flex gap-1 text-slate-500 items-center justify-center'>
											<FontAwesomeIcon icon={faBarsProgress} />

											<p className='self-start'>Progress</p>
										</div>
										<div className=''>
											{project.tasks.filter((task) => task.completed).length}/
											{project.tasks.length}
										</div>
									</div>

									<div className='mt-2 mb-2'>
										<ProgressBar
											progress={
												project.tasks.length === 0
													? 0
													: Math.floor(
															(project.tasks.filter((task) => task.completed)
																.length /
																project.tasks.length) *
																100
													  )
											}
											height='h-1'
											bgColor='bg-gray-300'
										/>
									</div>
								</div>
							)
					)}
				</div>
			</div>

			{/* Project Form */}
			{showAddProject && (
				<ProjectForm
					categories={categories}
					onClose={() => setShowAddProject(false)}
					setIconId={setIconId}
					iconId={iconId}
					setShowIconsMenu={setShowIconsMenu}
					projectUnique={(prjName) =>
						projects.some(
							(prj) => prj.name.toLowerCase() === prjName.toLowerCase()
						)
					}
				/>
			)}

			{/* Icons Window */}
			<IconsWindow
				onClose={() => setShowIconsMenu(false)}
				iconId={iconId}
				setIconId={setIconId}
				show={showIconsMenu}
			/>
		</div>
	)
}

export default Dashboard

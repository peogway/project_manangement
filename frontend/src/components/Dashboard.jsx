import { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setAllCategories } from '../reducers/categoryReducer'
import { setAllProject } from '../reducers/prjReducer'
import { setAllTasks } from '../reducers/taskReducer'
import { useField } from '../hooks/hook'
import { getIconComponent } from './AllIcons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import { faBarsProgress } from '@fortawesome/free-solid-svg-icons'
import { faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'

import {
	BarChart,
	Bar,
	ResponsiveContainer,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
} from 'recharts'
import ProjectForm from './ProjectForm'
import ProgressBar from './ProgressBar'
import IconsWindow from './IconsWindow'
import CubePlus from './CubePlus'

import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import WaveCircle from './WaveCircle'

const Dashboard = ({ user }) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [showAddProject, setShowAddProject] = useState(false)
	const [iconId, setIconId] = useState(1)
	const [showIconsMenu, setShowIconsMenu] = useState(false)
	const [recentDays, setRecentDays] = useState(
		[...Array(7)].map((_, i) => {
			const date = new Date()
			date.setDate(date.getDate() - i)
			const day = String(date.getDate()).padStart(2, '0')
			const month = String(date.getMonth() + 1).padStart(2, '0')
			return `${day}-${month}` // Format DD-MM
		})
	)
	const [data, setData] = useState([
		{ day: recentDays[6], tasksDone: 0 },
		{ day: recentDays[5], tasksDone: 0 },
		{ day: recentDays[4], tasksDone: 0 },
		{ day: recentDays[3], tasksDone: 0 },
		{ day: recentDays[2], tasksDone: 0 },
		{ day: recentDays[1], tasksDone: 0 },
		{ day: recentDays[0], tasksDone: 0 },
	])
	const [searchProjects, setSearchProjects] = useState([])
	const [searchTasks, setSearchTasks] = useState([])

	const { remove: rmSearch, ...search } = useField('text')
	const [isSearch, setIsSearch] = useState(false)
	const searchRef = useRef(null)
	const [isFocused, setIsFocused] = useState(true)

	// Set all information, event to toggle isFocused state
	useEffect(() => {
		document.title = 'Dashboard'
		dispatch(setAllCategories())
		dispatch(setAllProject())
		dispatch(setAllTasks())
	}, [])

	const projects = useSelector((state) => state.projects)
	const categories = useSelector((state) => state.categories)
	const tasks = useSelector((state) => state.tasks)

	const groupedTasks = useMemo(
		() =>
			recentDays.map((dateStr) => ({
				date: dateStr,
				tasks: tasks.filter((task) => {
					const taskDate = new Date(task.createAt)
					const day = String(taskDate.getDate()).padStart(2, '0')
					const month = String(taskDate.getMonth() + 1).padStart(2, '0')
					return `${day}-${month}` === dateStr
				}),
			})),
		[recentDays, tasks]
	)

	// Set tasks grouped by date for barchart
	useEffect(() => {
		setData(
			groupedTasks
				.map((tasksByDate) => ({
					day: tasksByDate.date,
					tasksDone: tasksByDate.tasks.length,
				}))
				.reverse()
		)
	}, [groupedTasks])

	// Filter projects and tasks by search
	useEffect(() => {
		if (search.value.length > 0) {
			setSearchProjects(
				projects
					.filter((project) => project.name.includes(search.value))
					.sort((a, b) => {
						const startsWithA = a.name
							.toLowerCase()
							.startsWith(search.value.toLowerCase())
						const startsWithB = b.name
							.toLowerCase()
							.startsWith(search.value.toLowerCase())
						if (startsWithA && !startsWithB) return -1
						if (!startsWithA && startsWithB) return 1
						return 0
					})
			)
			setSearchTasks(
				tasks
					.filter((task) => task.name.includes(search.value))
					.sort((a, b) => {
						const startsWithA = a.name
							.toLowerCase()
							.startsWith(search.value.toLowerCase())
						const startsWithB = b.name
							.toLowerCase()
							.startsWith(search.value.toLowerCase())
						if (startsWithA && !startsWithB) return -1
						if (!startsWithA && startsWithB) return 1
						return 0
					})
			)
		}
	}, [search.value])

	const priorityMap = {
		high: 'before:bg-red-500',
		medium: 'before:bg-yellow-500',
		low: 'before:bg-green-500',
	}

	// Custom ToolTip component
	const CustomToolTip = ({ active, payload, label }) => {
		if (active && payload && payload.length)
			return (
				<div className='bg-white p-4 rounded-md shadow-sm py-4'>
					<p className='flex gap-2'>
						<span className='font-bold text-orange-500'>
							{payload[0]?.value}
						</span>
						<span className='text-black'> Tasks done</span>
					</p>
				</div>
			)
		return null
	}

	// Custom bar shape functionwith rounded corners
	const RoundedBar = (props) => {
		const { x, y, width, height } = props

		// Define the radius for rounded corners
		const radius = 3
		return (
			<g>
				<rect
					x={x}
					y={y}
					width={width}
					height={height}
					rx={radius}
					ry={radius}
					fill='rgb(62, 99, 255)'
				/>
			</g>
		)
	}

	return (
		<div className='z-999 flex flex-row h-screen flex-1 overflow-auto left-[60px] max-w-[calc(100vw-60px)]  relative'>
			{/* Heading */}
			<div className='min-h-[110px] left-[20px] right-0 box flex flex-row justify-between items-center z-990 bg-white rounded-2xl absolute  '>
				<div className='flex flex-row justify-between items-center w-full'>
					<div className='flex flex-col ml-12 relative top-0 '>
						<div className=''>
							<span className='font-semibold text-slate-800 text-3xl '>
								Hello,
							</span>{' '}
							<span className='text-xl '>{user.name} </span>
						</div>
						<div className='text-slate-500 px-2 '> Welcom Back!</div>
					</div>
					<div className='flex gap-7 mr-20 justify-center items-center select-none relative'>
						{/* Search box, Close Icon, and Search Window */}
						<div
							className={`absolute z-991  top-0 w-[600px] h-[50px] overflow-hidden right-full translate-x-5 flex flex-row-reverse gap-15 ${
								isSearch ? '' : 'invisible'
							}`}
						>
							<div
								className={`absolute top-0 right-0  search flex flex-row-reverse gap-15 ${
									isSearch ? 'search-open' : ''
								} `}
							>
								{/* Close Icon */}
								<div
									className='text-slate-500 flex items-center justify-center select-non cursor:pointer'
									onClick={() => setIsSearch(false)}
								>
									<CloseIcon />
								</div>

								{/*  Search box */}
								<div className='border-slate-600 border-1 rounded-2xl flex gap-3 p-2'>
									<div className='select-none'>
										<SearchIcon />
									</div>
									<input
										{...search}
										placeholder='Search...'
										className='focus:outline-none w-[400px]'
										ref={searchRef}
										onFocus={() => setIsFocused(true)}
										onBlur={() => setIsFocused(false)}
									/>
								</div>
								{/* Search window */}
							</div>
						</div>

						<div
							className={`${
								isSearch
									? 'visibility-hidden opacity-0 '
									: 'opacity-100 visibility-visible transition-all duration-1000'
							} select-none cursor-pointer hover:scale-150 `}
							onClick={() => {
								setIsSearch(true)
								rmSearch()
							}}
						>
							<SearchIcon />
						</div>
						{isFocused && search.value.length > 0 && (
							<div
								className={`absolute flex flex-col top-12 right-[150%]  w-[500px] 
								bg-white rounded-xl max-h-[400px] overflow-auto p-2 py-4 box ${
									isFocused ? 'dropdown-open' : 'dropdown-transition'
								}`}
							>
								<span className='font-semibold ml-3'>Projects</span>
								{searchProjects.map((project) => (
									<div
										key={project.id}
										className='px-4 py-3 flex gap-2 hover:bg-orange-200 rounded-xl transition ease-out duration-200'
										onClick={() =>
											navigate('/tasks', { state: { project: project } })
										}
									>
										<div className='flex items-center justify-center scale-75'>
											{getIconComponent(
												project.icon,
												'text-white',
												'text-[15px]',
												'bg-orange-500',
												'p-2'
											)}
										</div>
										<span className='text-left text-slate-500 flex items-center justify-center max-h-[70px]  line-clamp-3'>
											{project.name}
										</span>
									</div>
								))}
								{searchProjects.length === 0 && (
									<div className='px-4 py-3 flex gap-2 rounded-xl text-slate-400'>
										<div className=' mr-2'>
											<DoNotDisturbAltIcon />
										</div>
										<p>No projects match</p>
									</div>
								)}
								<hr className='w-[80%] text-slate-400 mx-auto my-1 opacity-55 mt-4'></hr>
								<span className='font-semibold pb-2 ml-3 mt-5'>Tasks</span>
								{searchTasks.map((task) => (
									<div
										key={task.id}
										className='px-4 py-3 flex gap-2 hover:bg-orange-200 rounded-xl transition ease-out duration-200'
										onClick={() =>
											navigate('/tasks', {
												state: { project: task.project },
											})
										}
									>
										<div className='flex items-center justify-center scale-75'>
											{getIconComponent(
												task.icon,
												'text-white',
												'text-[15px]',
												'bg-slate-400',
												'p-2'
											)}
										</div>
										<span className='text-left text-slate-500 flex items-center justify-center max-h-[70px]  line-clamp-3'>
											{task.name}
										</span>
									</div>
								))}
								{searchTasks.length === 0 && (
									<div className='px-4 py-3 flex gap-2 rounded-xl text-slate-400'>
										<div className=' mr-2'>
											<DoNotDisturbAltIcon />
										</div>
										<p>No tasks match</p>
									</div>
								)}
							</div>
						)}

						<div
							className='flex w-10 h-10 rounded-full bg-orange-500 justify-center items-cetner text-white'
							onClick={() => {}}
						>
							avt
						</div>
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
					onMouseEnter={(e) => e.currentTarget.classList.add('box')}
					onMouseLeave={(e) => e.currentTarget.classList.remove('box')}
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
						navigate('/tasks', {
							state: {
								taskStatus: true,
							},
						})
					}}
					onMouseEnter={(e) => e.currentTarget.classList.add('box')}
					onMouseLeave={(e) => e.currentTarget.classList.remove('box')}
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
					onMouseEnter={(e) => e.currentTarget.classList.add('box')}
					onMouseLeave={(e) => e.currentTarget.classList.remove('box')}
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
				<div className='flex w-full justify-between p-4'>
					<p className='font-semibold text-slate-800 text-xl'>
						Daily Performance
					</p>
					<p className='text-slate-600'>Last 7 days</p>
				</div>
				<div className='flex justify-center '>
					<BarChart width={600} height={300} data={data}>
						{/* <CartesianGrid stroke='transparent' /> */}
						<XAxis dataKey='day' tick={{ fill: 'black' }} />
						<YAxis dataKey='tasksDone' tick={{ fill: 'black' }} />
						<Tooltip content={<CustomToolTip />} />

						<Bar
							// dataKey={data}
							dataKey='tasksDone'
							fill='rgb(62, 99, 255)'
							background={{ fill: 'transparent' }}
							barSize={50}
							shape={<RoundedBar />}
							isAnimationActive={true} /* Enables animation */
							animationBegin={100}
							animationDuration={500} /* Adjust animation speed */
							animationEasing='ease-out' /* Smooth effect */
						/>
					</BarChart>
				</div>
			</div>

			{/* Recent Tasks */}
			<div className='absolute p-5 bg-white flex flex-col right-[400px] left-[75px] top-[700px]  box rounded-xl pb-10'>
				<div className='font-semibold text-slate-800 text-xl'>Recents Task</div>
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
									className={`h-auto rounded-xl bg-slate-100 relative p-2 flex cursor-pointer w-full items-center before:content-[''] before:right-0 before:absolute before:top-0 before:h-full 
										before:w-[7px] ${
											priorityMap[task.priority]
										} before:rounded-r-xl overflow-hidden`}
									onClick={(e) => {
										navigate('/tasks', {
											state: {
												project: projects.filter(
													(project) => project.id === task.project.id
												)[0],
											},
										})
									}}
									onMouseEnter={(e) => e.currentTarget.classList.add('box')}
									onMouseLeave={(e) => e.currentTarget.classList.remove('box')}
								>
									{/* Task Icon and Name */}
									<div className='flex flex-row  w-[150px]'>
										{/* Task Icon */}
										<div className=' left-0 top-4 ml-2 flex justify-center items-center'>
											{getIconComponent(
												task.icon,
												'text-orange-500',
												'text-[15px]',
												'bg-orange-300',
												'p-1'
											)}
										</div>

										{/* Task Name */}
										<p className='font-semibold text-lg text-slate-600  overflow-hidden left-5 ml-5 break-words line-clamp-4'>
											{task.name}
										</p>
									</div>

									{/* Task Create At */}
									<div className='flex flex-col  ml-10 w-[120px]'>
										<p className='text-slate-400'>Created</p>
										<p className='text-blue-500 flex'>{displayInterval} ago</p>
									</div>

									{/* Task Project */}
									<div className='flex flex-col w-[150px]  max-w-[150px] ml-10'>
										<p className='text-slate-400'>In Project</p>
										<div className='text-blue-500 overflow-auto whitespace-nowrap flex items-center'>
											<span className='scale-60 relative top-[1px]'>
												{getIconComponent(
													task.project.icon,
													'text-white',
													'text-[15px]',
													'bg-orange-500',
													'p-1'
												)}
											</span>
											<span className='flex items-center justify-center'>
												{task.project.name}
											</span>
										</div>
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
			<div className='absolute right-0 top-[130px] bg-white w-[320px]  h-[300px] box rounded-2xl flex items-center justify-center'>
				<div className='font-semibold text-slate-800 text-xl absolute z-50 top-7 right[100px]'>
					Overall Progress
				</div>
				{/* <div className='w-27 h-27 rounded-full bg-orange-500 flex justify-center items-center mt-4'>
						<div className='flex flex-col items-center j	ustify-between'>
							<div className='font-semibold text-[19px] text-white'>
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
					</div> */}

				{/* <div className='canvas'>
						<canvas id='canvas'></canvas>
					</div> */}

				<div className='absolute  w-full h-full scale-80 top-5 '>
					<WaveCircle />
				</div>
			</div>

			{/* Latest Projects */}
			<div className='pb-10 bg-white absolute right-0 top-[450px] w-[320px] h-auto min-h-[100px] rounded-2xl flex flex-col box p-1'>
				<div
					className={`flex items-center ${
						projects.length > 0 ? 'justify-between' : 'justify-center'
					} px-4 pt-4 w-full `}
				>
					<div className='font-semibold text-slate-800 text-xl'>
						Latest Projects
					</div>
					{projects.length > 0 && (
						<div
							className='bg-orange-500 select-none cursor-pointer text-white p-2 whitespace-nowrap rounded-xl '
							onClick={() => setShowAddProject(true)}
						>
							+ Add New
						</div>
					)}
				</div>
				<div className='flex flex-col gap-6 pt-12 items-center'>
					{[...projects].reverse().map(
						(project, index) =>
							index < 4 && (
								<div
									key={project.id}
									className='rounded-xl bg-slate-100 p-2 flex flex-col w-[87%] cursor-pointer'
									onClick={(e) => {
										navigate('/tasks', {
											state: { project: project },
										})
									}}
									onMouseEnter={(e) => e.currentTarget.classList.add('box')}
									onMouseLeave={(e) => e.currentTarget.classList.remove('box')}
								>
									<div className='flex p-1 gap-1'>
										<div className='flex justify-center items-center'>
											{getIconComponent(
												project.icon,
												'text-white',
												'text-[15px]',
												'bg-orange-500',
												'p-[5px]'
											)}
										</div>
										<div className='text-slate-600 text-lg overflow-auto font-semibold'>
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
				{projects.length == 0 && (
					<div className='flex flex-col items-center '>
						<div
							className='flex justify-center items-center text-slate-400 hover:text-orange-500 py-5 transition ease-out duration-800'
							onClick={() => setShowAddProject(true)}
						>
							<CubePlus />
						</div>
						<h1 className='text-slate-600 font-semibold text-lg'>
							No projects yet...
						</h1>
						<p className='text-slate-400 flex l items-center justify-center p-1 text-center pt-1'>
							Please click button above <br />
							to add your first project.
						</p>
					</div>
				)}
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

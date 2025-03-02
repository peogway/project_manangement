import { useState, useEffect } from 'react'
import {} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Task from './Task'
import Dropdown from './DropDown'
import TaskForm from './TaskForm'
import { setAllTasks } from '../reducers/taskReducer'
import { setAllProject } from '../reducers/prjReducer'
import SortDropdown from './SortDropDown'
import ProgressBar from './ProgressBar'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import IconsWindow from './IconsWindow'
import { useField } from '../hooks/hook'
import SearchIcon from '@mui/icons-material/Search'
import { allIconsArray } from './AllIcons'
import SplitscreenIcon from '@mui/icons-material/Splitscreen'

const Tasks = () => {
	// const location = useLocation()
	const dispatch = useDispatch()
	const [selectedProject, setSelectedProject] = useState('All Projects')
	const [taskStatus, setTaskStatus] = useState(false)
	const [sortValue, setSortValue] = useState('A-Z')
	const [showAddTask, setShowAddTask] = useState(false)
	const [showIconsMenu, setShowIconsMenu] = useState(false)
	const [iconId, setIconId] = useState(1)
	const { remove: rmSearch, ...search } = useField('text')

	const [render, setRender] = useState(0)

	useEffect(() => {
		document.title = 'Tasks'
		dispatch(setAllTasks())
		dispatch(setAllProject())
	}, [])
	useEffect(() => setTaskStatus(false), [selectedProject])
	useEffect(() => {
		setRender(render + 1)
	}, [search.value])

	const tasks = useSelector((state) => state.tasks)

	const projects = useSelector((state) => state.projects)

	const dropdownProjects = ['All Projects'].concat(
		projects.map((prj) => prj.name)
	)

	const tasksToShow =
		selectedProject === 'All Projects'
			? tasks
			: tasks.filter((task) => task.project.name === selectedProject)
	const priorityOrder = { high: 3, medium: 2, low: 1 }
	let sortedTasks
	if (sortValue === 'A-Z') {
		sortedTasks = [...tasksToShow].sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortValue === 'Z-A') {
		sortedTasks = [...tasksToShow].sort((a, b) => b.name.localeCompare(a.name))
	} else if (sortValue === 'newest') {
		sortedTasks = [...tasksToShow].sort(
			(a, b) => new Date(b.createAt) - new Date(a.createAt)
		)
	} else if (sortValue === 'oldest') {
		sortedTasks = [...tasksToShow].sort(
			(a, b) => new Date(a.createAt) - new Date(b.createAt)
		)
	} else if (sortValue === 'increasing') {
		sortedTasks = [...tasksToShow].sort(
			(a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
		)
	} else {
		sortedTasks = [...tasksToShow].sort(
			(a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
		)
	}
	// console.log(sortedTasks)

	const completedTasks = sortedTasks.filter((task) => task.completed === true)
	const uncompletedTasks = sortedTasks.filter(
		(task) => task.completed === false
	)

	const showTasks = taskStatus
		? completedTasks.filter((task) => task.name.includes(search.value))
		: uncompletedTasks.filter((task) => task.name.includes(search.value))

	// console.log(completedTasks)
	// console.log(uncompletedTasks)
	// console.log(showTasks)

	// const { prj } = location.state || {}

	const toggleAddTask = () => {
		setShowAddTask(!showAddTask)
	}
	const prj =
		selectedProject === 'All Projects'
			? null
			: projects.filter((project) => project.name === selectedProject)[0]
	const icon =
		prj === null
			? { icon: <SplitscreenIcon /> }
			: allIconsArray.filter((icon) => icon.id === parseInt(prj.icon))[0]

	return (
		<div className='flex flex-col w-full h-screen z-999 flex-1 '>
			<div className='flex flex-row justify-between items-center z-999 bg-white  min-h-[100px] self-end rounded-2xl box fixed left-[150px] right-0'>
				<div className='flex flex-row items-center justify-center'>
					<div className='mb-2 ml-4 mr-2 w-9 h-9 text-white bg-orange-500 shadow-sm border border-slate-50 flex items-center justify-center rounded-lg'>
						{icon.icon}
					</div>
					<div className='flex flex-col items-start'>
						<Dropdown
							options={dropdownProjects}
							onSelect={setSelectedProject}
						/>
						<div className='flex felx-row items-center gap-2'>
							<ProgressBar
								progress={
									tasksToShow.length === 0
										? 1
										: completedTasks.length / tasksToShow.length
								}
								color='bg-orange-500'
							/>
							{tasksToShow.length === 0
								? 100
								: ((completedTasks.length / tasksToShow.length) * 100).toFixed(
										0
								  )}
							%
						</div>
					</div>
					<button
						onClick={toggleAddTask}
						className='w-25 h-7 ml-10 bg-orange-500 rounded-lg text-white'
					>
						+ Add New
					</button>
				</div>
				<div className='ml-auto items-center mr-5 flex'>
					<p className='font-bold'>Sort</p>
					<FilterAltIcon fontSize='small' />
					<SortDropdown
						sortTasks={true}
						sortByDate={true}
						setSortValue={setSortValue}
					/>
				</div>
			</div>

			<div className='top-[100px] relative  overflow-auto  z-500 w-[calc(100vw-160px)] max-h-[calc(100vh-130px)] left-[100px] pt-5 ml-15'>
				<div className='flex z-900 rounded-lg  self-start ml-10 mt-5'>
					<div className='border-b-2 border-orange-400 pl-1 pr-0.5'>
						<SearchIcon />
					</div>
					<input
						{...search}
						placeholder='Search a task'
						className='border-b-2 border-gray-200 pl-0.5'
					/>
				</div>
				<div className='ml-7 mt-10 '>
					<div className='flex flex-row gap-5'>
						<div
							className={`flex ${taskStatus && 'opacity-40 '} ${
								!taskStatus && 'text-orange-500'
							}`}
						>
							<button
								onClick={() => setTaskStatus(false)}
								className='font-bold'
							>
								On Going Tasks
							</button>
							<div className='flex bg-gray-400 text-white w-5 h-5 justify-center items-center self-center ml-1'>
								{uncompletedTasks.length}
							</div>
						</div>

						<div
							className={`flex ${!taskStatus && 'opacity-40 '} ${
								taskStatus && 'text-orange-500'
							}`}
						>
							<button onClick={() => setTaskStatus(true)} className='font-bold'>
								Completed Tasks
							</button>
							<div className='flex bg-gray-400 text-white w-5 h-5 justify-center items-center self-center ml-1'>
								{completedTasks.length}
							</div>
						</div>
					</div>
					<div className='ml-5 mt-5 w-[95%]  pb-10'>
						{showTasks.map((task) => (
							<div key={task.id}>
								<Task
									{...task}
									projects={projects}
									selectedProject={selectedProject}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
			{showAddTask && (
				<TaskForm
					onClose={() => setShowAddTask(false)}
					projects={projects}
					selectedProject={selectedProject}
					setIconId={setIconId}
					iconId={iconId}
					setShowIconsMenu={setShowIconsMenu}
				/>
			)}

			<IconsWindow
				onClose={() => setShowIconsMenu(false)}
				iconId={iconId}
				setIconId={setIconId}
				show={showIconsMenu}
			/>
		</div>
	)
}

export default Tasks

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

const Tasks = () => {
	// const location = useLocation()
	const dispatch = useDispatch()
	const [selectedProject, setSelectedProject] = useState('All Projects')
	const [taskStatus, setTaskStatus] = useState(false)
	const [sortValue, setSortValue] = useState('A-Z')
	const [showAddTask, setShowAddTask] = useState(false)
	const [showIconsMenu, setShowIconsMenu] = useState(false)
	const [iconId, setIconId] = useState(1)

	useEffect(() => {
		document.title = 'Tasks'
		dispatch(setAllTasks())
		dispatch(setAllProject())
	}, [])
	useEffect(() => setTaskStatus(false), [selectedProject])

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

	const showTasks = taskStatus ? completedTasks : uncompletedTasks

	// console.log(completedTasks)
	// console.log(uncompletedTasks)
	// console.log(showTasks)

	// const { prj } = location.state || {}

	const toggleAddTask = () => {
		setShowAddTask(!showAddTask)
	}

	return (
		<div className='flex flex-col w-full h-screen z-999 flex-1'>
			<div className='flex flex-row justify-between items-center z-999 bg-white w-[99%] h-25 self-end rounded box'>
				<div className='flex flex-row items-center'>
					<div className='ml-4 mr-4'>label</div>
					<div className='flex flex-col items-start'>
						<Dropdown
							options={dropdownProjects}
							onSelect={setSelectedProject}
						/>
						<div className='flex felx-row items-center gap-2'>
							<ProgressBar
								progress={completedTasks.length / tasksToShow.length}
								color='bg-orange-600'
							/>
							{((completedTasks.length / tasksToShow.length) * 100).toFixed(0)}%
						</div>
					</div>
					<button
						onClick={toggleAddTask}
						className='w-25 h-7 ml-10 bg-orange-600 rounded-sm text-white'
					>
						+ New Task
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
			<div className='ml-7 mt-10'>
				<div className='flex flex-row gap-5'>
					<div
						className={`flex ${taskStatus && 'opacity-40 '} ${
							!taskStatus && 'text-orange-600'
						}`}
					>
						<button onClick={() => setTaskStatus(false)} className='font-bold'>
							On Going Tasks
						</button>
						<div className='flex bg-gray-400 text-white w-5 h-5 justify-center items-center self-center ml-1'>
							{uncompletedTasks.length}
						</div>
					</div>

					<div
						className={`flex ${!taskStatus && 'opacity-40 '} ${
							taskStatus && 'text-orange-600'
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
				<div className='ml-5 mt-5 w-[95%]'>
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
			{showAddTask && (
				<TaskForm
					onClose={() => setShowAddTask(false)}
					projects={projects}
					selectedProject={selectedProject}
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

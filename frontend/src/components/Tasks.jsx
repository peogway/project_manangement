import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Task from './Task'
import Dropdown from './DropDown'
import TaskForm from './TaskForm'
import { setAllTasks, updateTask, deleteTask } from '../reducers/taskReducer'
import {
	setAllProject,
	updateProject,
	deleteProject,
} from '../reducers/prjReducer'
import SortDropdown from './sortDropDown'

const Tasks = () => {
	// const location = useLocation()
	const dispatch = useDispatch()
	const [selectedProject, setSelectedProject] = useState('All Projects')
	const [taskStatus, setTaskStatus] = useState(false)
	const [sortValue, setSortValue] = useState('A-Z')
	const [showAddTask, setShowAddTask] = useState(false)

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
		<div className='flex justify-center items-center flex-1 h-full h-screen'>
			<div className='z-999 z-999 bg-white w-[95%] h-[90%]'>
				<button onClick={toggleAddTask}>+ New Task</button>
				<br />
				<Dropdown options={dropdownProjects} onSelect={setSelectedProject} />
				<label style={{ color: 'gray' }}>Sort By:</label>
				<SortDropdown setSortValue={setSortValue} sortTasks={true} />
				<br />
				<button onClick={() => setTaskStatus(false)}>On Going Tasks</button>
				<button onClick={() => setTaskStatus(true)}>Completed Tasks</button>
				<div>
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
				{showAddTask && (
					<TaskForm
						onClose={() => setShowAddTask(false)}
						projects={projects}
						selectedProject={selectedProject}
					/>
				)}
			</div>
		</div>
	)
}

export default Tasks

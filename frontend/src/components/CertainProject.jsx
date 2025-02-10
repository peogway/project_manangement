import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllTasks, updateTask } from '../reducers/taskReducer'
import SortDropdown from './sortDropDown'
import EditTaskForm from './EditTaskForm'

const CertainProject = ({ project, categories, onClose }) => {
	const dispatch = useDispatch()
	const formRef = useRef(null)
	const [sortValue, setSortValue] = useState('A-Z')
	const [isChecked, setIsChecked] = useState(false)
	const [showEditForm, setShowEditForm] = useState(false)
	const [taskStatusToShow, setTaskStatusToSHow] = useState(null)
	const overlayRef = useRef(null)
	useEffect(() => {
		dispatch(setAllTasks())
	}, [])

	const allTasks = useSelector((state) => state.tasks)
	const tasks = allTasks.filter((task) => task.project.id === project.id)
	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}
	// console.log(allTasks)
	const priorityOrder = { high: 3, medium: 2, low: 1 }
	let sortedTasks
	if (sortValue === 'A-Z') {
		sortedTasks = [...tasks].sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortValue === 'Z-A') {
		sortedTasks = [...tasks].sort((a, b) => b.name.localeCompare(a.name))
	} else if (sortValue === 'newest') {
		sortedTasks = [...tasks].sort(
			(a, b) => new Date(b.createAt) - new Date(a.createAt)
		)
	} else if (sortValue === 'oldest') {
		sortedTasks = [...tasks].sort(
			(a, b) => new Date(a.createAt) - new Date(b.createAt)
		)
	} else if (sortValue === 'increasing') {
		sortedTasks = [...tasks].sort(
			(a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
		)
	} else {
		sortedTasks = [...tasks].sort(
			(a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
		)
	}

	const completedTasks = sortedTasks.filter((task) => task.completed === true)
	const uncompletedTasks = sortedTasks.filter(
		(task) => task.completed === false
	)

	const taskMap = {
		true: completedTasks,
		false: uncompletedTasks,
		null: sortedTasks,
	}

	const showTasks = taskMap[taskStatusToShow]
	// console.log(showTasks)
	const handleCheckboxChange = (task) => {
		setIsChecked(!isChecked)
		const { id } = task
		const taskToUpdate = {
			id,
			completed: !task.completed,
			status: task.completed ? 'in-progress' : 'completed',
		}

		dispatch(updateTask(taskToUpdate))
	}

	const handleDelete = (task) => {
		if (window.confirm(`Are you sure you want to delete task ${task.name}?`)) {
			dispatch(deleteTask(task.id))
		}
	}
	return (
		<div>
			<div
				ref={overlayRef}
				onClick={handleClickOutside}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					zIndex: 999,
					pointerEvents: 'auto',
				}}
			/>
			<div
				ref={formRef}
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					background: 'white',
					padding: 20,
					zIndex: 1000,
				}}
			>
				<h2>{project.name}</h2>
				<SortDropdown setSortValue={setSortValue} sortTasks={true} />

				{showTasks.map((task) => (
					<div key={task.id} className={task.completed ? 'completed-task' : ''}>
						<div>
							<div className='task-container'>
								<div className='left-content'>
									<input
										className='task-checkbox'
										type='checkbox'
										checked={task.completed}
										onChange={() => handleCheckboxChange(task)}
									/>
								</div>
								<div className='right-content'>
									<div className='task-name-project'>
										<h2 className='task-name'>{task.name}</h2>
										<p className='task-project'>{task.project.name}</p>
									</div>

									<div className='priority'>{task.priority}</div>

									<button
										onClick={() => setShowEditForm(true)}
										className='edit-task-btn'
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(task)}
										className='delete-task-btn'
									>
										Delete
									</button>
								</div>
							</div>
							{showEditForm && (
								<EditTaskForm
									onClose={() => setShowEditForm(false)}
									{...task}
								/>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default CertainProject


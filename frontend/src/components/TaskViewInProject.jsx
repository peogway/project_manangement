import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateTask, deleteTask } from '../reducers/taskReducer'
import Dropdown from './DropDown'

const TaskViewInProject = ({ task }) => {
	const dispatch = useDispatch()
	const [isEditing, setIsEditing] = useState(false)
	const taskNameRef = useRef(null)
	const [priority, setPriority] = useState(task.priority)
	const priorityRef = useRef(null)
	const applyButtonRef = useRef(null)

	useEffect(() => {
		if (!isEditing) return

		const handleClickOutside = (event) => {
			if (
				taskNameRef.current &&
				!taskNameRef.current.contains(event.target) &&
				priorityRef.current &&
				!priorityRef.current.contains(event.target) &&
				applyButtonRef.current &&
				!applyButtonRef.current.contains(event.target)
			) {
				if (window.confirm('Are you sure to discard all changes?')) {
					taskNameRef.current.textContent = task.name
					setPriority(task.priority)
					setIsEditing(false)
				} else {
					setTimeout(() => taskNameRef.current.focus(), 0)
				}
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isEditing])

	const handleEditClick = () => {
		setIsEditing(true)
		setTimeout(() => taskNameRef.current.focus(), 0) // Focus after state update
	}

	const handleApplyClick = () => {
		const taskToUpdate = {
			name: taskNameRef.current.textContent,
			priority: priorityRef.current.value,
			id: task.id,
		}
		console.log(priorityRef.current.value)

		dispatch(updateTask(taskToUpdate))
		setIsEditing(false)
	}

	const handleCheckboxChange = (task) => {
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

	const priorities = [priority].concat(
		['low', 'medium', 'high'].filter((pri) => pri !== priority)
	)
	return (
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
						<h2
							className={`task-name ${isEditing ? 'editing' : ''}`}
							ref={taskNameRef}
							contentEditable={isEditing}
							suppressContentEditableWarning={true}
						>
							{task.name}
						</h2>
						<p className='task-project'>{task.project.name}</p>
					</div>

					<div className={`priority ${isEditing ? 'editing' : ''}`}>
						{isEditing ? (
							<Dropdown
								ref={priorityRef}
								options={priorities}
								onSelect={setPriority}
							/>
						) : (
							task.priority
						)}
					</div>

					<button
						ref={applyButtonRef}
						onClick={isEditing ? handleApplyClick : handleEditClick}
						className='edit-task-btn'
					>
						{isEditing ? 'Apply' : 'Edit'}
					</button>
					<button
						onClick={() => handleDelete(task)}
						className='delete-task-btn'
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	)
}

export default TaskViewInProject


import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateTask, deleteTask } from '../reducers/taskReducer'

const TaskViewInProject = ({ task }) => {
	const dispatch = useDispatch()
	const [isEditing, setIsEditing] = useState(false)
	const taskNameRef = useRef(null)
	const priorityRef = useRef(null)

	useEffect(() => {
		if (!isEditing) return
		const handleClickOutside = (event) => {
			if (taskNameRef.current && !taskNameRef.current.contains(event.target)) {
				if (window.confirm('Are you sure to discard all changes?')) {
					taskNameRef.current.textContent = task.name
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
			id: task.id,
		}

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
							className='task-name'
							ref={taskNameRef}
							contentEditable={isEditing}
							suppressContentEditableWarning={true}
						>
							{task.name}
						</h2>
						<p className='task-project'>{task.project.name}</p>
					</div>

					<div className='priority'>{task.priority}</div>

					<button
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


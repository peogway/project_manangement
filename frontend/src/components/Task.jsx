import { useState } from 'react'
import { updateTask } from '../reducers/taskReducer'
import { useDispatch } from 'react-redux'

const Task = ({ ...props }) => {
	const dispatch = useDispatch()
	const [isChecked, setIsChecked] = useState(props.completed ? true : false)
	const handleCheckboxChange = () => {
		setIsChecked(!isChecked)
		const { id } = props
		const taskToUpdate = {
			id,
			completed: !props.completed,
			status: props.completed ? 'in-progress' : 'completed',
		}

		dispatch(updateTask(taskToUpdate))
	}
	return (
		<div className='task-container'>
			<div className='left-content'>
				<input
					className='task-checkbox'
					type='checkbox'
					checked={isChecked}
					onChange={handleCheckboxChange}
				/>
			</div>
			<div className='right-content'>
				<div className='task-name-project'>
					<h2 className='task-name'>{props.name}</h2>
					<p className='task-project'>{props.project.name}</p>
				</div>
				<div className='status'>
					{props.completed ? <div>Completed</div> : <div>In Progress</div>}
				</div>

				<div className='priority'>{props.priority}</div>

				<button
					onClick={() => props.editTask(props.id, props.project.id)}
					className='edit-task-btn'
				>
					Edit
				</button>
				<button
					onClick={() => props.deleteTask(props.id, props.project.id)}
					className='delete-task-btn'
				>
					Delete
				</button>
			</div>
		</div>
	)
}

export default Task


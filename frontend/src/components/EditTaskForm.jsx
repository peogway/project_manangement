import { useField } from '../hooks/hook'
import { useRef, useEffect, useState } from 'react'
import Dropdown from './DropDown'
import { setError, setNotification } from '../reducers/notiReducer'
import { updateTask } from '../reducers/taskReducer'
import { useDispatch } from 'react-redux'

const EditTaskForm = ({ onClose, projects, selectedProject, ...task }) => {
	const { remove: rmTask, ...taskName } = useField('text', task.name)
	const [priority, setPriority] = useState(task.priority)
	const [chosenProject, setChosenProject] = useState(task.project.name)
	const formRef = useRef(null)
	const dispatch = useDispatch()
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (formRef.current && !formRef.current.contains(event.target)) {
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [onClose])
	const priorities = [priority].concat(
		['low', 'medium', 'high'].filter((pri) => pri !== priority)
	)
	const dropdownProjects = [chosenProject].concat(
		projects.filter((prj) => prj.name !== chosenProject).map((prj) => prj.name)
	)
	const handleAddTask = (e) => {
		e.preventDefault()

		if (taskName.value === '') {
			dispatch(setError('Please enter a task name', 2))
			return
		}

		const taskToUpdate = {
			name: taskName.value,
			priority: priority,
			project: projects.filter((prj) => prj.name === chosenProject)[0].id,
			id: task.id,
		}
		try {
			dispatch(updateTask(taskToUpdate))
			onClose()
		} catch {
			dispatch(setError('Something goes wrong', 5))
		}
	}

	return (
		<div ref={formRef}>
			<h1>Edit Task</h1>
			<button onClick={onClose}>X</button>
			<div className='task-name'>
				<label>Task Name</label>
				<br />
				<input {...taskName} />
			</div>
			<div className='task-priority'>
				<label>Task Priority</label>
				<br />
				<Dropdown options={priorities} onSelect={setPriority} />
			</div>
			<div className='task-project'>
				<label>Project</label>
				<br />
				<Dropdown options={dropdownProjects} onSelect={setChosenProject} />
			</div>
			<button onClick={onClose}>Cancel</button>
			<button onClick={handleAddTask}>Edit Task</button>
		</div>
	)
}

export default EditTaskForm


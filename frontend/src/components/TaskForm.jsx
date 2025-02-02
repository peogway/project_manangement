import { useField } from '../hooks/hook'
import { useRef, useEffect, useState } from 'react'
import Dropdown from './DropDown'
import { setError, setNotification } from '../reducers/notiReducer'
import { createNewTask } from '../reducers/taskReducer'
import { useDispatch } from 'react-redux'

const TaskForm = ({ onClose, projects, selectedProject }) => {
	const { remove: rmTask, ...task } = useField('text')
	const [priority, setPriority] = useState('low')
	const [chosenProject, setChosenProject] = useState(selectedProject)
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
	const priorities = ['low', 'medium', 'high']
	const dropdownProjects =
		chosenProject === 'All Projects'
			? projects.map((prj) => prj.name)
			: [chosenProject].concat(
					projects
						.filter((prj) => prj.name !== chosenProject)
						.map((prj) => prj.name)
			  )
	const handleAddTask = (e) => {
		e.preventDefault()
		if (chosenProject === 'All Projects') {
			dispatch(setError('Please select a project', 2))
			return
		}
		// console.log("what");

		if (task.value === '') {
			dispatch(setError('Please enter a task name', 2))
			return
		}

		// console.log("the");
		const taskToCreate = {
			name: task.value,
			priority: priority,
			projectId: projects.filter((prj) => prj.name === chosenProject)[0].id,
		}
		try {
			dispatch(createNewTask(taskToCreate))
			onClose()
		} catch {
			dispatch(setError('Something goes wrong', 5))
		}
	}

	return (
		<div ref={formRef}>
			<h1>Add New Task</h1>
			<button onClick={onClose}>X</button>
			<div className='task-name'>
				<label>Task Name</label>
				<br />
				<input {...task} placeholder='Enter Task Name...' />
			</div>
			<div className='task-priority'>
				<label>Task Priority</label>
				<br />
				<Dropdown
					options={priorities}
					onSelect={setPriority}
					description='Select Priority'
				/>
			</div>
			<div className='task-project'>
				<label>Project</label>
				<br />
				<Dropdown
					options={dropdownProjects}
					onSelect={setChosenProject}
					description={
						chosenProject === 'All Projects' ? 'Select a project' : undefined
					}
				/>
			</div>
			<button onClick={onClose}>Cancel</button>
			<button onClick={handleAddTask}>Add Task</button>
		</div>
	)
}

export default TaskForm


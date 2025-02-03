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
	const overlayRef = useRef(null)
	const dispatch = useDispatch()
	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}
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
		</div>
	)
}

export default TaskForm


import { useField } from '../hooks/hook'
import { useRef, useEffect, useState } from 'react'
import Dropdown from './DropDown'
import { setError, setNotification } from '../reducers/notiReducer'
import { createNewTask } from '../reducers/taskReducer'
import { useDispatch } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from './IconButton'

const TaskForm = ({
	onClose,
	projects,
	selectedProject,
	setShowIconsMenu,
	iconId,
	setIconId,
}) => {
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
		setIconId(1)
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
			icon: iconId.toString(),
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
					left: '120px',
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(104, 102, 102, 0.5)',
					zIndex: 999,
					pointerEvents: 'auto',
				}}
			/>
			<div
				ref={formRef}
				style={{
					position: 'absolute',
					top: '40%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					background: 'white',
					padding: 20,
					zIndex: 1000,
				}}
				className='flex flex-col items-center max-w-[600px] w-[550px] rounded'
			>
				<div className='flex flex-row justify-between self-start w-full'>
					<h1 className='font-bold text-xl'>Add New Task</h1>
					<div onClick={onClose} className='text-gray-500'>
						<CloseIcon />
					</div>
				</div>

				<div className='task-name  w-[85%] mt-7'>
					<label className='text-gray-500 ml-[-10px] font-bold'>
						Task Name
					</label>

					<div className=' w-full mt-2 flex flex-row justify-between '>
						<input
							{...task}
							placeholder='Enter Task Name...'
							className='text-gray-500 border-1 border-gray-400 rounded w-[80%]'
						/>
						<div className=''>
							<IconButton iconId={iconId} setShow={setShowIconsMenu} />
						</div>
					</div>
				</div>

				<div className='task-priority w-[85%] mt-7 '>
					<label className='text-gray-500 ml-[-10px] font-bold'>
						Task Priority
					</label>

					<div className='mt-2'>
						<Dropdown
							options={priorities}
							onSelect={setPriority}
							description='Select Priority'
							width='full'
						/>
					</div>
				</div>
				<div className='task-project w-[85%] mt-7'>
					<label className='text-gray-500 ml-[-10px] font-bold w-full'>
						Project
					</label>
					<br />
					<div className='mb-10 mt-2 w-full'>
						<Dropdown
							options={dropdownProjects}
							onSelect={setChosenProject}
							description={
								chosenProject === 'All Projects'
									? 'Select a project'
									: undefined
							}
							width='full'
						/>
					</div>
				</div>
				<button
					onClick={handleAddTask}
					className='bg-orange-600 text-white rounded p-2 w-[85%]'
				>
					Add Task
				</button>
			</div>
		</div>
	)
}

export default TaskForm


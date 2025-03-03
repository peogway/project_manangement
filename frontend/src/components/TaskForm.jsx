import { useField } from '../hooks/hook'
import { useRef, useEffect, useState } from 'react'
import Dropdown from './DropDown'
import { setError, setNotification } from '../reducers/notiReducer'
import { createNewTask } from '../reducers/taskReducer'
import { useDispatch } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from './IconButton'
import ProjectsDropDown from './ProjectsDropdown'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { getIconComponent } from './AllIcons'

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
	const formRef = useRef(null)
	const overlayRef = useRef(null)
	const dispatch = useDispatch()
	const [chosenProject, setChosenProject] = useState(selectedProject)
	const [openProjectsDropDown, setOpenProjectsDropDown] = useState(false)

	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}
	const priorities = ['Low', 'Medium', 'High']

	const handleAddTask = (e) => {
		e.preventDefault()
		setIconId(1)
		if (chosenProject === null) {
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
			priority: priority.toLowerCase(),
			projectId: chosenProject.id,
		}
		try {
			dispatch(createNewTask(taskToCreate))
			onClose()
		} catch {
			dispatch(setError('Something goes wrong', 5))
		}
	}

	const icon =
		chosenProject === null
			? null
			: getIconComponent(chosenProject.icon, 'text-white', 'text-[27px]')
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
				className='rounded-2xl'
			/>
			<div
				ref={formRef}
				style={{
					position: 'fixed',
					top: '50vh',
					left: '50vw',
					transform: 'translate(-50%, -50%)',
					background: 'white',
					padding: 20,
					zIndex: 1000,
				}}
				className='flex flex-col items-center max-w-[600px] w-[550px] rounded-2xl'
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
							className='text-gray-500 border-1 border-gray-400 rounded w-[80%] pl-3'
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
						<div
							className='w-full flex flex-rox items-center justify-between border-1 border-gray-400 rounded-lg user-select-none'
							onMouseDown={(e) => {
								if (e.target === e.currentTarget) {
									// Only prevent default if clicking on the div itself, not text
									e.preventDefault()
								}
								e.stopPropagation()
								setOpenProjectsDropDown(!openProjectsDropDown)
							}}
						>
							<div className='flex flex-row gap-2 items-center pl-3 pt-1 pb-1'>
								<div
									className={` w-9 h-9 bg-orange-500 text-white shadow-sm border border-slate-50 flex items-center justify-center rounded-lg ${
										icon === null && 'hidden'
									}`}
								>
									{icon !== null ? icon : null}
								</div>
								<div className='text-gray-500'>
									{chosenProject === null
										? 'Select Project'
										: chosenProject.name}
								</div>
							</div>
							<div className='text-gray-500'>
								<KeyboardArrowDownIcon fontSize='medium' />
							</div>
						</div>
						<ProjectsDropDown
							openProjectsDropDown={openProjectsDropDown}
							setOpenProjectsDropDown={setOpenProjectsDropDown}
							setChosenProject={setChosenProject}
							chosenProject={chosenProject}
							allProjects={projects}
						/>
					</div>
				</div>
				<button
					onClick={handleAddTask}
					className='bg-orange-500 text-white rounded-xl p-2 w-[85%]'
				>
					Add Task
				</button>
			</div>
		</div>
	)
}

export default TaskForm

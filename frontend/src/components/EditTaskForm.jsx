import { useField } from '../hooks/hook'
import { useRef, useEffect, useState } from 'react'
import Dropdown from './DropDown'
import { setError, setNotification } from '../reducers/notiReducer'
import { updateTask } from '../reducers/taskReducer'
import { useDispatch } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close'
import IconsWindow from './IconsWindow'
import IconButton from './IconButton'

const EditTaskForm = ({ onClose, projects, selectedProject, ...task }) => {
	const { remove: rmTask, ...taskName } = useField('text', task.name)
	const [showIconsMenu, setShowIconsMenu] = useState(false)
	const [iconId, setIconId] = useState(parseInt(task.icon))
	const [priority, setPriority] = useState(task.priority)
	const [chosenProject, setChosenProject] = useState(task.project.name)
	const formRef = useRef(null)
	const overlayRef = useRef(null)
	const dispatch = useDispatch()
	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}

	const priorities = [priority].concat(
		['low', 'medium', 'high'].filter((pri) => pri !== priority)
	)
	const dropdownProjects = [chosenProject].concat(
		projects.filter((prj) => prj.name !== chosenProject).map((prj) => prj.name)
	)
	const handleEdit = (e) => {
		e.preventDefault()

		if (taskName.value === '') {
			dispatch(setError('Please enter a task name', 2))
			return
		}

		const taskToUpdate = {
			name: taskName.value,
			priority: priority,
			icon: iconId.toString(),
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
				className='flex flex-col items-center max-w-[600px] w-[550px] rounded-2xl'
			>
				<div className='flex flex-row justify-between self-start w-full'>
					<h1 className='font-bold text-xl'>Edit Task</h1>
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
							{...taskName}
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
							width='full'
						/>
					</div>
				</div>

				<button
					onClick={handleEdit}
					className='bg-orange-500 text-white rounded-xl p-2 w-[85%]'
				>
					Edit Task
				</button>
			</div>
			<IconsWindow
				onClose={() => setShowIconsMenu(false)}
				iconId={iconId}
				setIconId={setIconId}
				show={showIconsMenu}
			/>
		</div>
	)
}

export default EditTaskForm


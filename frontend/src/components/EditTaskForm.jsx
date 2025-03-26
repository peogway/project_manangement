import { useField } from '../hooks/hook'
import { useRef, useEffect, useState } from 'react'
import Dropdown from './DropDown'
import { setError, setNotification } from '../reducers/notiReducer'
import { updateTask } from '../reducers/taskReducer'
import { useDispatch } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close'
import IconsWindow from './IconsWindow'
import IconButton from './IconButton'
import ProjectsDropDown from './ProjectsDropdown'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { getIconComponent } from './AllIcons'
import { LogoDevTwoTone } from '@mui/icons-material'

const EditTaskForm = ({ onClose, project, ...task }) => {
	const { remove: rmTask, ...taskName } = useField('text', task.name)
	const [showIconsMenu, setShowIconsMenu] = useState(false)
	const [iconId, setIconId] = useState(parseInt(task.icon))
	const [priority, setPriority] = useState(task.priority)

	const [chosenProject, setChosenProject] = useState(project)

	const formRef = useRef(null)
	const overlayRef = useRef(null)
	const dispatch = useDispatch()
	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}

	const priorities = [
		priority.charAt(0).toUpperCase() + priority.slice(1),
	].concat(
		['Low', 'Medium', 'High'].filter(
			(pri) => pri.toLowerCase() !== priority.toLowerCase()
		)
	)

	const handleEdit = (e) => {
		e.preventDefault()

		if (taskName.value === '') {
			dispatch(setError('Please enter a task name', 2))
			return
		}

		if (taskName.value.length < 5) {
			dispatch(setError('Require minimum length of 5', 2))
			return
		}

		if (!/^[A-Za-z]$/.test(taskName.value[0])) {
			dispatch(setError('Require first non-special character', 2))
			return
		}

		const taskToUpdate = {
			name: taskName.value,
			priority: priority.toLowerCase(),
			icon: iconId.toString(),
			project: chosenProject.id,
			id: task.id,
		}
		try {
			dispatch(updateTask(taskToUpdate))
			onClose()
		} catch {
			dispatch(setError('Something goes wrong', 5))
		}
	}
	const icon =
		chosenProject === null
			? null
			: getIconComponent(
					chosenProject.icon,
					'text-white',
					'text-[27px]',
					'bg-orange-400'
			  )
	return (
		<div>
			<div
				ref={overlayRef}
				onClick={handleClickOutside}
				style={{
					position: 'fixed',
					top: 0,
					left: '60px',
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(104, 102, 102, 0.5)',
					zIndex: 1000,
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
					<h1 className='font-semibold text-xl'>Edit Task</h1>
					<div onClick={onClose} className='text-gray-500'>
						<CloseIcon />
					</div>
				</div>

				<div className='task-name  w-[85%] mt-7'>
					<label className='text-gray-500 ml-[-10px] font-semibold'>
						Task Name
					</label>

					<div className=' w-full mt-2 flex flex-row justify-between '>
						<div className='w-[80%] border-1 border-gray-400 rounded-lg p-2'>
							<input
								{...taskName}
								className='text-gray-500  w-full focus:outline-none'
							/>
						</div>
						<div className=''>
							<IconButton iconId={iconId} setShow={setShowIconsMenu} />
						</div>
					</div>
				</div>

				<div className='task-priority w-[85%] mt-7 '>
					<label className='text-gray-500 ml-[-10px] font-semibold'>
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

				<div className='task-project w-full  self-start ml-7 mt-7 flex flex-row items-center mb-10'>
					<label className='text-gray-500 w-auto font-semibold'>Project</label>

					<div className='flex-1 flex justify-center items-center '>
						<div className=' flex flex-row gap-2 items-center rounded-2xl border-slate-400 border-1 pl-3 pt-1 pb-1 pr'>
							<div
								className={` w-9 h-9 bg-orange-400 text-white shadow-sm border border-slate-50 flex items-center justify-center rounded-lg ${
									icon === null && 'hidden'
								}`}
							>
								{icon !== null ? icon : null}
							</div>
							<div className='text-gray-500 w-auto pr-3 max-w-[300px] overflow-auto'>
								{chosenProject === null ? 'Select Project' : chosenProject.name}
							</div>
						</div>
					</div>
				</div>

				<button
					onClick={handleEdit}
					className='bg-orange-400 select-none text-white rounded-xl p-2 w-[85%]'
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

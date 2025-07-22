import { useState } from 'react'
import { updateTask, deleteTask } from '../reducers/taskReducer'
import { setNotification } from '../reducers/notiReducer'
import { useDispatch } from 'react-redux'
import EditTaskForm from './EditTaskForm'
import CachedIcon from '@mui/icons-material/Cached'
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { allIconsArray } from './AllIcons'

import ConfirmDialog from './ConfirmDialog'
import { useTranslation } from 'react-i18next'

const Task = ({ ...props }) => {
	const { t, i18n } = useTranslation()
	const dispatch = useDispatch()
	const [isChecked, setIsChecked] = useState(props.completed ? true : false)
	const [showEditForm, setShowEditForm] = useState(false)
	const [isHover, setIsHover] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const handleClose = () => {
		setIsOpen(false)
	}
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

	const icon = allIconsArray.filter(
		(iconObj) => iconObj.id === parseInt(props.icon)
	)[0].icon
	const handleDelete = () => {
		setIsOpen(false)
		dispatch(setNotification(`Task ${props.name} deleted`, 2))
		dispatch(deleteTask(props.id))
	}
	const priorityMap = {
		high: 'bg-red-500',
		medium: 'bg-yellow-500',
		low: 'bg-green-500',
	}
	return (
		<div>
			<div
				className='flex flex-row items-center mt-5'
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
			>
				<div className='w-[30px]'>
					<input
						className={`${
							isChecked && 'text-orange-200'
						} accent-orange-300 w-5 h-5`}
						type='checkbox'
						checked={isChecked}
						onChange={handleCheckboxChange}
					/>
				</div>
				<div
					className={`flex-1 flex flex-row justify-between items-center bg-white rounded-2xl ${
						isHover ? 'box' : ''
					} ${isChecked ? 'opacity-70' : ''}`}
				>
					<div className='flex flex-row items-center'>
						<div className='m-3 w-9 h-9 text-white bg-orange-500 shadow-sm border border-slate-50 flex items-center justify-center rounded-lg '>
							{icon}
						</div>
						<div className='flex flex-col relative self-start  overflow:auto   w-[450px]'>
							<h2
								className={`${
									isChecked
										? "after:absolute after:top-1/2 after:translate-y-1/2 after:left-0 after:w-full after:content-[''] after:h-[1px] after:bg-black"
										: ''
								} text-slate-700 relative break-words p-[1px] pr-3 pl-3 font-semibold text-lg max-w-fit  z-30 top-[-1px] left-[-10px]  rounded-xl`}
							>
								{props.name}
							</h2>
							<p
								className={`break-words p-[1px] pr-2 pl-2 text-gray-400 ml-2 top-[23px]  left-0 w-[430px] z-20 $  rounded-xl`}
							>
								{props.project.name}
							</p>
						</div>
					</div>

					<div className='flex flex-row justify-between mr-10 gap-30'>
						<div className='flex flex-row justify-between text-gray-400 ml-1 font-semibold flex-1 w-[300px]'>
							<div className=' flex flex-row'>
								{props.completed ? (
									<div>
										<PublishedWithChangesIcon /> {t('Completed')}
									</div>
								) : (
									<div>
										<CachedIcon />
										{t('In Progress')}
									</div>
								)}
							</div>

							<div className='flex items-center flex-1 ml-10'>
								<div
									className={`w-2 h-2 rounded-full ${
										priorityMap[props.priority]
									} mr-1`}
								></div>
								{t(
									props.priority.charAt(0).toUpperCase() +
										props.priority.slice(1)
								)}
							</div>
						</div>
						<div className='flex flex-row justify-between gap-3'>
							<div
								onClick={() => setShowEditForm(true)}
								className='text-orange-500 bg-orange-100 rounded-xl p-1 hover:bg-blue-100 transition-all ease-out duration-200'
							>
								<EditIcon />
							</div>

							<div
								onClick={() => setIsOpen(true)}
								className='p-1 rounded-xl hover:bg-blue-100 transition-all ease-out duration-200'
							>
								<DeleteOutlineIcon />
							</div>
						</div>
					</div>
				</div>
			</div>
			{showEditForm && (
				<EditTaskForm onClose={() => setShowEditForm(false)} {...props} />
			)}
			{isOpen && (
				<ConfirmDialog
					isOpen={isOpen}
					onClose={handleClose}
					onConfirm={handleDelete}
					message={`${t('Are you sure you want to delete Task')} "${
						props.name
					}"?`}
				/>
			)}
		</div>
	)
}

export default Task

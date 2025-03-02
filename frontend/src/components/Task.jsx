import { useState } from 'react'
import { updateTask, deleteTask } from '../reducers/taskReducer'
import { useDispatch } from 'react-redux'
import EditTaskForm from './EditTaskForm'
import CachedIcon from '@mui/icons-material/Cached'
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { allIconsArray } from './AllIcons'

const Task = ({ ...props }) => {
	const dispatch = useDispatch()
	const [isChecked, setIsChecked] = useState(props.completed ? true : false)
	const [showEditForm, setShowEditForm] = useState(false)
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
		if (window.confirm(`Are you sure you want to delete task ${props.name}?`)) {
			dispatch(deleteTask(props.id))
		}
	}
	const priorityMap = {
		high: 'bg-red-500',
		medium: 'bg-yellow-500',
		low: 'bg-green-500',
	}
	return (
		<div>
			<div className='flex flex-row items-center mt-5'>
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
				<div className='flex-1 flex flex-row justify-between items-center bg-white rounded-2xl box'>
					<div className='flex flex-row items-center w-[20%]'>
						<div className='ml-3 mr-3 w-9 h-9 text-white bg-orange-500 shadow-sm border border-slate-50 flex items-center justify-center rounded-lg '>
							{icon}
						</div>
						<div className='flex flex-col'>
							<h2 className='font-bold text-lg'>{props.name}</h2>
							<p className='text-gray-400 ml-1'>{props.project.name}</p>
						</div>
					</div>

					<div className='flex flex-row justify-between mr-10 gap-30'>
						<div className='flex flex-row justify-between text-gray-400 ml-1 font-bold flex-1 w-[300px]'>
							<div className=' flex flex-row'>
								{props.completed ? (
									<div>
										<PublishedWithChangesIcon /> Completed
									</div>
								) : (
									<div>
										<CachedIcon />
										In Progress
									</div>
								)}
							</div>

							<div className='flex items-center flex-1 ml-10'>
								<div
									className={`w-2 h-2 rounded-full ${
										priorityMap[props.priority]
									} mr-1`}
								></div>
								{props.priority.charAt(0).toUpperCase() +
									props.priority.slice(1)}
							</div>
						</div>
						<div className='flex flex-row justify-between gap-3'>
							<div
								onClick={() => setShowEditForm(true)}
								className='text-orange-500 bg-orange-100 rounded-lg'
							>
								<EditIcon />
							</div>

							<div onClick={handleDelete} className=''>
								<DeleteOutlineIcon />
							</div>
						</div>
					</div>
				</div>
			</div>
			{showEditForm && (
				<EditTaskForm onClose={() => setShowEditForm(false)} {...props} />
			)}
		</div>
	)
}

export default Task


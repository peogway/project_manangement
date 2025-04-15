import { useState, useRef, useEffect } from 'react'
import { deleteProject } from '../reducers/prjReducer'
import ProgressBar from './ProgressBar'

import { useDispatch } from 'react-redux'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { getIconComponent } from './AllIcons'
import CategoryList from './CategoryList'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { setNotification } from '../reducers/notiReducer'
import ConfirmDialog from './ConfirmDialog'

const ProjectLabel = ({
	project,
	setProjectToEdit,
	setIconId,
	setProjectToAddTask,
}) => {
	const dispatch = useDispatch()
	const [showFeatures, setShowFeatures] = useState(false)
	const [isMouseDown, setIsMouseDown] = useState(false)
	const featuresRef = useRef(null)
	const [isHover, setIsHover] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const completedPercentage =
		project.tasks.length === 0
			? 0
			: Math.floor(
					(project.tasks.filter((task) => task.completed).length /
						project.tasks.length) *
						100
			  )

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (featuresRef.current && !featuresRef.current.contains(event.target)) {
				setShowFeatures(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [showFeatures])

	const handleMouseDown = (e) => {
		e.stopPropagation()
		setIsMouseDown(true) // Track that mouse is down
	}

	const handleMouseUp = (e) => {
		e.stopPropagation()

		setIsMouseDown(false) // Reset on mouseup
	}
	const handleClick = (e) => {
		e.stopPropagation()
		if (!isMouseDown) {
			setShowFeatures((prev) => !prev) // Only toggle if mouseup didn’t happen right after mousedown
		}
	}
	const priorityMap = {
		high: 'bg-red-500',
		medium: 'bg-yellow-500',
		low: 'bg-green-500',
	}
	const handleClose = () => {
		setIsOpen(false)
	}
	const handleDelete = (e) => {
		e.stopPropagation()
		setIsOpen(false)
		dispatch(deleteProject(project.id))
		dispatch(setNotification(`Project ${project.name} deleted`, 2))
	}
	const projectFeatures = () => {
		return (
			<div
				ref={featuresRef}
				className='flex flex-col bg-white rounded-2xl p-2 z-1000 gap-2 showdow-md box absolute right-0 top-[50px] mr-4'
			>
				<div
					onClick={(e) => {
						e.stopPropagation()
						setProjectToEdit(project)
						setIconId(parseInt(project.icon))
						setShowFeatures(false)
						setIsHover(false)
					}}
					className='edit-category-btn flex w-30 h-12   rounded-xl gap-2 pl-2  transition duration-200 ease-out hover:bg-blue-200 items-center'
				>
					<div className='text-orange-500 bg-orange-100 rounded-lg self-center'>
						<EditIcon />
					</div>
					<p>Edit</p>
				</div>
				<div
					onClick={(e) => {
						e.stopPropagation()
						setIsOpen(true)
						setShowFeatures(false)
					}}
					// onClick={handleClick}
					className='delete-category-btn flex w-30 h-12  rounded-xl gap-2 pl-2 transition duration-200 ease-out hover:bg-blue-200 items-center'
				>
					<DeleteOutlineIcon />
					<div>Delete</div>
				</div>
			</div>
		)
	}

	const completedTasks = project.tasks.filter((task) => task.completed)

	return (
		<div
			className={`bg-white rounded-2xl w-[300px] h-[335px] flex flex-col relative cursor-pointer ${
				isHover ? 'box' : ''
			} mt-5`}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
		>
			<div className='flex flex-row justify-between items-center relative p-3'>
				<div className='flex items-center justify-center rounded-xl ] ml-[8px] left-0  top-[px]'>
					{getIconComponent(
						parseInt(project.icon),
						'text-white',
						'w-12 h-12',
						'bg-orange-500',
						'p-1'
					)}
				</div>

				<div className='flex flex-col gap-1 ] left-[65px] top-[5px]'>
					<h1 className='p-2 font-semibold text-slate-700 text-xl whitespace-nowrap overflow-hidden text-ellipsis w-[180px]'>
						{project.name}
					</h1>
				</div>

				<div
					className=' right-0 top-[30px] mr-2'
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onClick={handleClick}
					disabled={showFeatures}
				>
					<MoreVertIcon fontSize='large' />
				</div>
			</div>
			{/* <div className='flex flex-row justify-between items-center'>
			</div> */}
			{showFeatures && projectFeatures()}
			{/* <p style={{ color: 'gray' }}>Projects</p> */}
			<div className='absolute top-[80px] left-[40px]'>
				{project.tasks.length === 0 ? (
					<div className='relative text-gray-400'>
						<button
							className='top-4 left-22 absolute hover:text-orange-500 '
							onClick={(e) => {
								e.stopPropagation()
								setProjectToAddTask(project)
							}}
						>
							<LibraryAddIcon fontSize='large' />
						</button>
						<p className='flex whitespace-nowrap left-[35px] top-14 absolute'>
							No tasks created yet...
						</p>
					</div>
				) : (
					<ul className='list-none  '>
						{[...project.tasks].reverse().map(
							(task, index) =>
								index < 3 && (
									<li
										key={task.id}
										className={` whitespace-nowrap  overflow-hidden text-ellipsis text-gray-500 w-[200px] 
											 rounded-sm relative pl-1 pr-1 pt-0.5 pb-0.5  rounded-xl `}
									>
										<span
											className={`absolute left-0 top-1/2 transform  translate-y-[-1px] w-1.5 h-1.5 rounded-full ${
												priorityMap[task.priority]
											}`}
										></span>
										<label className='ml-2'>{task.name}</label>
									</li>
								)
						)}
					</ul>
				)}
			</div>
			{project.tasks.length > 3 && (
				<div className='absolute top-[170px] left-[20px] text-orange-500'>
					+{project.tasks.length - 3} tasks
				</div>
			)}
			<div className='flex flex-col bottom-17 absolute right-0 left-0 gap-2 mb-4'>
				<div className='w-[90%] self-center'>
					<ProgressBar progress={completedPercentage} />
				</div>
				<div className='flex flex-row justify-between w-[90%] self-center'>
					<div className='text-gray-400'>
						{completedPercentage < 100 ? 'On Progress' : 'Completed'}{' '}
					</div>
					<div className='text-gray-400'>
						{completedTasks.length}/{project.tasks.length}
					</div>
				</div>
			</div>
			<div className='absolute bottom-0'>
				<CategoryList categories={project.categories} />
			</div>
			{isOpen && (
				<ConfirmDialog
					isOpen={isOpen}
					onClose={handleClose}
					onConfirm={handleDelete}
					message={`Are you sure you want to delete Project "${project.name}"?`}
				/>
			)}
		</div>
	)
}

export default ProjectLabel

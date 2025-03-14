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

	const completedPercentage =
		project.tasks.length === 0
			? 100
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
	const projectFeatures = () => {
		const handleDelete = (e) => {
			e.stopPropagation()
			setShowFeatures(false)
			if (
				window.confirm(
					`Are you sure you want to delete project ${project.name}?`
				)
			)
				dispatch(deleteProject(project.id))
		}

		return (
			<div
				ref={featuresRef}
				className='flex flex-col bg-white rounded-2xl p-2 z-1000 gap-2 showdow-md box absolute right-0 top-[70px] mr-4'
			>
				<div
					// onClick={() => {
					// 	setProjectToEdit(project)
					// 	setIconId(parseInt(project.icon))
					// 	setShowFeatures(false)
					// }}

					onClick={(e) => {
						e.stopPropagation()
						setProjectToEdit(project)
						setIconId(parseInt(project.icon))
						setShowFeatures(false)
					}}
					className='edit-category-btn flex w-30 h-12   rounded-xl gap-2 pl-2  transition duration-200 ease-out hover:bg-blue-200 items-center'
				>
					<div className='text-orange-500 bg-orange-100 rounded-lg self-center'>
						<EditIcon />
					</div>
					<p>Edit</p>
				</div>
				<div
					onClick={handleDelete}
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
		<div className='bg-white rounded-2xl w-[300px] h-[300px] flex flex-col relative cursor-pointer'>
			<div className='flex flex-row justify-between items-center relative'>
				<div className='flex items-center justify-center rounded-xl absolute ml-[8px] left-0  top-[35px]'>
					{getIconComponent(
						parseInt(project.icon),
						'text-white',
						'w-12 h-12',
						'bg-orange-500',
						'p-1'
					)}
				</div>

				<div className='flex flex-col gap-1 absolute left-[65px] top-[5px]'>
					<h1 className='p-2 font-bold text-xl whitespace-nowrap overflow-hidden hover:w-auto hover:overflow-visible w-[180px] hover:bg-white hover:rounded-xl hover:z-900 hover:'>
						{project.name}
					</h1>
					<div className=''>
						<CategoryList categories={project.categories} />
					</div>
				</div>

				<div
					className='absolute right-0 top-[30px] mr-2'
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
			<div className='absolute top-[120px] left-[40px]'>
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
						{project.tasks.map(
							(task, index) =>
								index < 3 && (
									<li
										key={task.id}
										className={` whitespace-nowrap text-gray-500 overflow-hidden w-[200px] hover:overflow-visible 
												hover:w-auto rounded-sm hover:z-999 relative hover:bg-gray-100  hover:pr-10 pl-1 pr-1 pt-0.5 pb-0.5  rounded-xl `}
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
				<div className='absolute top-[210px] left-[20px] text-orange-500'>
					+{project.tasks.length - 3} tasks
				</div>
			)}
			<div className='flex flex-col bottom-0 absolute right-0 left-0 gap-2 mb-4'>
				<div className='w-[95%] self-center'>
					<ProgressBar progress={completedPercentage} />
				</div>
				<div className='flex flex-row justify-between w-[95%] self-center'>
					<div className='text-gray-400'>
						{completedPercentage < 100 ? 'On Progress' : 'Completed'}{' '}
					</div>
					<div className='text-gray-400'>
						{completedTasks.length}/{project.tasks.length}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProjectLabel

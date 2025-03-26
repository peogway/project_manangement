import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Task from './Task'
import TaskForm from './TaskForm'
import { setAllTasks } from '../reducers/taskReducer'
import { setAllProject } from '../reducers/prjReducer'
import SortDropdown from './SortDropDown'
import ProgressBar from './ProgressBar'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import IconsWindow from './IconsWindow'
import { useField } from '../hooks/hook'
import SearchIcon from '@mui/icons-material/Search'
import { allIconsArray } from './AllIcons'
import SplitscreenIcon from '@mui/icons-material/Splitscreen'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'

import ProjectsDropDown from './ProjectsDropdown'
const Tasks = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const [selectedProject, setSelectedProject] = useState(
		location.state?.project ? location.state?.project : null
	)

	const [taskStatus, setTaskStatus] = useState(
		location.state?.taskStatus ? location.state?.taskStatus : false
	)
	const [sortValue, setSortValue] = useState('newest')
	const [showAddTask, setShowAddTask] = useState(false)
	const [showIconsMenu, setShowIconsMenu] = useState(false)
	const [iconId, setIconId] = useState(1)
	const { remove: rmSearch, ...search } = useField('text')
	const [openProjectsDropDown, setOpenProjectsDropDown] = useState(false)
	const headerRef = useRef(null)
	const [render, setRender] = useState(0)

	useEffect(() => {
		document.title = 'Tasks'
		dispatch(setAllTasks())
		dispatch(setAllProject())
	}, [])
	useEffect(
		() =>
			setTaskStatus(
				location.state?.taskStatus ? location.state?.taskStatus : false
			),
		[selectedProject]
	)
	useEffect(() => {
		setRender(render + 1)
	}, [search.value, selectedProject])

	const tasks = useSelector((state) => state.tasks)

	const projects = useSelector((state) => state.projects)

	const tasksToShow =
		selectedProject === null
			? tasks
			: tasks.filter((task) => task.project.name === selectedProject.name)
	const priorityOrder = { high: 3, medium: 2, low: 1 }
	let sortedTasks
	if (sortValue === 'A-Z') {
		sortedTasks = [...tasksToShow].sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortValue === 'Z-A') {
		sortedTasks = [...tasksToShow].sort((a, b) => b.name.localeCompare(a.name))
	} else if (sortValue === 'newest') {
		sortedTasks = [...tasksToShow].sort(
			(a, b) => new Date(b.createAt) - new Date(a.createAt)
		)
	} else if (sortValue === 'oldest') {
		sortedTasks = [...tasksToShow].sort(
			(a, b) => new Date(a.createAt) - new Date(b.createAt)
		)
	} else if (sortValue === 'increasing') {
		sortedTasks = [...tasksToShow].sort(
			(a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
		)
	} else {
		sortedTasks = [...tasksToShow].sort(
			(a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
		)
	}

	const completedTasks = sortedTasks.filter((task) => task.completed === true)
	const uncompletedTasks = sortedTasks.filter(
		(task) => task.completed === false
	)

	const showTasks =
		taskStatus === null
			? sortedTasks.filter((task) => task.name.includes(search.value))
			: taskStatus === true
			? completedTasks.filter((task) => task.name.includes(search.value))
			: uncompletedTasks.filter((task) => task.name.includes(search.value))

	const toggleAddTask = () => {
		setShowAddTask(!showAddTask)
	}

	const icon =
		selectedProject === null
			? { icon: <SplitscreenIcon /> }
			: allIconsArray.filter(
					(icon) => icon.id === parseInt(selectedProject.icon)
			  )[0]

	const taskDuplicate = (name) =>
		tasksToShow.some((task) => task.name.toLowerCase() === name.toLowerCase())
	return (
		<div className='flex flex-col w-full h-screen z-900 flex-1 '>
			<div
				className='flex flex-row justify-between items-center z-990 bg-white  min-h-[100px] self-end rounded-2xl box fixed left-[90px] right-0'
				ref={headerRef}
			>
				<div className='flex flex-row items-center justify-center'>
					<div className='mb-2 ml-4 mr-2 w-9 h-9 text-orange-500 bg-orange-300 shadow-sm border border-slate-50 flex items-center justify-center rounded-lg'>
						{icon.icon}
					</div>
					<div className='flex flex-col items-start relative'>
						<div
							className='font-semibold text-xl select-none cursor-pointer flex flex-row justify-between relative  '
							onMouseDown={(e) => {
								if (e.target === e.currentTarget) {
									// Only prevent default if clicking on the div itself, not text
									e.preventDefault()
								}
								e.stopPropagation()
								setOpenProjectsDropDown(!openProjectsDropDown)
							}}
						>
							<div className='text-slate-800 min-w-[200px] w-[200px] p-2 whitespace-nowrap overflow-hidden text-ellipsis rounded-xl absolute top-[-10px]  left-[-7px]'>
								{selectedProject === null
									? 'All Projects'
									: selectedProject.name}
							</div>
							<div className='absolute left-50 top-[-3px]'>
								<KeyboardArrowDownIcon />
							</div>
						</div>
						<div className='mt-0 absolute top-[-30px] left-[-60px]'>
							<ProjectsDropDown
								openProjectsDropDown={openProjectsDropDown}
								setOpenProjectsDropDown={setOpenProjectsDropDown}
								setChosenProject={setSelectedProject}
								chosenProject={selectedProject}
								allProjects={projects}
								showAllProject={true}
							/>
						</div>
						<div className='flex felx-row items-center gap-2 mt-7'>
							<ProgressBar
								progress={
									tasksToShow.length === 0
										? 0
										: Math.floor(
												(completedTasks.length / tasksToShow.length) * 100
										  )
								}
								color='bg-orange-400'
								height='h-1'
								className='w-[200px] max-w-md'
							/>
							<p className='w-[30px]'>
								{tasksToShow.length === 0
									? 0
									: (
											(completedTasks.length / tasksToShow.length) *
											100
									  ).toFixed(0)}
								%
							</p>
						</div>
					</div>
					<button
						onClick={toggleAddTask}
						className={`w-25 h-7 ml-10 bg-orange-400 select-none rounded-lg text-white ${
							selectedProject === null ? 'opacity-40' : ''
						}`}
						disabled={selectedProject === null}
					>
						+ Add New
					</button>
				</div>

				<div className='ml-auto items-center mr-20 flex'>
					<p className='font-semibold text-slate-700'>Sort</p>
					<div className='flex text-slate-700 justify-center items-center'>
						<FilterAltIcon fontSize='small' />
					</div>
					<SortDropdown
						sortTasks={true}
						sortByDate={true}
						setSortValue={setSortValue}
						initlaValue='newest'
					/>
				</div>
			</div>

			<div
				className={`top-[${
					headerRef.current?.offsetHeight !== undefined
						? `${headerRef.current?.offsetHeight}`
						: //   `200`
						  '100'
				}px] relative  overflow-auto w-[calc(100vw-100px)] max-h-[calc(100vh-130px)] left-[40px] pt-5 ml-15`}
			>
				{selectedProject !== null && selectedProject.categories.length != 0 && (
					<div className='flex-wrap ml-3 mr-2 flex flex-row gap-2 w-auto max-w-[1100px] self-start pb-3'>
						{selectedProject.categories.map((cate) => (
							<div
								key={cate.id}
								className='border-1 rounded-2xl p-1 bg-gray-200 flex flex-row justify-between gap-5'
							>
								<label className='flex flex-row gap-5 whitespace-nowrap '>
									{cate.name}
								</label>
							</div>
						))}
					</div>
				)}
				<div className='flex rounded-lg  self-start ml-10 mt-5'>
					<div className='border-b-2 border-orange-400 pl-1 pr-0.5'>
						<SearchIcon />
					</div>
					<input
						{...search}
						placeholder='Search a task'
						className='border-b-2 border-gray-200 pl-1 focus:outline-none'
					/>
				</div>
				<div className='ml-7 mt-10 '>
					<div className='flex flex-row gap-5 select-none'>
						<div
							className={`flex ${taskStatus !== null && 'opacity-40 '} ${
								taskStatus === null && 'text-orange-500'
							}`}
							onClick={() => setTaskStatus(null)}
						>
							<button className='font-semibold'>All</button>
							<div className='flex bg-gray-400 text-white w-5 h-5 justify-center items-center self-center ml-1'>
								{sortedTasks.length}
							</div>
						</div>

						<div
							className={`flex ${taskStatus !== false && 'opacity-40 '} ${
								taskStatus === false && 'text-orange-500'
							}`}
							onClick={() => setTaskStatus(false)}
						>
							<button className='font-semibold'>On Going Tasks</button>
							<div className='flex bg-gray-400 text-white w-5 h-5 justify-center items-center self-center ml-1'>
								{uncompletedTasks.length}
							</div>
						</div>

						<div
							className={`flex ${taskStatus !== true && 'opacity-40 '} ${
								taskStatus === true && 'text-orange-500'
							}`}
							onClick={() => setTaskStatus(true)}
						>
							<button className='font-semibold'>Completed Tasks</button>
							<div className='flex bg-gray-400 text-white w-5 h-5 justify-center items-center self-center ml-1'>
								{completedTasks.length}
							</div>
						</div>
					</div>
					<div className='ml-5 mt-5 w-[95%]  pb-10'>
						{showTasks.length === 0 && (
							<div className='relative w-full h-[200px]'>
								<div className='top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute p-20 z-200 text-slate-400 text-center flex items-center'>
									<div className=' mr-2'>
										<DoNotDisturbAltIcon />
									</div>
									<p>No tasks</p>
								</div>
							</div>
						)}
						{showTasks.map((task) => (
							<div key={task.id}>
								<Task
									{...task}
									selectedProject={selectedProject}
									taskDuplicate={taskDuplicate}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
			{showAddTask && (
				<TaskForm
					onClose={() => setShowAddTask(false)}
					projects={projects}
					selectedProject={selectedProject}
					setIconId={setIconId}
					iconId={iconId}
					setShowIconsMenu={setShowIconsMenu}
					taskDuplicate={taskDuplicate}
				/>
			)}

			<IconsWindow
				onClose={() => setShowIconsMenu(false)}
				iconId={iconId}
				setIconId={setIconId}
				show={showIconsMenu}
			/>
		</div>
	)
}

export default Tasks

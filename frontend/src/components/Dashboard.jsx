import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setAllCategories } from '../reducers/categoryReducer'
import { setAllProject } from '../reducers/prjReducer'
import { setAllTasks } from '../reducers/taskReducer'
import { getIconComponent } from './AllIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import { faBarsProgress } from '@fortawesome/free-solid-svg-icons'
import { faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'

import ProjectForm from './ProjectForm'
import ProgressBar from './ProgressBar'
import IconsWindow from './IconsWindow'

const Dashboard = ({ user }) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [showAddProject, setShowAddProject] = useState(false)
	const [iconId, setIconId] = useState(1)
	const [showIconsMenu, setShowIconsMenu] = useState(false)

	useEffect(() => {
		document.title = 'Dashboard'
		dispatch(setAllCategories())
		dispatch(setAllProject())
		dispatch(setAllTasks())
	}, [])

	const projects = useSelector((state) => state.projects)
	const categories = useSelector((state) => state.categories)
	const tasks = useSelector((state) => state.tasks)

	return (
		<div className='z-999 flex flex-row h-screen flex-1 overflow-auto left-[60px] max-w-[calc(100vw-60px)]  relative'>
			<div className='min-h-[100px] left-[20px] right-0 box flex flex-row justify-between items-center z-990 bg-white rounded-2xl absolute  '>
				<div className='flex flex-row justify-between items-center w-full'>
					<div className='flex flex-col'>
						<div className=''>Hello, {user.name}</div>
						<div className=''> welcom back</div>
					</div>
					<div className='flex gap-3'>
						<div className=''>search</div>
						<div className=''>avt</div>
					</div>
				</div>
			</div>

			{/* General stats */}
			<div
				className='absolute flex flex-row gap-7 p-3 
			top-[120px] right-[300px] left-[30px] bg-white rounded-xl box'
			>
				<div
					className='bg-orange-500  items-center text-white p-2 flex flex-row flex-1/3 rounded-2xl cursor-pointer select-none'
					onClick={() => {
						navigate('/projects')
					}}
				>
					<div className='flex w-full justify-between items-center'>
						<div className='flex flex-col items-start	ml-5'>
							<div className='font-bold text-[20px]'>{projects.length}</div>
							<div className='text-white text-[15px]'>Projects</div>
						</div>
					</div>
					<div className='bg-white mr-6 text-orange-500 rounded-full w-10 h-8 flex items-center justify-center'>
						<FontAwesomeIcon icon={faDiagramProject} />
					</div>
				</div>

				<div
					className='bg-orange-500  items-center text-white p-2 flex flex-row flex-1/3 rounded-2xl cursor-pointer select-none'
					onClick={() => {
						navigate('/tasks')
					}}
				>
					<div className='flex w-full justify-between items-center'>
						<div className='flex flex-col items-start ml-5'>
							<div className='font-bold text-[20px]'>
								{tasks.filter((task) => task.completed).length}
							</div>
							<div className='text-white text-[15px]'>Tasks Completed</div>
						</div>
					</div>
					<div className='bg-white mr-6 text-orange-500 rounded-full w-10 h-8 flex items-center justify-center'>
						<FontAwesomeIcon icon={faListCheck} />
					</div>
				</div>

				<div
					className='bg-orange-500  items-center text-white p-2 flex flex-row flex-1/3 rounded-2xl cursor-pointer select-none'
					onClick={() => {
						navigate('/categories')
					}}
				>
					<div className='flex w-full ml-5 justify-between items-center'>
						<div className='flex flex-col items-start'>
							<div className='font-bold text-[20px]'>{categories.length}</div>
							<div className='text-white text-[15px]'>Categories</div>
						</div>
					</div>
					<div className='bg-white mr-6 text-orange-500 rounded-full w-10 h-8 flex items-center justify-center'>
						<FontAwesomeIcon icon={faLayerGroup} />
					</div>
				</div>
			</div>

			{/* Overall Progress */}
			<div className='absolute right-0 top-[120px] bg-white w-[270px]  h-[200px] box rounded-2xl flex items-center justify-center'>
				<div className='flex flex-col justify-between items-center'>
					<div className='font-bold '>Overall Progress</div>
					<div className='w-27 h-27 rounded-full bg-orange-500 flex justify-center items-center mt-4'>
						<div className='flex flex-col items-center justify-between'>
							<div className='font-bold text-[19px] text-white'>
								{tasks.length === 0
									? 0
									: Math.floor(
											(tasks.filter((task) => task.completed).length /
												tasks.length) *
												100
									  )}
								%
							</div>
							<div className='text-white text-[14px]'>Progress</div>
						</div>
					</div>
				</div>
			</div>

			{/* Latest Projects */}
			<div className='pb-10 absolute right-0 top-[340px] w-[270px] h-auto min-h-[100px] rounded-2xl flex flex-col box p-1'>
				<div className='flex items-center justify-between p-4 w-full '>
					<div className='font-bold'>Latest Projects</div>
					<div
						className='bg-orange-500 select-none cursor-pointer text-white p-2 whitespace-nowrap rounded-xl '
						onClick={() => setShowAddProject(true)}
					>
						+ Add New
					</div>
				</div>
				<div className='flex flex-col gap-7 p-2 '>
					{[...projects].reverse().map((project) => (
						<div
							key={project.id}
							className='rounded-xl bg-slate-100 p-2 flex flex-col w-full'
							onClick={(e) => {
								navigate('/tasks', {
									state: { project: project },
								})
							}}
						>
							<div className='flex p-1 gap-1'>
								<div className='flex justify-center items-center'>
									{getIconComponent(
										project.icon,
										'text-white',
										'text-[15px]',
										'bg-orange-500',
										'p-[2px]'
									)}
								</div>
								<div className='text-slate-500'>{project.name}</div>
							</div>

							<div className='flex w-full justify-between items-center text-slate-500 mt-4'>
								<div className='flex gap-1 text-slate-500 items-center justify-center'>
									<FontAwesomeIcon icon={faBarsProgress} />

									<p className='self-start'>Progress</p>
								</div>
								<div className=''>
									{project.tasks.filter((task) => task.completed).length}/
									{project.tasks.length}
								</div>
							</div>

							<div className='mt-2 mb-2'>
								<ProgressBar
									progress={
										project.tasks.length === 0
											? 0
											: Math.floor(
													(project.tasks.filter((task) => task.completed)
														.length /
														project.tasks.length) *
														100
											  )
									}
									height='h-1'
									bgColor='bg-gray-300'
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Project Form */}
			{showAddProject && (
				<ProjectForm
					categories={categories}
					onClose={() => setShowAddProject(false)}
					setIconId={setIconId}
					iconId={iconId}
					setShowIconsMenu={setShowIconsMenu}
					projectUnique={(prjName) =>
						projects.some(
							(prj) => prj.name.toLowerCase() === prjName.toLowerCase()
						)
					}
				/>
			)}

			{/* Icons Window */}
			<IconsWindow
				onClose={() => setShowIconsMenu(false)}
				iconId={iconId}
				setIconId={setIconId}
				show={showIconsMenu}
			/>
		</div>
	)
}

export default Dashboard

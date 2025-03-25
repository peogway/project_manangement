import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllProject } from '../reducers/prjReducer'
import { setAllCategories } from '../reducers/categoryReducer'
import { useField } from '../hooks/hook'
import { useLocation, useNavigate } from 'react-router-dom'

import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SortDropdown from './SortDropDown'
import ProjectForm from './ProjectForm'
import ProjectLabel from './ProjectLabel'
import EditProjectForm from './EditProjectForm'
import TaskForm from './TaskForm'
import CubePlus from './CubePlus'

import IconsWindow from './IconsWindow'
import SearchIcon from '@mui/icons-material/Search'
import CircularChart from './CircularChart'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import CloseIcon from '@mui/icons-material/Close'
import DropDown from './DropDown'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import { getIconComponent } from './AllIcons'

const Projects = () => {
	const dispatch = useDispatch()
	const [showAddProject, setShowAddProject] = useState(false)
	const [sortValue, setSortValue] = useState('newest')
	const { remove: rmSearch, ...search } = useField('text')
	const [percent, setPercent] = useState({ initial: null, after: null })
	const [showIconsMenu, setShowIconsMenu] = useState(false)
	const [projectToEdit, setProjectToEdit] = useState(null)
	const [iconId, setIconId] = useState(1)
	const [render, setRender] = useState(0)
	const [projectToAddTask, setProjectToAddTask] = useState(null)
	const [categoryNames, setCategoryNames] = useState([])
	const location = useLocation()
	const [resCates, setResCates] = useState(
		location.state?.cates ? location.state?.cates : []
	)
	const navigate = useNavigate()

	const [isFilter, setIsFilter] = useState(false)

	useEffect(() => {
		document.title = 'Projects'
		dispatch(setAllProject())
		dispatch(setAllCategories())
	}, [])

	useEffect(() => {
		setRender(render + 1)
	}, [search.value])

	const projects = useSelector((state) => state.projects)
	const categories = useSelector((state) => state.categories)

	useEffect(() => {
		setCategoryNames(
			() =>
				categories
					?.map((category) => category.name)
					.sort((a, b) => a.localeCompare(b))
					.filter(
						(cateName) => !resCates.some((cate) => cate.name === cateName)
					) || []
		)
	}, [categories])

	let sortedProjects = [...projects]
		.filter((project) =>
			resCates.every((cate) =>
				project.categories.some((category) => category.name === cate.name)
			)
		)
		.filter((project) => project.name.includes(search.value))
	if (sortValue === 'A-Z') {
		sortedProjects = [...sortedProjects].sort((a, b) =>
			a.name.localeCompare(b.name)
		)
	} else if (sortValue === 'Z-A') {
		sortedProjects = [...sortedProjects].sort((a, b) =>
			b.name.localeCompare(a.name)
		)
	} else if (sortValue === 'newest') {
		sortedProjects = [...sortedProjects].sort(
			(a, b) => new Date(b.createAt) - new Date(a.createAt)
		)
	} else {
		sortedProjects = [...sortedProjects].sort(
			(a, b) => new Date(a.createAt) - new Date(b.created)
		)
	}

	const projectWithNoUncompletedTasks = projects.filter(
		(project) =>
			project.tasks.filter((task) => task.completed === false).length === 0
	)
	const completedProjects = projectWithNoUncompletedTasks
		.filter((project) => project.tasks.length > 0)
		.reverse()

	const completionPercentage =
		projects.length > 0
			? (projectWithNoUncompletedTasks.length / projects.length) * 100
			: 0

	useEffect(() => {
		setPercent((prev) => ({
			initial: prev.after ?? 0,
			after: completionPercentage ?? 0,
		}))
	}, [completionPercentage])

	const handleSelectCategory = (name) => {
		const foundCate = categories.filter((cate) => cate.name === name)[0]
		if (!resCates.includes(foundCate)) {
			setCategoryNames(categoryNames.filter((cateName) => cateName !== name))
			setResCates(resCates.concat(foundCate))
		}
	}

	return (
		<div className='z-999 flex flex-row h-screen flex-1 overflow-auto left-[60px] max-w-[calc(100vw-60px)]  relative'>
			{/* Contents */}
			<div className='flex flex-col w-[calc(100%-210px)] overflow-auto'>
				{/* Filter and Sort */}
				<div className='flex flex-row justify-between items-center  mt-4'>
					{/* Filter */}
					<div className='flex flex-col ml-4 h-auto self-end'>
						<div className='ml-2 items-cente flex flex-row items-center'>
							<div
								className='flex select-none cursor-pointer hover:bg-slate-200 rounded-xl p-1'
								onClick={() => setIsFilter((prev) => !prev)}
							>
								<div className={`text-gray-600 text-center`}>
									{isFilter ? <FilterAltIcon /> : <FilterAltOffIcon />}
								</div>
								<p className='font-semibold text-gray-600 text-center pr-1'>
									Filter
								</p>
							</div>
							<div className='ml-3 relative'>
								<div className='relative z-900 select-none left-0 w-[100%] h-[110%] overflow-hidden'>
									<div
										// className={`filter relative ${isFilter ? 'filter-open' : ''}`}
										className={` relative ${
											isFilter
												? 'visible translate-x-0 translate-y-0'
												: 'invisible translate-x-[-110%]'
										} transition-all ease-out duration-500`}
									>
										<DropDown
											options={categoryNames}
											onSelect={handleSelectCategory}
											description='Choose categories'
											value={true}
											width='auto'
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Categories to display */}
						<div className='flex flex-row flex-wrap w-[500px] h-auto pt-2 gap-2 pl-5'>
							{resCates.map((cate) => (
								<div
									key={cate.id}
									className='border-1 rounded-2xl p-1 bg-gray-200  flex flex-row justify-between gap-5'
								>
									<label className='flex flex-row gap-5'>{cate.name}</label>
									<div
										onClick={() => {
											setResCates(
												resCates.filter((category) => category.id !== cate.id)
											)
											setCategoryNames(
												categoryNames
													.concat(cate.name)
													.sort((a, b) => a.localeCompare(b))
											)
										}}
									>
										<CloseIcon fontSize='small' />
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Sort */}
					<div className='ml-auto  flex mr-10'>
						<p className='font-semibold text-gray-400'>Sort</p>
						<div className='text-gray-400 mr-6'>
							<FilterAltIcon fontSize='small' />
						</div>
						<SortDropdown
							initlaValue='newest'
							sortByDate={true}
							setSortValue={setSortValue}
						/>
					</div>
				</div>

				{/* My Projects heading and Add button  */}
				<div className='flex flex-row justify-between mb-7 mt-10'>
					{/* Heading */}
					<div className='flex flex-col ml-5'>
						<h1 className='font-semibold text-2xl'>My Projects</h1>
						<p className='ml-3 text-gray-400'>
							{sortedProjects.length} Projects
						</p>
					</div>

					{/* Add button */}
					<button
						onClick={() => setShowAddProject(true)}
						className='w-25 h-7 mr-10 bg-orange-500 select-none rounded-lg text-white'
					>
						+ Add New
					</button>
				</div>

				{/* Search */}
				<div className='flex z-900 rounded-lg ml-5 pb-2'>
					<div className='border-b-2 border-orange-400 pl-1 pr-0.5'>
						<SearchIcon />
					</div>
					<input
						{...search}
						placeholder='Search a project'
						className='border-b-2 border-gray-200 pl-1 pr-1 focus:outline-none'
					/>
				</div>

				{/* Projects to display */}
				<div className='flex gap-4 pl-10  flex-wrap pb-10'>
					{projects.length === 0 && resCates.length === 0 && (
						<div className='flex flex-col items-center justify-center h-full blue w-full mt-7'>
							<div
								className=' scale-150 flex justify-center items-center text-slate-400 hover:text-orange-500 py-5 transition ease-out duration-800'
								onClick={() => setShowAddProject(true)}
							>
								<CubePlus />
							</div>
							<h1 className='text-slate-600 font-semibold text-lg my-1 mt-3 select-none relative z-2'>
								No projects yet...
							</h1>
							<p className='text-slate-400 flex l items-center justify-center p-1 text-center pt-1'>
								Please click button above <br />
								to add your first project.
							</p>
						</div>
					)}
					{sortedProjects.length === 0 && resCates.length > 0 && (
						<div
							style={{
								transform: 'translate(-50%, -50%)',
							}}
							className='top-[50%] left-[50%] fixed p-20 z-999 text-slate-400 text-center flex items-center select-none z-0'
						>
							<div className=' mr-2'>
								<DoNotDisturbAltIcon />
							</div>
							<p>No projects</p>
						</div>
					)}

					{sortedProjects.map((project) => (
						<div
							key={project.id}
							onClick={(e) => {
								if (e.target.tagName !== 'BUTTON')
									navigate('/tasks', {
										state: { project: project },
									})
							}}
							className='mb-4'
						>
							<ProjectLabel
								project={project}
								setIconId={setIconId}
								setProjectToEdit={setProjectToEdit}
								setProjectToAddTask={setProjectToAddTask}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Sidebar */}
			<div className='  bg-white rounded-xl flex flex-col items-center h-[96%] right-0 fixed w-[210px] '>
				<h1 className='font-semibold text-xl mt-6 text-slate-800'>
					Projects Completed
				</h1>
				<CircularChart percent={completionPercentage} />
				<div className='font-semibold mt-15 text-slate-700'>
					{completedProjects.length} Completed
				</div>
				<div className='text-slate-500 mt-1 text-sm'>
					{projects.reduce(
						(total, project) =>
							total + project.tasks.filter((task) => task.completed).length,
						0
					)}{' '}
					Tasks Done
				</div>
				<div className='mt-7 overflow-auto flex flex-col gap-1 w-full ml-5 '>
					{completedProjects.map((project) => (
						<div
							className='flex whitespace-nowrap cursor-pointer rounded-lg hover:bg-blue-100 px-2'
							key={project.id}
							onClick={() =>
								navigate('/tasks', { state: { project: project } })
							}
						>
							<div className='flex justify-center items-center mr-2'>
								{getIconComponent(
									project.icon,
									'text-white',
									'text-[15px]',
									'bg-orange-400',
									'p-1'
								)}
							</div>
							<div className='flex-flex-col overflow-hidden'>
								<div className='font-semibold overflow-hidden w-[80%] whitespace-nowrap text-ellipsis'>
									{project.name}
								</div>
								<div className='text-slate-300 ml-2 '>
									{project.tasks.length} tasks
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

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

			{projectToEdit && (
				<EditProjectForm
					project={projectToEdit}
					categories={categories}
					onClose={() => {
						setProjectToEdit(null)
						setIconId(1)
					}}
					setIconId={setIconId}
					iconId={iconId}
					setShowIconsMenu={setShowIconsMenu}
					setProjectToEdit={setProjectToEdit}
				/>
			)}

			<IconsWindow
				onClose={() => setShowIconsMenu(false)}
				iconId={iconId}
				setIconId={setIconId}
				show={showIconsMenu}
			/>

			{projectToAddTask && (
				<TaskForm
					onClose={() => setProjectToAddTask(null)}
					projects={projects}
					selectedProject={projectToAddTask}
					setIconId={setIconId}
					iconId={iconId}
					setShowIconsMenu={setShowIconsMenu}
				/>
			)}
		</div>
	)
}

export default Projects

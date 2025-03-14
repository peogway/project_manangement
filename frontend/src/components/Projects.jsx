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

	const completedProjects = projects
		.filter(
			(project) =>
				project.tasks.length > 0 &&
				project.tasks.filter((task) => task.completed === false).length === 0
		)
		.reverse()

	const completionPercentage =
		projects.length > 0 ? (completedProjects.length / projects.length) * 100 : 0

	useEffect(() => {
		setPercent((prev) => ({
			initial: prev.after ?? 0,
			after: completionPercentage ?? 0,
		}))
	}, [completionPercentage])

	const setReFetch = () => {
		// window.location.reload()

		setTimeout(() => {
			dispatch(setAllProject())
		}, 100)
	}

	const handleSelectCategory = (name) => {
		const foundCate = categories.filter((cate) => cate.name === name)[0]
		if (!resCates.includes(foundCate)) {
			setCategoryNames(categoryNames.filter((cateName) => cateName !== name))
			setResCates(resCates.concat(foundCate))
		}
	}

	return (
		<div className='z-999 flex flex-row h-screen flex-1 overflow-auto left-[60px] max-w-[calc(100vw-60px)]  relative'>
			<div className='flex flex-col w-[calc(100%-210px)] overflow-auto'>
				<div className='flex flex-row justify-between mt-7 mb-1'>
					<div className='flex z-900 rounded-lg ml-5 '>
						<div className='border-b-2 border-orange-400 pl-1 pr-0.5'>
							<SearchIcon />
						</div>
						<input
							{...search}
							placeholder='Search a project'
							className='border-b-2 border-gray-200 pl-1 pr-1'
						/>
					</div>
					<button
						onClick={() => setShowAddProject(true)}
						className='w-25 h-7 mr-10 bg-orange-500 select-none rounded-lg text-white'
					>
						+ Add New
					</button>
				</div>

				<div className='flex flex-row justify-between mb-7 mt-10'>
					<div className='flex flex-col ml-5'>
						<h1 className='font-bold text-2xl'>My Projects</h1>
						<p className='ml-3 text-gray-400'>
							{sortedProjects.length} Projects
						</p>
					</div>
					<div className='flex flex-col mr-20 h-auto'>
						<div className='ml-auto items-center mr-5 flex'>
							<p className='font-bold text-gray-400'>Sort</p>
							<div className='text-gray-400'>
								<FilterAltIcon fontSize='small' />
							</div>
							<SortDropdown
								initlaValue='newest'
								sortByDate={true}
								setSortValue={setSortValue}
							/>
						</div>

						<div className='ml-auto items-center mr-5 flex pt-2'>
							<p className='font-bold text-gray-400'>Filter by categories</p>
							<div className='text-gray-400 pr-3'>
								<FilterAltOffIcon fontSize='small' />
							</div>
							<DropDown
								options={categoryNames}
								onSelect={handleSelectCategory}
								description='Choose categories'
								value={true}
								width='[300px]'
							/>
						</div>
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
				</div>

				<div className='flex gap-4 pl-10 mt-5  flex-wrap pb-10'>
					{sortedProjects.length === 0 && (
						<div
							style={{
								transform: 'translate(-50%, -50%)',
							}}
							className='top-[50%] left-[50%] fixed p-20 z-999 text-slate-400 text-center flex items-center'
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

			<div className='  bg-white rounded-xl flex flex-col items-center h-[90%] right-0 fixed w-[210px] '>
				<h1 className='font-bold text-xl mt-6'>Projects Completed</h1>
				<CircularChart percent={completionPercentage} />
				<div className='font-bold mt-15'>
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
				<div className='mt-1 overflow-auto flex flex-col gap-1 w-full ml-10 '>
					{completedProjects.map((project) => (
						<div
							className='flex whitespace-nowrap cursor-pointer'
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
									'bg-orange-500',
									'p-1'
								)}
							</div>
							<div className='flex-flex-col overflow-hidden'>
								<div className='font-bold'>{project.name}</div>
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
					setReFetch={setReFetch}
				/>
			)}
		</div>
	)
}

export default Projects

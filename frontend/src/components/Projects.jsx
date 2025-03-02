import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllProject } from '../reducers/prjReducer'
import { setAllCategories } from '../reducers/categoryReducer'
import { useField } from '../hooks/hook'

import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SortDropdown from './SortDropDown'
import ProjectForm from './ProjectForm'
import CertainProject from './CertainProject'
import ProjectLabel from './ProjectLabel'
import EditProjectForm from './EditProjectForm'

import IconsWindow from './IconsWindow'
import SearchIcon from '@mui/icons-material/Search'
import CircularChart from './CircularChart'

const Projects = () => {
	const dispatch = useDispatch()
	const [showAddProject, setShowAddProject] = useState(false)
	const [selectedProject, setSelectedProject] = useState(null)
	const [sortValue, setSortValue] = useState('newest')
	const { remove: rmSearch, ...search } = useField('text')
	const [showIconsMenu, setShowIconsMenu] = useState(false)
	const [projectToEdit, setProjectToEdit] = useState(null)
	const [iconId, setIconId] = useState(1)
	const [render, setRender] = useState(0)

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

	let sortedProjects
	if (sortValue === 'A-Z') {
		sortedProjects = [...projects]
			.sort((a, b) => a.name.localeCompare(b.name))
			.filter((project) => project.name.includes(search.value))
	} else if (sortValue === 'Z-A') {
		sortedProjects = [...projects]
			.sort((a, b) => b.name.localeCompare(a.name))
			.filter((project) => project.name.includes(search.value))
	} else if (sortValue === 'newest') {
		sortedProjects = [...projects]
			.sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
			.filter((project) => project.name.includes(search.value))
	} else {
		sortedProjects = [...projects]
			.sort((a, b) => new Date(a.createAt) - new Date(b.created))
			.filter((project) => project.name.includes(search.value))
	}

	return (
		<div className='z-999 flex flex-row h-screen flex-1 overflow-auto left-[120px] max-w-[calc(100vw-120px)]  relative'>
			<div className='flex flex-col w-[calc(80%-120px)] '>
				<div className='flex flex-row justify-between mt-7 mb-1'>
					<div className='flex z-900 rounded-lg ml-5 '>
						<div className='border-b-2 border-orange-400 pl-1 pr-0.5'>
							<SearchIcon />
						</div>
						<input
							{...search}
							placeholder='Search a project'
							className='border-b-2 border-gray-200 pl-0.5'
						/>
					</div>
					<button
						onClick={() => setShowAddProject(true)}
						className='w-25 h-7 mr-10 bg-orange-500 rounded-lg text-white'
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
				</div>
				<div className='flex gap-15 ml-15 mr-10 flex-wrap pb-10'>
					{sortedProjects.map((project) => (
						<div
							key={project.id}
							onClick={(e) => {
								if (
									e.target.tagName !== 'BUTTON' &&
									!e.target.closest('.edit-form')
								)
									setSelectedProject(project)
							}}
						>
							<ProjectLabel
								project={project}
								setIconId={setIconId}
								setProjectToEdit={setProjectToEdit}
							/>
						</div>
					))}
				</div>
			</div>

			<div className='flex-1  bg-white rounded-xl flex flex-col items-center h-[90%] self-center'>
				<h1 className='font-bold text-xl mt-6'>Projects Completed</h1>
				<CircularChart initial={30} after={30} />
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
			{selectedProject && (
				<CertainProject
					project={selectedProject}
					onClose={() => setSelectedProject(null)}
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

export default Projects

import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllProject } from '../reducers/prjReducer'
import { setAllCategories } from '../reducers/categoryReducer'

import SortDropdown from './sortDropDown'
import ProjectForm from './ProjectForm'
import CertainProject from './CertainProject'
import ProjectLabel from './ProjectLabel'

const Projects = () => {
	const dispatch = useDispatch()
	const [showAddProject, setShowAddProject] = useState(false)
	const [selectedProject, setSelectedProject] = useState(null)
	const [sortValue, setSortValue] = useState('newest')

	useEffect(() => {
		document.title = 'Projects'
		dispatch(setAllProject())
		dispatch(setAllCategories())
	}, [])

	const projects = useSelector((state) => state.projects)
	const categories = useSelector((state) => state.categories)

	let sortedProjects
	if (sortValue === 'A-Z') {
		sortedProjects = [...projects].sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortValue === 'Z-A') {
		sortedProjects = [...projects].sort((a, b) => b.name.localeCompare(a.name))
	} else if (sortValue === 'newest') {
		sortedProjects = [...projects].sort(
			(a, b) => new Date(b.createAt) - new Date(a.createAt)
		)
	} else {
		sortedProjects = [...projects].sort(
			(a, b) => new Date(a.createAt) - new Date(b.created)
		)
	}

	return (
		<div className='z-999'>
			<h1>Projects</h1>
			<p>{sortedProjects.length} Projects</p>

			<button onClick={() => setShowAddProject(true)}>+ Add New</button>
			<SortDropdown setSortValue={setSortValue} initlaValue='newest' />
			{showAddProject && (
				<ProjectForm
					categories={categories}
					onClose={() => setShowAddProject(false)}
				/>
			)}
			{selectedProject && (
				<CertainProject
					project={selectedProject}
					categories={categories}
					onClose={() => setSelectedProject(null)}
				/>
			)}

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
					<ProjectLabel project={project} categories={categories} />
				</div>
			))}
		</div>
	)
}

export default Projects


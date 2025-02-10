import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllProject } from '../reducers/prjReducer'
import { setAllCategories } from '../reducers/categoryReducer'
import ProjectForm from './ProjectForm'
import CertainProject from './CertainProject'
import ProjectLabel from './ProjectLabel'

const Projects = () => {
	const dispatch = useDispatch()
	const [showAddProject, setShowAddProject] = useState(false)
	const [selectedProject, setSelectedProject] = useState(null)

	useEffect(() => {
		document.title = 'Projects'
		dispatch(setAllProject())
		dispatch(setAllCategories())
	}, [])

	const projects = useSelector((state) => state.projects)
	const categories = useSelector((state) => state.categories)
	return (
		<div>
			<h1>Projects</h1>
			<p>{projects.length} Projects</p>

			<button onClick={() => setShowAddProject(true)}>+ Add New</button>
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

			{projects.map((project) => (
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


import { useState, useRef, useEffect } from 'react'
import { deleteProject } from '../reducers/prjReducer'
import ProgressBar from './ProgressBar'
import EditProjectForm from './EditProjectForm'
import { useDispatch } from 'react-redux'

const ProjectLabel = ({ project, categories }) => {
	const dispatch = useDispatch()
	const [showFeatures, setShowFeatures] = useState(false)
	const [showEditForm, setShowEditForm] = useState(false)
	const featuresRef = useRef(null)

	const projectFeatures = () => {
		const handleDelete = () => {
			if (
				window.confirm(
					`Are you sure you want to delete project ${project.name}?`
				)
			)
				dispatch(deleteProject(project.id))
		}

		return (
			<div ref={featuresRef}>
				<button onClick={() => setShowEditForm(true)}>edit</button>
				<br />
				<button onClick={handleDelete}>delete</button>
			</div>
		)
	}
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (featuresRef.current && !featuresRef.current.contains(event.target)) {
				setShowFeatures(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [showFeatures])

	return (
		<div>
			<p>{project.name}</p>
			<button onClick={() => setShowFeatures(true)} disabled={showFeatures}>
				...
			</button>
			{showFeatures && projectFeatures()}
			{/* <p style={{ color: 'gray' }}>Projects</p> */}
			<ProgressBar />
			{project.categories.map((category) => (
				<div key={category.id}>
					<label>{category.name}</label>
				</div>
			))}

			{showEditForm && (
				<EditProjectForm
					project={project}
					categories={categories}
					onClose={() => setShowEditForm(false)}
				/>
			)}
		</div>
	)
}

export default ProjectLabel


import { useState, useRef, useEffect } from 'react'
import { deleteProject } from '../reducers/prjReducer'
import ProgressBar from './ProgressBar'

import { useDispatch } from 'react-redux'

const ProjectLabel = ({ project, setProjectToEdit, setIconId }) => {
	const dispatch = useDispatch()
	const [showFeatures, setShowFeatures] = useState(false)

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
				<button
					onClick={() => {
						setProjectToEdit(project)
						setIconId(parseInt(project.icon))
					}}
				>
					edit
				</button>
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
		<div className='bg-white rounded-2xl w-[200px] h-[200px]'>
			<p>{project.name}</p>
			<button onClick={() => setShowFeatures(true)} disabled={showFeatures}>
				...
			</button>
			{showFeatures && projectFeatures()}
			{/* <p style={{ color: 'gray' }}>Projects</p> */}
			<ProgressBar
				progress={
					project.tasks.length === 0
						? 0
						: project.tasks.filter((task) => task.completed).length /
						  project.tasks.length
				}
			/>
			{project.categories.map((category) => (
				<div key={category.id}>
					<label>{category.name}</label>
				</div>
			))}
		</div>
	)
}

export default ProjectLabel


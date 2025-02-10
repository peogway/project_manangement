import { useState, useRef, useEffect } from 'react'
import { useField } from '../hooks/hook'
import { updateProject } from '../reducers/prjReducer'
import DropDown from './DropDown'
import { useDispatch } from 'react-redux'
import { setError } from '../reducers/notiReducer'

const EditProjectForm = ({ project, categories, onClose }) => {
	const formRef = useRef(null)
	const overlayRef = useRef(null)
	const [cateName, setCateName] = useState(null)
	const [resCates, setResCates] = useState([])
	const { remove: rmProjectName, ...prjName } = useField('text', project.name)
	const categoryNames = categories.map((category) => category.name)
	const dispatch = useDispatch()

	useEffect(() => {
		setResCates(project.categories)
	}, [])

	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}
	const handleEditPrj = (e) => {
		e.preventDefault()

		if (prjName.value === '') {
			dispatch(setError('Please enter a project name', 2))
			return
		}
		const prjToUpdate = {
			name: prjName.value,
			categories: resCates.map((cate) => cate.id),
			id: project.id,
		}
		// console.log(prjToUpdate)

		try {
			dispatch(updateProject(prjToUpdate))
			onClose()
		} catch {
			dispatch(setError('Something goes wrong', 5))
		}
	}

	const handleSelectCategory = (name) => {
		const foundCate = categories.filter((cate) => cate.name === name)[0]
		setCateName(null)
		if (!resCates.includes(foundCate)) {
			setResCates(resCates.concat(foundCate))
		}
	}
	return (
		<div className='edit-form'>
			<div
				ref={overlayRef}
				onClick={handleClickOutside}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					zIndex: 999,
					pointerEvents: 'auto',
				}}
			/>
			<div
				ref={formRef}
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					background: 'white',
					padding: 20,
					zIndex: 1000,
				}}
			>
				<h1>Edit Project</h1>
				<button onClick={onClose}>X</button>
				<div className='project-name'>
					<label>Project Name</label>
					<br />
					<input {...prjName} />
				</div>
				{resCates.map((cate) => (
					<div key={cate.id}>
						<label>
							{cate.name}{' '}
							<button
								onClick={() =>
									setResCates(
										resCates.filter((category) => category.id !== cate.id)
									)
								}
							>
								x
							</button>
						</label>
					</div>
				))}
				<DropDown
					options={categoryNames}
					onSelect={handleSelectCategory}
					description='Choose a Category'
					value={true}
				/>

				<button onClick={onClose}>Cancel</button>
				<button onClick={handleEditPrj}>Edit Category</button>
			</div>
		</div>
	)
}

export default EditProjectForm


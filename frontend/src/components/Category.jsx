import { useState, useRef } from 'react'
import { updateCategory, deleteCategory } from '../reducers/categoryReducer'
import { useDispatch } from 'react-redux'
import { useField } from '../hooks/hook'

const EditCategoryForm = ({ onClose, name, categories, id }) => {
	const formRef = useRef(null)
	const { remove: rmTask, ...categoryName } = useField('text', name)
	const overlayRef = useRef(null)
	const dispatch = useDispatch()
	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}

	const handleEditCategory = (e) => {
		e.preventDefault()
		if (categoryName.value === '') {
			dispatch(setError('Please enter a category name', 2))

			return
		}

		if (categories.some((category) => category.name === categoryName.value)) {
			dispatch(setError('Categories must be unique', 2))
			onClose()
			return
		}
		const category = {
			name: categoryName.value,
			id: id,
		}

		try {
			dispatch(updateCategory(category))

			onClose()
		} catch {
			dispatch(setError('Something goes wrong', 5))
		}
	}
	return (
		<div>
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
				<h1>Edit Category</h1>
				<button onClick={onClose}>X</button>
				<div className='category-name'>
					<label>Cateory Name</label>
					<br />
					<input {...categoryName} />
				</div>

				<button onClick={onClose}>Cancel</button>
				<button onClick={handleEditCategory}>Edit Category</button>
			</div>
		</div>
	)
}

const Category = (props) => {
	const dispatch = useDispatch()
	const [showEditForm, setShowEditForm] = useState(false)

	const handleDelete = () => {
		if (
			window.confirm(`Are you sure you want to delete Category ${props.name}?`)
		) {
			dispatch(deleteCategory(props.id))
		}
	}
	return (
		<div>
			<div className='category-container'>
				<div className='right-content'>
					<div className='Category-name-project'>
						<h2 className='category-name'>{props.name}</h2>
						<p className='category-project'>{props.projects.length} Projects</p>
					</div>

					<button
						onClick={() => setShowEditForm(true)}
						className='edit-category-btn'
					>
						Edit
					</button>
					<button onClick={handleDelete} className='delete-category-btn'>
						Delete
					</button>
				</div>
			</div>
			{showEditForm && (
				<EditCategoryForm onClose={() => setShowEditForm(false)} {...props} />
			)}
		</div>
	)
}

export default Category


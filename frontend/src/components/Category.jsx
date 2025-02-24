import { useState, useRef, useEffect } from 'react'
import { updateCategory, deleteCategory } from '../reducers/categoryReducer'
import { useDispatch } from 'react-redux'
import { useField } from '../hooks/hook'
import { setError, setNotification } from '../reducers/notiReducer'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

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
	const featureRef = useRef(null)
	const [showFeature, setShowFeature] = useState(false)
	const dispatch = useDispatch()
	const [showEditForm, setShowEditForm] = useState(false)

	const handleDelete = () => {
		if (
			window.confirm(`Are you sure you want to delete Category ${props.name}?`)
		) {
			dispatch(deleteCategory(props.id))
		}
	}

	useEffect(() => {
		// Close the feature if clicked outside
		const handleClickOutside = (event) => {
			if (featureRef.current && !featureRef.current.contains(event.target)) {
				setShowFeature(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div>
			<div className='category-container flex justify-between items-center'>
				<div className='Category-name-project ml-4 p-3 text-xl'>
					<h2 className='category-name font-bold'>{props.name}</h2>
					<p className='category-project text-gray-400 ml-1'>
						{props.projects.length} Projects
					</p>
				</div>

				<div
					className='mr-4 cursor-pointer relative'
					ref={featureRef}
					onClick={() => setShowFeature(!showFeature)}
				>
					<div>
						<MoreHorizIcon />
					</div>
					{showFeature && (
						<div className=' flex flex-col bg-white absolute right-0 z-100 showdow-md gap-2 rounded'>
							<div
								onClick={() => setShowEditForm(true)}
								className='edit-category-btn flex w-30 h-10  rounded gap-2 pl-2 pt-2 transition duration-200 ease-out hover:bg-blue-200'
							>
								<EditIcon />
								<p>Edit</p>
							</div>

							<div
								onClick={handleDelete}
								className='delete-category-btn flex w-30 h-10  rounded gap-2 pl-2 pt-2 transition duration-200 ease-out hover:bg-blue-200'
							>
								<DeleteIcon />
								<div>Delete</div>
							</div>
						</div>
					)}
				</div>
			</div>
			{showEditForm && (
				<EditCategoryForm onClose={() => setShowEditForm(false)} {...props} />
			)}
		</div>
	)
}

export default Category


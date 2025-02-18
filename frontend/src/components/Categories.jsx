import { useState, useEffect, useRef } from 'react'
import {
	setAllCategories,
	deleteCategory,
	updateCategory,
	createNewCategory,
} from '../reducers/categoryReducer'
import { useDispatch, useSelector } from 'react-redux'
import { setError, setNotification } from '../reducers/notiReducer'
import { useField } from '../hooks/hook'
import Category from './Category'

const CategoryForm = ({ onClose, categories }) => {
	const formRef = useRef(null)
	const { remove: rmTask, ...categoryName } = useField('text')
	const overlayRef = useRef(null)
	const dispatch = useDispatch()
	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}

	const handleAddCategory = (e) => {
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
		}

		try {
			dispatch(createNewCategory(category))
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
				<h1>Add a new Category</h1>
				<button onClick={onClose}>X</button>
				<div className='category-name'>
					<label>Cateory Name</label>
					<br />
					<input
						{...categoryName}
						placeholder='Type a name for the Category...'
					/>
				</div>

				<button onClick={onClose}>Cancel</button>
				<button onClick={handleAddCategory}>Add Category</button>
			</div>
		</div>
	)
}

const Categories = () => {
	const dispatch = useDispatch()
	const [showAddCategory, setShowAddCategory] = useState(false)
	useEffect(() => {
		document.title = 'Categories'
		dispatch(setAllCategories())
	}, [])

	const categories = useSelector((state) => state.categories)

	return (
		<div className='z-999'>
			<h1>Categories</h1>
			<p>{categories.length} categories</p>
			<button onClick={() => setShowAddCategory(true)}>+ Add New</button>

			{categories.length === 0 ? (
				<div
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
					<p>No categories available</p>
				</div>
			) : (
				<div>
					{categories.map((category) => (
						<div key={category.id}>
							<Category
								name={category.name}
								id={category.id}
								categories={categories}
								projects={category.projects}
							/>
						</div>
					))}
				</div>
			)}
			{showAddCategory && (
				<CategoryForm
					onClose={() => setShowAddCategory(false)}
					categories={categories}
				/>
			)}
		</div>
	)
}

export default Categories


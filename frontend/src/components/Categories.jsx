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
import SortDropDown from './SortDropDown'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

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
	const [sortValue, setSortValue] = useState('newest')
	const dispatch = useDispatch()
	const [showAddCategory, setShowAddCategory] = useState(false)
	useEffect(() => {
		document.title = 'Categories'
		dispatch(setAllCategories())
	}, [])

	const categories = useSelector((state) => state.categories)

	return (
		<div className='flex flex-col items-center flex-1 h-screen'>
			<div className='z-999 bg-white w-[99%] flex items-center self-end'>
				<div className='flex flex-col ml-2'>
					<h1 className='font-bold text-2xl'>Categories</h1>
					<p className='text-gray-500 ml-2'>{categories.length} categories</p>
				</div>
				<button
					className='w-25 h-7 ml-6 bg-orange-600 rounded-sm front text-white justify-center items-center'
					onClick={() => setShowAddCategory(true)}
				>
					+ Add New
				</button>
				<div className='items-center ml-auto flex mr-5'>
					<label className='font-bold'> Sort </label>
					<FilterAltIcon fontSize='small' />
					<SortDropDown setSortValue={setSortValue} sortByDate={true} />
				</div>
			</div>

			<div className='z-999 mt-7 bg-white w-[95%] h-[80%] '>
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
					<div className='flex flex-col items-center gap-4 mt-4'>
						{categories.map((category) => (
							<div
								key={category.id}
								className=''
								style={{
									backgroundColor: 'rgba(241, 245, 249, 0.3)', // Light slate color with 30% opacity
									width: '98%',
								}}
							>
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
		</div>
	)
}

export default Categories


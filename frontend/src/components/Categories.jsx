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
import SortDropdown from './SortDropDown'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

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
					left: '120px',
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(104, 102, 102, 0.5)',
					zIndex: 999,
					pointerEvents: 'auto',
				}}
			/>
			<div
				ref={formRef}
				style={{
					position: 'fixed',
					top: '40vh',
					left: '50%',
					width: '40%',
					transform: 'translate(-50%, -50%)',
					background: 'white',
					padding: 20,
					zIndex: 1000,
				}}
				className='flex flex-col items-center max-w-[600px] rounded-2xl'
			>
				<div className='flex flex-row justify-between self-start w-full'>
					<h1 className='font-bold text-xl'>Add a new Category</h1>
					<div onClick={onClose} className='text-gray-500'>
						<CloseIcon />
					</div>
				</div>

				<div className='category-name w-[85%] mt-7'>
					<label className='text-gray-500 ml-[-10px] font-bold'>
						Cateory Name
					</label>
					<br />
					<input
						{...categoryName}
						className='text-gray-500 border-1 border-gray-400 rounded-sm w-full mt-2 mb-10 pl-3'
						placeholder='Type a name for the Category...'
					/>
				</div>

				<button
					onClick={handleAddCategory}
					className='bg-orange-500 text-white rounded-xl p-2 w-[85%]'
				>
					Add Category
				</button>
			</div>
		</div>
	)
}

const Categories = () => {
	const dispatch = useDispatch()
	const [sortValue, setSortValue] = useState('newest')
	const [showAddCategory, setShowAddCategory] = useState(false)
	const { remove: rmSearch, ...search } = useField('text')

	const [render, setRender] = useState(0)
	useEffect(() => {
		document.title = 'Categories'
		dispatch(setAllCategories())
	}, [])

	useEffect(() => {
		setRender(render + 1)
	}, [search.value])

	const initialCategories = useSelector((state) => state.categories)
	let categories
	if (sortValue === 'A-Z') {
		categories = [...initialCategories]
			.sort((a, b) => a.name.localeCompare(b.name))
			.filter((category) => category.name.includes(search.value))
	} else if (sortValue === 'Z-A') {
		categories = [...initialCategories].sort((a, b) =>
			b.name
				.localeCompare(a.name)
				.filter((category) => category.name.includes(search.value))
		)
	} else if (sortValue === 'newest') {
		categories = [...initialCategories]
			.reverse()
			.filter((category) => category.name.includes(search.value))
	} else {
		categories = [...initialCategories].filter((category) =>
			category.name.includes(search.value)
		)
	}

	return (
		<div className='flex flex-col items-center flex-1 h-screen '>
			<div className='z-999 bg-white min-h-[100px] flex flex-row justify-between items-center self-end rounded-2xl box fixed left-[150px] right-0'>
				<div className='flex flex-col ml-2'>
					<h1 className='font-bold text-2xl'>Categories</h1>
					<p className='text-gray-500 ml-2'>{categories.length} categories</p>
				</div>
				<button
					className='w-25 h-7 ml-6 bg-orange-500 rounded-lg front text-white justify-center items-center'
					onClick={() => setShowAddCategory(true)}
				>
					+ Add New
				</button>
				<div className='ml-auto items-center mr-5 flex'>
					<p className='font-bold'>Sort</p>
					<FilterAltIcon fontSize='small' />
					<SortDropdown
						initlaValue='newest'
						sortByDate={true}
						setSortValue={setSortValue}
					/>
				</div>
			</div>

			<div className='top-[100px] relative overflow-auto  z-500 w-[calc(100vw-200px)] max-h-[calc(100vh-130px)]  left-[100px] pt-10'>
				<div className='flex z-900 rounded-lg gap-2 self-start '>
					<div className='border-b-2 border-orange-500 pl-1 pr-0.5'>
						<SearchIcon />
					</div>
					<input
						{...search}
						placeholder='Search a category'
						className='border-b-2 border-gray-200 pl-1 '
					/>
				</div>

				<div className='z-999 mt-7 w-[95%] h-[80%]'>
					{categories.length === 0 ? (
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								padding: 20,
								zIndex: 1000,
							}}
						>
							<p>No categories available</p>
						</div>
					) : (
						<div className='flex flex-col items-center gap-4 mt-4 pb-10 '>
							{categories.map((category) => (
								<div
									key={category.id}
									className='rounded-2xl box w-[98%] bg-white '
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
				</div>
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

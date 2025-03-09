import { useDispatch } from 'react-redux'
import { useRef } from 'react'
import { setError } from '../reducers/notiReducer'
import { useField } from '../hooks/hook'
import CloseIcon from '@mui/icons-material/Close'
import { updateCategory } from '../reducers/categoryReducer'

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
					left: '60px',
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(104, 102, 102, 0.5)',
					zIndex: 999,
					pointerEvents: 'auto',
				}}
				className='rounded-2xl'
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
					<h1 className='font-bold text-xl'>Edit Category</h1>
					<div onClick={onClose} className='text-gray-500'>
						<CloseIcon />
					</div>
				</div>
				<div className='category-name w-[85%] mt-7'>
					<label className='text-gray-500 ml-[-10px]'>Cateory Name</label>
					<br />
					<input
						{...categoryName}
						className='text-gray-500 border-1 border-gray-400 rounded w-full mt-2 mb-10 pl-3 pr-3'
					/>
				</div>

				<button
					onClick={handleEditCategory}
					className='bg-orange-500 text-white rounded-xl p-2 w-[85%]'
				>
					Edit Category
				</button>
			</div>
		</div>
	)
}

export default EditCategoryForm


import { useState, useRef, useEffect } from 'react'
import { deleteCategory } from '../reducers/categoryReducer'
import { useDispatch } from 'react-redux'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditCategoryForm from './EditCategoryForm'
import { Navigate, useNavigate } from 'react-router-dom'

const Category = (props) => {
	const featureRef = useRef(null)
	const [showFeature, setShowFeature] = useState(false)
	const dispatch = useDispatch()
	const [showEditForm, setShowEditForm] = useState(false)
	const navigate = useNavigate()
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
				<div className='Category-name-project ml-4 p-3'>
					<h2 className='category-name font-bold text-xl'>{props.name}</h2>
					<p
						className='category-project text-gray-400 ml-1 hover:underline cursor-pointer'
						onClick={() => {
							navigate('/projects', {
								state: {
									cates: props.categories.filter(
										(cate) => cate.name === props.name
									),
								},
							})
						}}
					>
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
						<div className=' flex flex-col bg-white absolute right-0 z-100 showdow-md gap-2 rounded-xl box'>
							<div
								onClick={() => setShowEditForm(true)}
								className='edit-category-btn flex w-30 h-12  rounded-xl gap-2 pl-2  transition duration-200 ease-out hover:bg-blue-200 items-center'
							>
								<div className='text-orange-500 bg-orange-100 rounded-lg self-center'>
									<EditIcon />
								</div>
								<p>Edit</p>
							</div>

							<div
								onClick={handleDelete}
								className='delete-category-btn flex w-30 h-12  rounded-xl gap-2 pl-2 transition duration-200 ease-out hover:bg-blue-200 items-center'
							>
								<DeleteOutlineIcon />
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


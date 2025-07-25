import { useState, useRef, useEffect } from 'react'
import { deleteCategory } from '../reducers/categoryReducer'
import { useDispatch } from 'react-redux'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditCategoryForm from './EditCategoryForm'
import { Navigate, useNavigate } from 'react-router-dom'
import { setNotification } from '../reducers/notiReducer'
import ConfirmDialog from './ConfirmDialog'
import { useTranslation } from 'react-i18next'

const Category = (props) => {
	const { t, i18n } = useTranslation()
	const featureRef = useRef(null)
	const [showFeature, setShowFeature] = useState(false)
	const dispatch = useDispatch()
	const [showEditForm, setShowEditForm] = useState(false)
	const navigate = useNavigate()
	const [isHover, setIsHover] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const handleDelete = () => {
		setShowFeature(false)
		handleClose()
		dispatch(deleteCategory(props.id))
		dispatch(
			setNotification(`${t('Category')} ${props.name} ${t('deleted')}`, 2)
		)
	}
	const handleClose = () => {
		setIsOpen(false)
		props.setEditting(false)
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
		<div
			className={`rounded-2xl w-full bg-white ml-2  mt-5 ${
				isHover ? 'box' : ''
			}`}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
		>
			<div className='category-container flex justify-between items-center'>
				<div className='Category-name-project ml-4 p-3'>
					<h2 className='category-name font-semibold text-slate-700 text-xl'>
						{props.name}
					</h2>
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
						{props.projects.length} {t('Projects')}
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
								onClick={() => {
									setShowEditForm(true)
									props.setEditting(true)
								}}
								className='edit-category-btn flex w-30 h-12  rounded-xl gap-2 pl-2  transition duration-200 ease-out hover:bg-blue-200 items-center'
							>
								<div className='text-orange-500 bg-orange-100 rounded-lg self-center'>
									<EditIcon />
								</div>
								<p>{t('Edit')}</p>
							</div>

							<div
								onClick={() => {
									setIsOpen(true)
									props.setEditting(true)
								}}
								className='delete-category-btn flex w-30 h-12  rounded-xl gap-2 pl-2 transition duration-200 ease-out hover:bg-blue-200 items-center'
							>
								<DeleteOutlineIcon />
								<div>{t('Delete')}</div>
							</div>
						</div>
					)}
				</div>
			</div>
			{showEditForm && (
				<EditCategoryForm
					onClose={() => {
						setShowEditForm(false)
						props.setEditting(false)
					}}
					{...props}
				/>
			)}
			{isOpen && (
				<ConfirmDialog
					isOpen={isOpen}
					onClose={handleClose}
					onConfirm={handleDelete}
					message={`${t('Are you sure you want to delete Category')} "${
						props.name
					}"?`}
				/>
			)}
		</div>
	)
}

export default Category

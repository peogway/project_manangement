import { useState, useRef, useEffect } from 'react'
import { useField } from '../hooks/hook'
import { updateProject } from '../reducers/prjReducer'
import DropDown from './DropDown'
import { useDispatch } from 'react-redux'
import { setError } from '../reducers/notiReducer'
import GridViewIcon from '@mui/icons-material/GridView'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from './IconButton'

const EditProjectForm = ({
	project,
	categories,
	onClose,
	setShowIconsMenu,
	iconId,
	setProjectToEdit,
	setIconId,
}) => {
	const formRef = useRef(null)
	const overlayRef = useRef(null)

	const [resCates, setResCates] = useState([])
	const { remove: rmProjectName, ...prjName } = useField('text', project.name)
	const [categoryNames, setCategoryNames] = useState(
		() =>
			categories
				?.map((category) => category.name)
				.sort((a, b) => a.localeCompare(b)) || []
	)
	const dispatch = useDispatch()

	useEffect(() => {
		setResCates(project.categories)
		setCategoryNames(
			categoryNames.filter(
				(name) => !project.categories.some((cat) => cat.name === name)
			)
		)
	}, [])

	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}
	const handleEditPrj = (e) => {
		e.preventDefault()
		setIconId(1)
		setProjectToEdit(null)

		if (prjName.value === '') {
			dispatch(setError('Please enter a project name', 2))
			return
		}
		const prjToUpdate = {
			name: prjName.value,
			categories: resCates,
			icon: iconId.toString(),
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
		if (!resCates.includes(foundCate)) {
			setCategoryNames(categoryNames.filter((cateName) => cateName !== name))
			setResCates(resCates.concat(foundCate))
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
					width: '100vw',
					height: '100vw',
					backgroundColor: 'rgba(104, 102, 102, 0.5)',
					zIndex: 999,
					pointerEvents: 'auto',
				}}
				className='rounded-2xl'
			/>
			<div
				ref={formRef}
				style={{
					position: 'absolute',
					top: '37%',
					left: '45%',
					transform: 'translate(-50%, -50%)',
					background: 'white',
					padding: 20,
					zIndex: 1000,
				}}
				className='flex flex-col items-center max-w-[600px] w-[550px] rounded-2xl'
			>
				<div className='flex flex-row justify-between self-start w-full items-center'>
					<div className='flex flex-row gap-4'>
						<div className='text-orange-500 bg-orange-300 rounded-lg w-9 h-9 justify-center items-center flex border border-slate-50'>
							<GridViewIcon />
						</div>
						<h1 className='font-bold text-xl'>Edit Project</h1>
					</div>
					<div onClick={onClose} className='text-gray-500 mr-2'>
						<CloseIcon />
					</div>
				</div>

				<div className='project-name w-[85%] mt-7'>
					<label className='text-gray-500 ml-[-10px] font-bold'>
						Project Name
					</label>
					<div className=' w-full mt-2 flex flex-row justify-between '>
						<input
							{...prjName}
							className='text-gray-500 border-1 border-gray-400 rounded w-[80%] pl-3'
						/>
						<div className=''>
							<IconButton iconId={iconId} setShow={setShowIconsMenu} />
						</div>
					</div>
				</div>
				<div className='task-priority w-[85%] mt-7 flex flex-row items-center gap-5 '>
					<label className='text-gray-500 ml-[-10px] font-bold'>
						Categories
					</label>

					<div className=''>
						<DropDown
							options={categoryNames}
							onSelect={handleSelectCategory}
							description='Choose categories'
							value={true}
						/>
					</div>
				</div>

				<div className='flex flex-wrap gap-3 self-start mt-4 mb-10 ml-4 mr-4'>
					{resCates.map((cate) => (
						<div
							key={cate.id}
							className='border-1 rounded-2xl p-1 bg-gray-200  flex flex-row justify-between'
						>
							<label>
								{cate.name}{' '}
								<button
									onClick={() => {
										setResCates(
											resCates.filter((category) => category.id !== cate.id)
										)
										setCategoryNames(
											categoryNames
												.concat(cate.name)
												.sort((a, b) => a.localeCompare(b))
										)
									}}
								>
									x
								</button>
							</label>
						</div>
					))}
				</div>

				<button
					onClick={handleEditPrj}
					className='bg-orange-500 text-white rounded-xl p-2 w-[85%] '
				>
					Edit Project
				</button>
			</div>
		</div>
	)
}

export default EditProjectForm


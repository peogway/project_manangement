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
	projectUnique,
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

		if (prjName.value === '') {
			dispatch(setError('Please enter a project name', 2))
			return
		}
		if (projectUnique(prjName.value) && prjName.value !== project.name) {
			dispatch(setError('Project names must be unique', 2))
			return
		}
		if (
			prjName.value.length < 5 ||
			prjName.value[0].toUpperCase() !== prjName.value[0]
		) {
			dispatch(
				setError('Require first uppercase character and minimum length of 5', 2)
			)
			return
		}

		if (!/^[A-Za-z]$/.test(prjName.value[0])) {
			dispatch(setError('Require first non-special character', 2))
			return
		}
		setProjectToEdit(null)
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
					left: '60px',
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
						<h1 className='font-semibold text-xl'>Edit Project</h1>
					</div>
					<div onClick={onClose} className='text-gray-500 mr-2'>
						<CloseIcon fontSize='large' />
					</div>
				</div>

				<div className='project-name w-[85%] mt-7'>
					<label className='text-gray-500 ml-[-10px] font-semibold'>
						Project Name
					</label>
					<div className=' w-full mt-2 flex flex-row justify-between '>
						<div className='w-[80%] border-1 border-gray-400 rounded-lg items-center justify-center'>
							<input
								{...prjName}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleEditPrj(e)
								}}
								placeholder='Enter a name for the Project'
								className='text-gray-500 pl-3 pr-3 pt-1 focus:outline-none w-full'
							/>
						</div>
						<div className=''>
							<IconButton iconId={iconId} setShow={setShowIconsMenu} />
						</div>
					</div>
				</div>
				<div className='task-priority w-[85%] mt-7 flex flex-row items-center gap-5 '>
					<label className='text-gray-500 ml-[-10px] font-semibold'>
						Categories
					</label>

					<div className='w-[10%]'>
						<DropDown
							options={categoryNames}
							onSelect={handleSelectCategory}
							description='Choose categories'
							value={true}
							width='[300px]'
						/>
					</div>
				</div>

				<div className='flex flex-wrap gap-3 self-start mt-4 mb-10 ml-4 mr-4'>
					{resCates.map((cate) => (
						<div
							key={cate.id}
							className='border-1 rounded-2xl p-1 bg-gray-200  flex flex-row justify-between gap-5'
						>
							<label className='flex flex-row gap-5'>{cate.name}</label>
							<div
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
								<CloseIcon fontSize='small' />
							</div>
						</div>
					))}
				</div>

				<button
					onClick={handleEditPrj}
					className='bg-orange-400 text-white select-none rounded-xl p-2 w-[85%] '
				>
					Edit Project
				</button>
			</div>
		</div>
	)
}

export default EditProjectForm

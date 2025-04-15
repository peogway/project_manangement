import { useState, useRef, useEffect } from 'react'
import { useField } from '../hooks/hook'
import { createNewProject } from '../reducers/prjReducer'
import DropDown from './DropDown'
import { useDispatch } from 'react-redux'
import { setError, setNotification } from '../reducers/notiReducer'
import GridViewIcon from '@mui/icons-material/GridView'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from './IconButton'

const ProjectForm = ({
	categories,
	onClose,
	setShowIconsMenu,
	iconId,
	setIconId,
	projectUnique,
}) => {
	const formRef = useRef(null)
	const overlayRef = useRef(null)
	const [resCates, setResCates] = useState([])
	const { remove: rmProjectName, ...prjName } = useField('text')
	const [categoryNames, setCategoryNames] = useState(
		() =>
			categories
				?.map((category) => category.name)
				.sort((a, b) => a.localeCompare(b)) || []
	)

	const dispatch = useDispatch()

	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}
	const handleAddPrj = (e) => {
		e.preventDefault()
		setIconId(1)

		if (prjName.value === '') {
			dispatch(setError('Please enter a project name', 2))
			return
		}

		if (projectUnique(prjName.value)) {
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

		const prjToCreate = {
			name: prjName.value,
			categories: resCates,
			icon: iconId.toString(),
		}
		try {
			dispatch(createNewProject(prjToCreate))
			dispatch(setNotification(`Project "${prjName.value}" created`, 2))
			onClose()
		} catch {
			dispatch(setError('Something goes wrong', 2))
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
					top: '37%',
					left: '50%',
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
						<h1 className='font-semibold text-2xl'>New Project</h1>
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
									if (e.key === 'Enter') handleAddPrj(e)
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

					<div className=''>
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
							<label className='flex flex-row '>{cate.name}</label>
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
					onClick={handleAddPrj}
					className='bg-orange-400 select-none text-white rounded-xl p-2 w-[85%] '
				>
					Add Project
				</button>
			</div>
		</div>
	)
}

export default ProjectForm

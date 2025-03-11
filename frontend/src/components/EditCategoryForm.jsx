import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { setError } from '../reducers/notiReducer'
import { useField } from '../hooks/hook'
import CloseIcon from '@mui/icons-material/Close'
import { updateCategory } from '../reducers/categoryReducer'

import ProjectsDropDown from './ProjectsDropdown'
import { getIconComponent } from './AllIcons'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useState } from 'react'

const EditCategoryForm = ({ onClose, name, categories, id, category }) => {
	const formRef = useRef(null)
	const { remove: rmTask, ...categoryName } = useField('text', name)
	const overlayRef = useRef(null)
	const dispatch = useDispatch()
	const [resProjects, setResProjects] = useState([])
	const projects = useSelector((state) => state.projects)
	const [dropdownProjects, setDropdownProjects] = useState([])

	const [openProjectsDropDown, setOpenProjectsDropDown] = useState(false)

	useEffect(() => {
		setResProjects(
			projects.filter((project) =>
				category.projects.some((prj) => prj.id === project.id)
			)
		)
		setDropdownProjects(
			[...projects]
				.sort((a, b) => a.name.localeCompare(b.name))
				.filter(
					(project) => !category.projects.some((prj) => prj.id === project.id)
				)
		)
	}, [projects])

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
			projects: resProjects.map((project) => project.id),
			id: id,
		}

		try {
			dispatch(updateCategory(category))
			onClose()
		} catch {
			dispatch(setError('Something goes wrong', 5))
		}
	}

	const handleSelectProject = (project) => {
		if (!resProjects.includes(projects)) {
			setDropdownProjects(
				dropdownProjects.filter((prj) => prj.id !== project.id)
			)
			setResProjects(resProjects.concat(project))
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
					top: '45vh',
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
						className='text-gray-500 border-1 border-gray-400 rounded w-full mt-2 pl-3 pr-3'
					/>
				</div>

				<div className='task-priority w-[85%] flex flex-row items-center gap-5  mt-5'>
					<label className='text-gray-500 ml-[-10px] font-bold'>Projects</label>

					<div className=' mt-2 w-full'>
						<div
							className='w-full flex flex-rox items-center justify-between border-1 border-gray-400 rounded-lg select-none'
							onMouseDown={(e) => {
								if (e.target === e.currentTarget) {
									// Only prevent default if clicking on the div itself, not text
									e.preventDefault()
								}
								e.stopPropagation()
								setOpenProjectsDropDown(!openProjectsDropDown)
							}}
						>
							<div className='flex flex-row gap-2 items-center pl-3 pt-1 pb-1'>
								<div className='text-gray-500 select-none'>
									Select a project
								</div>
							</div>
							<div className='text-gray-500'>
								<KeyboardArrowDownIcon fontSize='medium' />
							</div>
						</div>
						<ProjectsDropDown
							openProjectsDropDown={openProjectsDropDown}
							setOpenProjectsDropDown={setOpenProjectsDropDown}
							setChosenProject={handleSelectProject}
							chosenProject={null}
							allProjects={dropdownProjects}
						/>
					</div>
				</div>
				<div className='flex flex-wrap gap-3 self-start mt-4 mb-10 ml-4 mr-4'>
					{resProjects.map((project) => (
						<div
							key={project.id}
							className='border-1 rounded-2xl p-1 bg-gray-200  flex flex-row justify-between gap-5'
						>
							<label className='flex flex-row '>
								<div className=''>
									{getIconComponent(
										project.icon,
										'text-white',
										'text-[15px]',
										'bg-orange-500',
										'p-1'
									)}
								</div>
								{project.name}
							</label>
							<div
								onClick={() => {
									setResProjects(
										resProjects.filter((prj) => prj.id !== project.id)
									)
									setDropdownProjects(
										dropdownProjects
											.concat(project)
											.sort((a, b) => a.name.localeCompare(b.name))
									)
								}}
							>
								<CloseIcon fontSize='small' />
							</div>
						</div>
					))}
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


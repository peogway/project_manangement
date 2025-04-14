import { useState, useEffect, useRef } from 'react'
import {
	setAllCategories,
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
import ProjectsDropDown from './ProjectsDropdown'
import { getIconComponent } from './AllIcons'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { setAllProject } from '../reducers/prjReducer'
import noMatch from '../assets/no-match-blue.png'

import Avatar from './Avatar'

const CategoryForm = ({ onClose, categories, projects }) => {
	const formRef = useRef(null)
	const [openProjectsDropDown, setOpenProjectsDropDown] = useState(false)
	const { remove: rmTask, ...categoryName } = useField('text')
	const overlayRef = useRef(null)
	const dispatch = useDispatch()
	const [resProjects, setResProjects] = useState([])
	const [dropdownProjects, setDropdownProjects] = useState(
		[...projects].sort((a, b) => a.name.localeCompare(b.name))
	)

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
			return
		}
		if (
			categoryName.value.length < 5 ||
			categoryName.value[0].toUpperCase() !== categoryName.value[0]
		) {
			dispatch(
				setError('Require first uppercase character and minimum length of 5', 2)
			)
			return
		}

		if (!/^[A-Za-z]$/.test(categoryName.value[0])) {
			dispatch(setError('Require first non-special character', 2))
			return
		}

		const category = {
			name: categoryName.value,
			projects: resProjects,
		}

		try {
			dispatch(createNewCategory(category))
			onClose()
		} catch {
			dispatch(setError('Something goes wrong', 2))
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
					<h1 className='font-semibold text-xl'>Add a new Category</h1>
					<div onClick={onClose} className='text-gray-500'>
						<CloseIcon />
					</div>
				</div>

				<div className='category-name w-[85%] mt-7'>
					<label className='text-gray-500 ml-[-10px] font-semibold'>
						Cateory Name
					</label>
					<br />
					<div className='w-full border-1 border-gray-400 rounded-lg items-center mt-3 p-2 justify-center '>
						<input
							{...categoryName}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleAddCategory(e)
							}}
							className='text-gray-500  w-full  focus:outline-none'
							placeholder='Type a name for the Category...'
						/>
					</div>
				</div>

				<div className='task-priority w-[85%] flex flex-row items-center gap-5  mt-5'>
					<label className='text-gray-500 ml-[-10px] font-semibold'>
						Projects
					</label>

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
										'bg-orange-400',
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
					onClick={handleAddCategory}
					className='bg-orange-400 text-white select-none rounded-xl p-2 w-[85%]'
				>
					Add Category
				</button>
			</div>
		</div>
	)
}

const Categories = ({ user }) => {
	const dispatch = useDispatch()
	const [sortValue, setSortValue] = useState('newest')
	const [showAddCategory, setShowAddCategory] = useState(false)
	const [editing, setEditting] = useState(false)
	const { remove: rmSearch, ...search } = useField('text')

	const [render, setRender] = useState(0)
	useEffect(() => {
		document.title = 'Categories'
		dispatch(setAllCategories())
		dispatch(setAllProject())
	}, [])

	useEffect(() => {
		setRender(render + 1)
	}, [search.value])

	const initialCategories = useSelector((state) => state.categories)
	const projects = useSelector((state) => state.projects)

	let categories = [...initialCategories].filter((category) =>
		category.name.includes(search.value)
	)
	if (sortValue === 'A-Z') {
		categories = [...categories].sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortValue === 'Z-A') {
		categories = [...categories].sort((a, b) => b.name.localeCompare(a.name))
	} else if (sortValue === 'newest') {
		categories = [...categories].reverse()
	} else {
		categories = [...categories].filter((category) =>
			category.name.includes(search.value)
		)
	}

	return (
		<div className='flex flex-col items-center flex-1 h-screen'>
			<div
				className={`${
					editing ? 'z-100' : 'z-101'
				}  bg-white min-h-[100px] flex flex-row justify-between items-center self-end rounded-2xl box fixed left-[90px] right-0 `}
			>
				<div className='flex flex-col ml-2'>
					<h1 className='font-semibold text-2xl text-slate-800'>Categories</h1>
					<p className='text-gray-500 ml-2'>{categories.length} categories</p>
				</div>
				<button
					className='w-25 h-7 ml-6 bg-orange-400 rounded-lg select-none front text-white justify-center items-center'
					onClick={() => setShowAddCategory(true)}
				>
					+ Add New
				</button>
				<div className='ml-auto items-center mr-20 flex'>
					<p className='font-semibold text-slate-700'>Sort</p>
					<div className='text-slate-700 flex items-center justify-center'>
						<FilterAltIcon fontSize='small' />
					</div>
					<SortDropdown
						initlaValue='newest'
						sortByDate={true}
						setSortValue={setSortValue}
					/>
				</div>
				<div className='mr-20'>
					<Avatar user={user} />
				</div>
			</div>

			<div className='top-[100px] relative overflow-auto z-100  w-[calc(100vw-120px)] max-h-[calc(100vh-130px)]  left-[60px] pt-10'>
				<div className='flex z-900 rounded-lg gap-2 self-start '>
					<div className='border-b-2 border-orange-500 pl-1 pr-0.5'>
						<SearchIcon />
					</div>

					<input
						{...search}
						placeholder='Search a category'
						className='border-b-2 border-gray-200 pl-1  pr-1 focus:outline-none'
					/>
				</div>

				<div className='mt-7 w-[95%] pb-10'>
					{categories.length === 0 && (
						<div
							style={{
								transform: 'translate(-50%, -50%)',
							}}
							className='top-[50%] left-[50%] fixed p-20 z-999 text-slate-400 text-center flex items-center'
						>
							<div className=' mr-2'>
								<img src={noMatch} />
							</div>
							<p>No categories available</p>
						</div>
					)}
					{categories.map((category) => (
						<div key={category.id}>
							<Category
								name={category.name}
								id={category.id}
								categories={categories}
								projects={category.projects}
								category={category}
								setEditting={setEditting}
							/>
						</div>
					))}
				</div>
			</div>
			{showAddCategory && (
				<CategoryForm
					onClose={() => setShowAddCategory(false)}
					categories={categories}
					projects={projects}
				/>
			)}
		</div>
	)
}

export default Categories

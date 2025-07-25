import { getIconComponent } from './AllIcons'

import { useEffect, useRef, useState } from 'react'
import SplitscreenIcon from '@mui/icons-material/Splitscreen'
import noMatch from '../assets/no-match-blue.png'
import { useTranslation } from 'react-i18next'

const ProjectsDropDown = ({
	setOpenProjectsDropDown,
	openProjectsDropDown,
	setChosenProject,
	allProjects,
	chosenProject,
	showAllProject,
}) => {
	const dropDownRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
				setOpenProjectsDropDown(false)
			}
		}

		const handleResize = () => {
			// Close the drop down menu when the window is resized
			setOpenProjectsDropDown(false)
		}
		if (openProjectsDropDown) {
			document.addEventListener('mousedown', handleClickOutside)
			window.addEventListener('resize', handleResize)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('resize', handleResize)
			// Restore scrolling
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('resize', handleResize)

			// Restore scrolling on cleanup
		}
	}, [openProjectsDropDown])

	return (
		<div
			ref={dropDownRef}
			className={` ${
				openProjectsDropDown ? 'block' : 'hidden'
			} z-20 min-w-[250px] max-w-[600px] overflow-auto whitespace-nowrap bg-white absolute p-3 select-none  user-select-none border border-slate-50 w-auto shadow-md box rounded-lg flex flex-col gap-2 
			${
				showAllProject === true
					? ' top-15 left-15 max-h-[calc(100vh-300px)]'
					: ' max-h-[calc(150px)]'
			}`}
		>
			<div className={showAllProject ? '' : 'hidden'}>
				<AllProjectsItem
					setOpenProjectsDropDown={setOpenProjectsDropDown}
					setChosenProject={setChosenProject}
					chosenProject={chosenProject}
				/>
				<hr className='w-[80%] text-slate-400 mx-auto my-1 opacity-55 mt-4'></hr>
			</div>
			<>
				{allProjects.length === 0 && (
					<div className='flex items-center text-center text-slate-400 text-[11px] my-2 justify-center'>
						<img src={noMatch} />
						<p className='ml-2'>No Projects Found</p>
					</div>
				)}
				{[...allProjects]
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((singleProject, index) => (
						<SingleProject
							key={singleProject.id}
							singleProject={singleProject}
							setChosenProject={setChosenProject}
							setOpenProjectsDropDown={setOpenProjectsDropDown}
							allProjects={allProjects}
							chosenProject={chosenProject}
						/>
					))}
			</>
		</div>
	)
}

const AllProjectsItem = ({
	setOpenProjectsDropDown,
	setChosenProject,
	chosenProject,
}) => {
	const { t, i18n } = useTranslation()
	return (
		<div
			onClick={(e) => {
				e.stopPropagation()
				//Unselect the project
				setChosenProject(null)
				//Close the drop down
				setOpenProjectsDropDown(false)
			}}
			className={`   flex items-center justify-between  gap-7 rounded-lg text-slate-600 hover:text-orange-600  cursor-pointer select-none user-select-none ${
				chosenProject === null && 'border border-orange-600 bg-orange-50 '
			} `}
		>
			<div className='flex gap-2 items-center '>
				{/* Icon */}
				<div className='text-orange-600 text-[27px]'>
					<SplitscreenIcon />
				</div>
				<span className='text-[18px] mt-1 cursor-pointer'>
					{t('All Projects')}
				</span>
			</div>
		</div>
	)
}

const SingleProject = ({
	singleProject,
	setChosenProject,
	setOpenProjectsDropDown,
	chosenProject,
	allProjects,
}) => {
	const handleTheProjectClicked = (projectId) => {
		//Extract the project from the all Projects array
		const findProject = allProjects.find((project) => project.id === projectId)
		//If we found the project, update the chosen project
		if (findProject) {
			setChosenProject(findProject)
		}

		//Close the drop down
		setOpenProjectsDropDown(false)
	}

	return (
		<div
			onClick={(e) => {
				e.stopPropagation()
				handleTheProjectClicked(singleProject.id)
			}}
			className={` ${
				chosenProject?.id === singleProject.id &&
				'border border-orange-600 bg-orange-50'
			} flex items-center justify-between  gap-7 p-2 rounded-lg text-slate-600  cursor-pointer  hover:text-orange-600`}
		>
			<div className={`flex gap-2 items-center `}>
				{/* Icon */}
				<div> {getIconComponent(parseInt(singleProject.icon))} </div>
				<span className='text-[18px] mt-1  cursor-pointer'>
					{singleProject.name}
				</span>
			</div>
		</div>
	)
}

export default ProjectsDropDown

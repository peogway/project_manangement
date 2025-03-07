import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllTasks, updateTask } from '../reducers/taskReducer'
import SortDropdown from './sortDropDown'
import TaskViewInProject from './TaskViewInProject'
import EditTaskForm from './EditTaskForm'
import CircularChart from './CircularChart'

const CertainProject = ({ project, categories, onClose }) => {
	const dispatch = useDispatch()
	const formRef = useRef(null)
	const [sortValue, setSortValue] = useState('A-Z')

	const [taskStatusToShow, setTaskStatusToSHow] = useState(null)
	const [percent, setPercent] = useState({ initial: null, after: null })
	const overlayRef = useRef(null)
	useEffect(() => {
		dispatch(setAllTasks())
	}, [])

	const allTasks = useSelector((state) => state.tasks)
	const tasks = allTasks.filter((task) => task.project.id === project.id)
	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			onClose()
		}
	}

	// console.log(allTasks)
	const priorityOrder = { high: 3, medium: 2, low: 1 }
	let sortedTasks
	if (sortValue === 'A-Z') {
		sortedTasks = [...tasks].sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortValue === 'Z-A') {
		sortedTasks = [...tasks].sort((a, b) => b.name.localeCompare(a.name))
	} else if (sortValue === 'newest') {
		sortedTasks = [...tasks].sort(
			(a, b) => new Date(b.createAt) - new Date(a.createAt)
		)
	} else if (sortValue === 'oldest') {
		sortedTasks = [...tasks].sort(
			(a, b) => new Date(a.createAt) - new Date(b.createAt)
		)
	} else if (sortValue === 'increasing') {
		sortedTasks = [...tasks].sort(
			(a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
		)
	} else {
		sortedTasks = [...tasks].sort(
			(a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
		)
	}

	const completedTasks = sortedTasks.filter((task) => task.completed === true)
	const uncompletedTasks = sortedTasks.filter(
		(task) => task.completed === false
	)

	const completionPercentage =
		tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0

	useEffect(() => {
		setPercent((prev) => ({
			initial: prev.after ?? 0,
			after: completionPercentage ?? 0,
		}))
	}, [completionPercentage])

	const taskMap = {
		true: completedTasks,
		false: uncompletedTasks,
		null: sortedTasks,
	}

	const showTasks = taskMap[taskStatusToShow]
	// console.log(showTasks)

	return (
		<div>
			<div
				ref={overlayRef}
				onClick={handleClickOutside}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					zIndex: 999,
					pointerEvents: 'auto',
				}}
			/>
			<div
				ref={formRef}
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					background: 'white',
					padding: 20,
					zIndex: 1000,
				}}
			>
				<h2>{project.name}</h2>
				<CircularChart initial={percent.initial} after={percent.after} />
				<SortDropdown
					setSortValue={setSortValue}
					sortTasks={true}
					sortByDate={true}
				/>
				<div className='flex justify-center flex-col gap-1 items-center'>
					<p className=' text-[13px] text-slate-400'>
						{completedTasks.length} Tasks done
					</p>
				</div>
				<button
					onClick={() => setTaskStatusToSHow(null)}
					className={taskStatusToShow === null ? 'active' : 'faded'}
				>
					All
				</button>
				<button
					onClick={() => setTaskStatusToSHow(true)}
					className={taskStatusToShow === true ? 'active' : 'faded'}
				>
					Completed
				</button>
				<button
					onClick={() => setTaskStatusToSHow(false)}
					className={taskStatusToShow === false ? 'active' : 'faded'}
				>
					Uncompleted
				</button>

				{showTasks.map((task) => (
					<div key={task.id} className={task.completed ? 'completed-task' : ''}>
						<TaskViewInProject task={task} />
					</div>
				))}
			</div>
		</div>
	)
}

export default CertainProject


import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Task from './Task'
import { setAllTasks, updateTask, deleteTask } from '../reducers/taskReducer'
import {
	setAllProject,
	updateProject,
	deleteProject,
} from '../reducers/prjReducer'

const Tasks = () => {
	const location = useLocation()
	const dispatch = useDispatch()
	useEffect(() => {
		document.title = 'Tasks'
		dispatch(setAllTasks())
		dispatch(setAllProject())
	}, [])

	const tasks = useSelector((state) => state.tasks)
	const projects = useSelector((state) => state.projects)

	// const { prj } = location.state || {}
	return <div>Tasks here</div>
}

export default Tasks

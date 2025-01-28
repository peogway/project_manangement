import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Task from './Task'
import { setAllTasks, updateTask, deleteTask } from '../reducers/taskReducer'

const Tasks = () => {
	const location = useLocation()
	const dispatch = useDispatch()
	useEffect(() => {
		document.title = 'Tasks'
		dispatch(setAllTasks())
	}, [])

	const tasks = useSelector((state) => state.tasks)

	const { prj } = location.state || {}
	return <div>Tasks here</div>
}

export default Tasks


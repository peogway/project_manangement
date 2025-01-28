import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const Tasks = () => {
	const location = useLocation()
	const { prj } = location.state || {}
	useEffect(() => {
		document.title = 'Tasks'
	}, [])
	return <div>Tasks here</div>
}

export default Tasks


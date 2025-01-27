import { useState, useEffect } from 'react'

const Tasks = () => {
	useEffect(() => {
		document.title = 'Tasks'
	}, [])
	return <div>Tasks here</div>
}

export default Tasks


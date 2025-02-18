import { useState, useEffect } from 'react'

const Dashboard = () => {
	useEffect(() => {
		document.title = 'Dashboard'
	}, [])
	return <div className='z-999'>Dashboard here</div>
}

export default Dashboard

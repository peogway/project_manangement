import { useState, useEffect } from 'react'

const Dashboard = () => {
	useEffect(() => {
		document.title = 'Dashboard'
	}, [])
	return <div>Dashboard here</div>
}

export default Dashboard


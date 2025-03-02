import { useState, useEffect } from 'react'

const Dashboard = () => {
	useEffect(() => {
		document.title = 'Dashboard'
	}, [])
	return (
		<div className='flex justify-center items-center flex-1 h-screen overflow-auto left-[120px] relative max-w-[calc(100vw-120px)]'>
			<div className='z-999 z-999 bg-white w-[95%] h-[90%]'>Dashboard here</div>
		</div>
	)
}

export default Dashboard

import { useState } from 'react'

const ProgressBar = ({ progress }) => {
	console.log(progress)

	return (
		<div className='w-full max-w-md p-4'>
			<div className='w-full bg-gray-200 rounded-full h-4'>
				<div
					className='bg-green-500 h-4 rounded-full transition-all'
					style={{ width: `${progress * 100}%` }}
				>
					{(progress * 100).toFixed(0)}%
				</div>
			</div>
		</div>
	)
}

export default ProgressBar

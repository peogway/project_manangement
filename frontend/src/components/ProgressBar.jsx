import { useState } from 'react'

const ProgressBar = () => {
	const [progress, setProgress] = useState(50) // Set initial progress

	return (
		<div className='w-full max-w-md p-4'>
			<div className='w-full bg-gray-200 rounded-full h-4'>
				<div
					className='bg-blue-500 h-4 rounded-full transition-all'
					style={{ width: `${progress}%` }}
				></div>
			</div>
			<button
				className='mt-4 px-4 py-2 bg-blue-600 text-white rounded'
				onClick={() => setProgress((prev) => (prev >= 100 ? 0 : prev + 10))}
			>
				Increase Progress
			</button>
		</div>
	)
}

export default ProgressBar


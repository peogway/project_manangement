const ProgressBar = ({ progress }) => {
	return (
		<div className='w-full bg-gray-200 rounded-full h-2'>
			<div
				className='bg-orange-600 h-2 rounded-full transition-all'
				style={{ width: `${progress}%` }}
			></div>
		</div>
	)
}

export default ProgressBar

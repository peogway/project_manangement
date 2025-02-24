import { useState } from 'react'

const ProgressBar = ({ progress, color, showPercent }) => {
	return (
		<div className='w-[200px] max-w-md '>
			<div className='w-full bg-gray-200 rounded-full h-1'>
				<div
					className={`${color} h-1 rounded-full transition-all`}
					style={{ width: `${progress * 100}%` }}
				>
					{showPercent && `${(progress * 100).toFixed(0)}%`}
				</div>
			</div>
		</div>
	)
}

export default ProgressBar

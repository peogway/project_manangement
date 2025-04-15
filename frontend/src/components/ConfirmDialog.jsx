import React from 'react'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
			onClick={onClose}
		>
			<div
				className='bg-white rounded-lg shadow-lg p-6 w-[400px] flex flex-col items-center'
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
			>
				<p className='text-gray-700 text-lg mb-4'>{message}</p>
				<div className='flex gap-4'>
					<button
						className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'
						onClick={onConfirm}
					>
						Confirm
					</button>
					<button
						className='bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400'
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmDialog

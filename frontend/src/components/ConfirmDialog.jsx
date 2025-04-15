import React from 'react'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 top-10 flex justify-center items-start z-1000 '
			onClick={onClose}
		>
			<div
				className='bg-white rounded-2xl [box-shadow:10px_10px_50px_rgba(56,55,55,0.3)] shadow-2xl p-6 py-10 shadow-xl w-[500px] min-h-[200px] text-center h-auto flex flex-col items-center'
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
			>
				<p className='text-gray-700 text-xl mb-10'>{message}</p>
				<div className='flex gap-10'>
					<button
						className='bg-orange-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600'
						onClick={onConfirm}
					>
						Confirm
					</button>
					<button
						className='bg-gray-300 text-gray-700 px-4 py-2 rounded-2xl hover:bg-gray-400'
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


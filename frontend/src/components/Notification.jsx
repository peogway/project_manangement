import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, className }) => {
	if (!message) {
		return null
	}

	const baseStyles =
		'z-10000 fixed top-0 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg transition-transform duration-500 ease-in-out'
	const colorStyles =
		className === 'error'
			? 'bg-red-500 text-white'
			: className === 'notification'
			? 'bg-green-500 text-white'
			: 'bg-gray-500 text-white'

	return (
		<div
			className={`${baseStyles} ${colorStyles} ${
				message ? 'translate-y-12' : '-translate-y-full'
			}`}
		>
			{message}
		</div>
	)
}

Notification.propTypes = {
	message: PropTypes.string,
	className: PropTypes.string,
}

export default Notification

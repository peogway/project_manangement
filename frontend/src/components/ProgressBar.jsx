const ProgressBar = ({ progress, color, className, height }) => {
	return (
		<div className={className ? className : ''}>
			<div
				className={`w-full bg-gray-200 rounded-full ${height ? height : 'h-2'}`}
			>
				<div
					className={`${color ? color : 'bg-orange-500'} ${
						height ? height : 'h-2'
					} rounded-full transition-all`}
					style={{ width: `${progress}%` }}
				></div>
			</div>
		</div>
	)
}

export default ProgressBar

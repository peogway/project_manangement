const ProgressBar = ({ progress, color, className, height, bgColor }) => {
	return (
		<div className={className ? className : ''}>
			<div
				className={`w-full ${bgColor ? bgColor : 'bg-gray-200'} rounded-full ${
					height ? height : 'h-2'
				}`}
			>
				<div
					className={`${color ? color : 'bg-orange-400'} ${
						height ? height : 'h-2'
					} rounded-full transition-all`}
					style={{ width: `${progress}%` }}
				></div>
			</div>
		</div>
	)
}

export default ProgressBar

import { useState, useEffect } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

const CircularChart = ({ initial, after, percent }) => {
	const [animatedPercentage, setAnimatedPercentage] = useState(
		percent !== undefined && !isNaN(percent) ? percent : initial
	)

	useEffect(() => {
		let start = animatedPercentage
		const duration = 500 // animation duration in ms
		const stepTime = 20
		const steps = duration / stepTime

		const increment = (after - initial) / steps

		const animate = () => {
			if (after === 0 || after === animatedPercentage) return

			start += increment
			if (
				(increment > 0 && start > after) ||
				(increment < 0 && start < after)
			) {
				setAnimatedPercentage(after)
			} else {
				setAnimatedPercentage(Math.ceil(start))
				setTimeout(animate, stepTime)
			}
		}
		animate()
	}, [after])

	return (
		<div className={`w-40 h-40 `}>
			{(animatedPercentage === 0 ||
				animatedPercentage === null ||
				percent === 0) && (
				<div
					className='text-[#f97316] text-[30px] relative transform -translate-x-[-40%] -translate-y-[-220%]'
					style={{
						content: `'0%'`,
					}}
				>
					0%
				</div>
			)}
			{((animatedPercentage > 0 && animatedPercentage < 100) ||
				(percent > 0 && percent < 100)) && (
				<div
					className='text-[#f97316] text-[30px] relative transform -translate-x-[-35%] -translate-y-[-220%]'
					style={{
						content: `'${
							percent !== undefined
								? Math.floor(percent)
								: Math.floor(animatedPercentage)
						}%'`,
					}}
				>
					{percent !== undefined
						? Math.floor(percent)
						: Math.floor(animatedPercentage)}
					%
				</div>
			)}
			{(animatedPercentage === 100 || percent === 100) && (
				<div
					className='text-[#f97316] text-[30px] relative transform -translate-x-[-30%] -translate-y-[-220%]'
					style={{
						content: '100%',
					}}
				>
					100%
				</div>
			)}
			<CircularProgressbar
				value={
					percent !== undefined
						? Math.floor(percent)
						: animatedPercentage === null
						? 0
						: Math.floor(animatedPercentage)
				}
				styles={buildStyles({
					pathColor: `rgba(234, 88, 12, 2)`,
					trailColor: '#f1f5f9',
					backgroundColor: '#3e98c7',
				})}
			/>
		</div>
	)
}

export default CircularChart


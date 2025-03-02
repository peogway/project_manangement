import { useState, useEffect } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

const CircularChart = ({ initial, after }) => {
	const [animatedPercentage, setAnimatedPercentage] = useState(initial)
	// console.log(initial, after)
	// console.log(animatedPercentage, initial)

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
		<div className={`w-40 h-40 mt-7 mb-1 `}>
			{(animatedPercentage === 0 || animatedPercentage === null) && (
				<div
					className='text-[#f97316] text-[30px] absolute transform -translate-x-[-160%] -translate-y-[-110%]'
					style={{
						content: `'${0}%'`,
					}}
				>
					{animatedPercentage === null ? 0 : animatedPercentage.toFixed(0)}%
				</div>
			)}
			{animatedPercentage > 0 && animatedPercentage < 100 && (
				<div
					className='text-[#f97316] text-[30px] absolute transform -translate-x-[-110%] -translate-y-[-110%]'
					style={{
						content: `'${
							animatedPercentage === null ? 0 : animatedPercentage.toFixed(0)
						}%'`,
					}}
				>
					{animatedPercentage === null ? 0 : animatedPercentage.toFixed(0)}%
				</div>
			)}
			{animatedPercentage === 100 && (
				<div
					className='text-[#f97316] text-[30px] absolute transform -translate-x-[-70%] -translate-y-[-110%]'
					style={{
						content: `'${
							animatedPercentage === null ? 0 : animatedPercentage.toFixed(0)
						}%'`,
					}}
				>
					{animatedPercentage === null ? 0 : animatedPercentage.toFixed(0)}%
				</div>
			)}
			<CircularProgressbar
				value={animatedPercentage === null ? 0 : animatedPercentage.toFixed(0)}
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


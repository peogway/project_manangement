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
		<div className='w-40 h-40 mt-7 mb-1'>
			<CircularProgressbar
				value={animatedPercentage === null ? 0 : animatedPercentage.toFixed(0)}
				text={`${
					animatedPercentage === null ? 0 : animatedPercentage.toFixed(0)
				}%`}
				styles={buildStyles({
					textSize: '16px',
					pathColor: `rgba(234, 88, 12, 2)`,
					textColor: '#f97316',
					trailColor: '#f1f5f9',
					backgroundColor: '#3e98c7',
				})}
			/>
		</div>
	)
}

export default CircularChart


import { useEffect, useState } from 'react'
import WaterDrop from './WaterDrop'

const WaterWave = ({ initial, after, percent, animate }) => {
	const [rainAnimation, setRainAnimation] = useState(true)
	const [animatedPercentage, setAnimatedPercentage] = useState(
		percent !== undefined && !isNaN(percent) ? percent : initial
	)

	useEffect(() => {
		let start = animatedPercentage
		const duration = 1000 // animation duration in ms
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
				setRainAnimation(false)
			} else {
				setAnimatedPercentage(Math.ceil(start))
				setTimeout(animate, stepTime)
			}
		}

		animate()
	}, [after])
	return (
		<div className='absolute  w-[160px]  h-[146px] overflow-hidden rounded-full mt-5 top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%]'>
			{rainAnimation && animate && (
				<div className='aboslute'>
					<WaterDrop
						topStart={0}
						topEnd={110 - after}
						duration={0.46}
						left={-20}
					/>
					<WaterDrop
						topStart={-5}
						topEnd={109 - after}
						duration={0.73}
						left={0}
					/>
					<WaterDrop
						topStart={-10}
						topEnd={108 - after}
						duration={0.41}
						left={10}
					/>
					<WaterDrop
						topStart={-21}
						topEnd={107 - after}
						duration={0.26}
						left={25}
					/>
					<WaterDrop
						topStart={-26}
						topEnd={106 - after}
						duration={0.73}
						left={30}
					/>
					<WaterDrop
						topStart={-27}
						topEnd={105 - after}
						duration={0.58}
						left={40}
					/>
					<WaterDrop
						topStart={-28}
						topEnd={104 - after}
						duration={0.37}
						left={50}
					/>
					<WaterDrop
						topStart={-25}
						topEnd={103 - after}
						duration={0.54}
						left={60}
					/>
					<WaterDrop
						topStart={-21}
						topEnd={103 - after}
						duration={0.37}
						left={80}
					/>
					<WaterDrop
						topStart={-18}
						topEnd={109 - after}
						duration={0.71}
						left={90}
					/>
					<WaterDrop
						topStart={-15}
						topEnd={112 - after}
						duration={0.63}
						left={100}
					/>
					<WaterDrop
						topStart={-10}
						topEnd={112 - after}
						duration={0.53}
						left={115}
					/>
				</div>
			)}
			<div
				className='absolute w-[200%] h-[200%] bg-[#07bdff]s bg-orange-200 left-[-50%] opacity-50 rounded-[45%] animate-[wave_5s_linear_infinite]'
				style={{
					top: `${100 - (animate ? animatedPercentage : after)}%`,
				}}
			/>
			<div
				className='absolute w-[204%] h-[204%] bg-[#07bdff]s bg-orange-300  left-[-58%] rounded-[40%] animate-[wave-anti-clockwise_6.2s_linear_infinite]'
				style={{
					top: `${105 - (animate ? animatedPercentage : after)}%`,
				}}
			/>
			<div className='text-slate-600 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full flex justify-center items-center text-4xl'>
				{animate ? Math.floor(animatedPercentage) : Math.floor(after)}%
			</div>
		</div>
	)
}

export default WaterWave


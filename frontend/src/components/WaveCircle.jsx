import { useEffect, useRef } from 'react'

// Utils
const mapRange = (a, b, c, d, e) => ((a - b) * (e - d)) / (c - b) + d
const sin = (t) => Math.sin(t)
const cos = (t) => Math.cos(t)
const PI = Math.PI
const TAO = PI * 2
const LOOP = 4

// Raf
class Raf {
	constructor() {
		this.raf()
	}

	raf() {
		if (this.onRaf) {
			window.requestAnimationFrame(() => {
				const o = {}
				o.time = window.performance.now() / 1000
				o.playhead = (o.time % LOOP) / LOOP
				this.raf()
				this.onRaf(o)
			})
		}
	}
}

// Canvas Component
const WaveCircle = () => {
	const canvasRef = useRef(null)
	const divRef = useRef(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const divElement = divRef.current
		if (!canvas || !divElement) return

		const ctx = canvas.getContext('2d')
		const dpr = window.devicePixelRatio

		// Resize canvas
		const resize = () => {
			const width = divElement.clientWidth
			const height = divElement.clientHeight

			canvas.style.width = `${width}px`
			canvas.style.height = `${height}px`
			canvas.width = width * dpr
			canvas.height = height * dpr
		}
		resize()
		window.addEventListener('resize', resize)

		class Circle extends Raf {
			constructor(obj) {
				super()
				Object.assign(this, obj)
				this.draw()
			}

			draw(playhead = 0, time = 0) {
				this.ctx.save()
				this.ctx.translate(
					(divElement.clientWidth / 2) * this.dpr,
					(divElement.clientHeight / 2) * this.dpr - 30 * this.dpr
				)

				this.ctx.rotate(PI)
				this.ctx.strokeStyle = this.color
				this.ctx.fillStyle = 'rgba(0, 100 , 0, 0 )'
				this.ctx.lineWidth = this.lineWidth
				this.ctx.beginPath()

				for (let i = 0; i <= this.points; i++) {
					const p = i / this.points
					const times = 7
					const phase = mapRange(
						cos(p * TAO),
						-1,
						1,
						1,
						mapRange(
							sin(((this.offset + time * this.speed) * 0.2 + p) * times * TAO),
							-1,
							1,
							0.5,
							0.58
						)
					)
					let x = phase * this.radius * sin(p * TAO)
					let y = phase * this.radius * cos(p * TAO)
					const type = i === 0 ? 'moveTo' : 'lineTo'
					this.ctx[type](x, y)
				}

				this.ctx.fill()
				this.ctx.stroke()
				this.ctx.restore()
			}

			onRaf({ playhead, time }) {
				this.draw(playhead, time)
			}
		}

		// Clear function
		const clear = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
		}

		// Animation loop
		class Canvas extends Raf {
			constructor(ctx) {
				super()
				this.ctx = ctx
			}

			onRaf() {
				clear()
			}
		}

		const animationCanvas = new Canvas(ctx)

		// Create circles
		for (let i = 0; i < 8; i++) {
			new Circle({
				ctx: ctx,
				dpr: dpr,
				lineWidth: 1 * dpr,
				points: 200,
				offset: i * 1.5,
				speed: 0.7,
				radius: (150 - i * 4) * dpr,
				color: `hsl(${190 + i * 10}, 60%, 70%)`,
			})
		}

		return () => {
			window.removeEventListener('resize', resize)
		}
	}, [])

	return (
		<div className='canvas w-[320px] h-[300px] relative' ref={divRef}>
			<canvas ref={canvasRef} id='canvas'></canvas>
		</div>
	)
}

export default WaveCircle


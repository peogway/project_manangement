import { useState, useRef, useEffect } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

const CategoryList = ({ categories }) => {
	const [visibleCategories, setVisibleCategories] = useState([])
	const [isFull, setIsFull] = useState(false)
	const [isHover, setIsHover] = useState(false)

	const containerRef = useRef(null)

	useEffect(() => {
		if (!containerRef.current) return
		const container = containerRef.current
		const containerWidth = containerRef.current.offsetWidth
		let totalWidth = 0
		const fittingCategories = []
		let stack = 1
		let index = 0
		// Add items until the total width exceeds container's width

		while (index < categories.length) {
			const category = categories[index]
			const categoryElement = document.createElement('div')
			categoryElement.style.visibility = 'hidden'
			categoryElement.className =
				'bg-gray-200 rounded-xl p-1 border-slate-300 h-[30px] flex items-center justify-center text-[16px] max-w-[270px] whitespace-nowrap overflow-hidden text-ellipsis'
			categoryElement.innerText = category.name
			container.appendChild(categoryElement)

			const categoryWidth = categoryElement.offsetWidth
			container.removeChild(categoryElement)

			if (totalWidth + categoryWidth + 4 <= containerWidth) {
				fittingCategories.push(category)
				totalWidth += categoryWidth + 4
				index += 1
			} else {
				stack += 1
				if (stack > 2) {
					while (totalWidth + 30 >= containerWidth) {
						const lastCategory = fittingCategories[fittingCategories.length - 1]
						const lastCategoryElement = document.createElement('div')
						lastCategoryElement.style.visibility = 'hidden'
						lastCategoryElement.className =
							'bg-gray-200 rounded-xl p-1 border-slate-300 h-[30px] flex items-center justify-center text-[16px] max-w-[270px] whitespace-nowrap overflow-hidden text-ellipsis'
						lastCategoryElement.innerText = lastCategory.name
						container.appendChild(lastCategoryElement)

						const lastCategoryWidth = lastCategoryElement.offsetWidth
						container.removeChild(lastCategoryElement)
						totalWidth -= lastCategoryWidth + 4
						fittingCategories.pop()
					}
					setIsFull(true)
					break
				}
				totalWidth = 0
			}
		}

		if (stack <= 2) {
			setIsFull(false)
		}

		setVisibleCategories(fittingCategories)
	}, [categories])

	return (
		<div
			ref={containerRef}
			className={`flex flex-wrap gap-1 w-[280px] min-h-[67px] absolute top-[-75px] ml-3  h-[67px] overflow-hidden  ${
				categories.length > 1
					? `${
							isHover
								? 'h-auto z-999 p-2  absolute bg-gray-100 rounded-2xl'
								: ''
					  }`
					: ''
			}  ${categories.length > 0 && isHover && isFull ? 'box' : ''}`}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
		>
			{(isHover ? categories : visibleCategories).map((category, index) => (
				<div key={category.id}>
					<div
						className={`${
							isHover
								? 'justify-center'
								: 'max-w-[270px] whitespace-nowrap overflow-hidden text-ellipsis justify-start'
						} rounded-xl p-1 border-slate-200 bg-gray-200  h-auto items-center`}
					>
						{category.name}
					</div>
				</div>
			))}
			{(isFull || (visibleCategories.length === 0 && categories.length > 0)) &&
				!isHover && (
					<div
						className={`${
							visibleCategories.length === 0 ? 'absolute top-3 ' : ''
						} bg-gray-200 rounded-xl p-1 border-slate-300 h-[20px] flex items-center justify-center self-start relative top-3`}
					>
						<MoreHorizIcon fontSize='small' />
					</div>
				)}
		</div>
	)
}

export default CategoryList

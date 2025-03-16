import { useState, useRef, useEffect } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'

const CategoryList = ({ categories }) => {
	const [visibleCategories, setVisibleCategories] = useState([])
	const [isFull, setIsFull] = useState(false)
	const [isHovered, setIsHovered] = useState(false)
	const containerRef = useRef(null)

	useEffect(() => {
		if (!containerRef.current) return
		const container = containerRef.current
		const containerWidth = containerRef.current.offsetWidth
		let totalWidth = 0
		const fittingCategories = []
		let stack = 1

		// Add items until the total width exceeds container's width
		for (const category of categories) {
			const categoryElement = document.createElement('div')
			categoryElement.style.visibility = 'hidden'
			categoryElement.className =
				'bg-gray-200 rounded-xl p-1 border-slate-300 h-[30px] flex items-center justify-center text-[16px]'
			categoryElement.innerText = category.name
			container.appendChild(categoryElement)

			const categoryWidth = categoryElement.offsetWidth
			container.removeChild(categoryElement)

			if (totalWidth + categoryWidth + 4 <= containerWidth) {
				fittingCategories.push(category)
				totalWidth += categoryWidth + 4
			} else {
				stack += 1
				if (stack > 2) {
					while (totalWidth + 30 >= containerWidth) {
						const lastCategory = fittingCategories[fittingCategories.length - 1]
						const lastCategoryElement = document.createElement('div')
						lastCategoryElement.style.visibility = 'hidden'
						lastCategoryElement.className =
							'bg-gray-200 rounded-xl p-1 border-slate-300 h-[30px] flex items-center justify-center text-[16px]'
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
					? 'hover:h-auto hover:z-999 hover:p-2  hover:absolute hover:bg-gray-100 hover:rounded-2xl'
					: ''
			} `}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{(isHovered ? categories : visibleCategories).map((category, index) => (
				<div key={category.id}>
					<div
						className={`${
							isHovered ? 'bg-gray-300 ' : 'bg-gray-200 whitespace-nowrap '
						} rounded-xl p-1 border-slate-200  h-auto flex justify-center items-center`}
					>
						{category.name}
					</div>
				</div>
			))}
			{(isFull || (visibleCategories.length === 0 && categories.length > 0)) &&
				!isHovered && (
					<div
						className={`${
							visibleCategories.length === 0 ? 'absolute top-3 ' : ''
						} bg-gray-200 rounded-xl p-1 border-slate-300 h-[20px] flex items-center justify-center self-end`}
					>
						<MoreHorizIcon fontSize='small' />
					</div>
				)}
			{/* {categories.length === 0 && (
				<div className='flex absolute top-4 justify-start items-start w-full h-full text-gray-400 gap-1 absolute mt-5 ml-17'>
					<DoNotDisturbAltIcon />
					No Categories
				</div>
			)} */}
		</div>
	)
}

export default CategoryList

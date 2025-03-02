import React, { useState } from 'react'

const SortDropdown = ({ setSortValue, sortTasks, initlaValue, sortByDate }) => {
	const [selectedSort, setSelectedSort] = useState(
		initlaValue ? initlaValue : 'A-Z'
	)

	const handleChange = (e) => {
		setSelectedSort(e.target.value)
		setSortValue(e.target.value) // Pass value up
	}
	return (
		<select
			value={selectedSort}
			onChange={handleChange}
			className=' rounded-lg w-[80px]'
		>
			<optgroup label='Order'>
				<option value='A-Z'>A-Z</option>
				<option value='Z-A'>Z-A</option>
			</optgroup>
			{sortByDate && (
				<optgroup label='Date'>
					<option value='newest'>Newest</option>
					<option value='oldest'>Oldest</option>
				</optgroup>
			)}
			{sortTasks && (
				<optgroup label='Priority'>
					<option value='increasing'>Priority &#x2191;</option>
					<option value='decreasing'>Priority &#x2193;</option>
				</optgroup>
			)}
		</select>
	)
}

export default SortDropdown

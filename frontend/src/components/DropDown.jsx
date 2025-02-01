import React, { useState } from 'react'

const Dropdown = ({ options, onSelect }) => {
	const [selectedOption, setSelectedOption] = useState(options[0])

	const handleSelectOption = (e) => {
		setSelectedOption(e.target.value)
		onSelect(e.target.value) // Pass selected option back to parent
	}

	return (
		<select
			className='dropdown'
			value={selectedOption}
			onChange={handleSelectOption}
		>
			{options.map((option) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	)
}

export default Dropdown


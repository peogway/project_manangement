import React, { useState } from 'react'

const Dropdown = ({ options, onSelect, description }) => {
	const [selectedOption, setSelectedOption] = useState(
		description !== undefined ? '' : options[0]
	)

	const handleSelectOption = (e) => {
		setSelectedOption(e.target.value)
		onSelect(e.target.value) // Pass selected option back to parent
	}

	return (
		<select
			className={`dropdown ${selectedOption === '' ? 'default' : ''}`}
			value={selectedOption}
			onChange={handleSelectOption}
		>
			{description && (
				<option value='' disabled>
					{description}
				</option>
			)}
			{options.map((option) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	)
}

export default Dropdown


import React, { useState, forwardRef } from 'react'

const Dropdown = forwardRef(
	({ options, onSelect, description, value }, ref) => {
		const [selectedOption, setSelectedOption] = useState(
			description !== undefined ? '' : options[0]
		)

		const handleSelectOption = (e) => {
			if (!value) {
				setSelectedOption(e.target.value)
			}
			onSelect(e.target.value) // Pass selected option back to parent
		}

		return (
			<select
				ref={ref}
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
)

export default Dropdown

